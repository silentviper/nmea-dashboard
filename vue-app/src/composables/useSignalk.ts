interface SignalKValue {
	path: string;
	value: any;
	timestamp?: string;
}

interface SignalKUpdate {
	timestamp: string;
	values: SignalKValue[];
}

interface SignalKMessage {
	context: string;
	updates: SignalKUpdate[];
}

interface SignalKSubscription {
	path: string;
	period?: number;
	format?: string;
	policy?: string;
	minPeriod?: number;
}

interface WebSocketState {
	isConnected: boolean;
	error: Error | null;
	reconnectCount: number;
}

export class SignalKWebSocket {
	private ws: WebSocket | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectTimeout: number = 1000;
	private subscriptions = new Set<SignalKSubscription>();
	private messageHandlers = new Set<(message: SignalKMessage) => void>();

	constructor(private baseUrl: string) {}

	connect() {
		try {
			this.ws = new WebSocket(
				`ws://${this.baseUrl}/signalk/v1/stream?subscribe=none`
			);

			this.ws.onopen = () => {
				console.log('WebSocket connected');
				this.reconnectAttempts = 0;
				this.resubscribe();
			};

			this.ws.onclose = () => {
				console.log('WebSocket closed');
				this.handleDisconnect();
			};

			this.ws.onerror = (error) => {
				console.error('WebSocket error:', error);
				this.handleDisconnect();
			};

			this.ws.onmessage = (event) => {
				try {
					const message: SignalKMessage = JSON.parse(event.data);
					this.messageHandlers.forEach((handler) => handler(message));
				} catch (error) {
					console.error('Error parsing WebSocket message:', error);
				}
			};
		} catch (error) {
			console.error('Error creating WebSocket:', error);
			this.handleDisconnect();
		}
	}

	private handleDisconnect() {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			this.reconnectAttempts++;
			const timeout =
				this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1);
			console.log(
				`Attempting to reconnect in ${timeout}ms (attempt ${this.reconnectAttempts})`
			);
			setTimeout(() => this.connect(), timeout);
		} else {
			console.error('Max reconnection attempts reached');
		}
	}

	subscribe(subscription: SignalKSubscription) {
		this.subscriptions.add(subscription);
		if (this.isConnected()) {
			this.sendSubscription(subscription);
		}
	}

	private resubscribe() {
		if (this.subscriptions.size > 0) {
			const request = {
				context: 'vessels.self',
				subscribe: Array.from(this.subscriptions),
			};
			this.ws?.send(JSON.stringify(request));
		}
	}

	private sendSubscription(subscription: SignalKSubscription) {
		const request = {
			context: 'vessels.self',
			subscribe: [subscription],
		};
		this.ws?.send(JSON.stringify(request));
	}

	addMessageHandler(handler: (message: SignalKMessage) => void) {
		this.messageHandlers.add(handler);
	}

	removeMessageHandler(handler: (message: SignalKMessage) => void) {
		this.messageHandlers.delete(handler);
	}

	isConnected(): boolean {
		return this.ws?.readyState === WebSocket.OPEN;
	}

	disconnect() {
		this.ws?.close();
		this.ws = null;
		this.subscriptions.clear();
		this.messageHandlers.clear();
	}
}

export function useSignalK(baseUrl: string = window.location.host) {
	const signalK = new SignalKWebSocket(baseUrl);

	return {
		connect: () => signalK.connect(),
		disconnect: () => signalK.disconnect(),
		subscribe: (subscription: SignalKSubscription) =>
			signalK.subscribe(subscription),
		addMessageHandler: (handler: (message: SignalKMessage) => void) =>
			signalK.addMessageHandler(handler),
		removeMessageHandler: (handler: (message: SignalKMessage) => void) =>
			signalK.removeMessageHandler(handler),
		isConnected: () => signalK.isConnected(),
	};
}
