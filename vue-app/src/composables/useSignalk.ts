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

interface SignalKConfig {
	port?: number;
	host?: string;
	protocol?: 'http' | 'ws';
	apiVersion?: string;
}

const DEFAULT_CONFIG: SignalKConfig = {
	port: 3000,
	host: window.location.hostname,
	protocol: 'ws',
	apiVersion: 'v1',
};

export class SignalKWebSocket {
	private ws: WebSocket | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectTimeout = 1000;
	private subscriptions = new Set<SignalKSubscription>();
	private messageHandlers = new Set<(message: SignalKMessage) => void>();
	private config: SignalKConfig;

	constructor(config: Partial<SignalKConfig> = {}) {
		this.config = { ...DEFAULT_CONFIG, ...config };
	}

	private get baseUrl() {
		return `${this.config.protocol === 'ws' ? 'ws' : 'http'}://${
			this.config.host
		}:${this.config.port}/signalk/${this.config.apiVersion}`;
	}

	private get wsUrl() {
		return `${this.baseUrl}/stream?subscribe=none`;
	}

	private get httpUrl() {
		return `${
			this.config.protocol === 'ws' ? 'http' : this.config.protocol
		}://${this.config.host}:${this.config.port}/signalk/${
			this.config.apiVersion
		}`;
	}

	connect() {
		try {
			this.ws = new WebSocket(this.wsUrl);

			this.ws.onopen = () => {
				console.log('SignalK WebSocket connected');
				this.reconnectAttempts = 0;
				this.resubscribe();
			};

			this.ws.onclose = () => {
				console.log('SignalK WebSocket closed');
				this.handleDisconnect();
			};

			this.ws.onerror = (error) => {
				console.error('SignalK WebSocket error:', error);
				this.handleDisconnect();
			};

			this.ws.onmessage = (event) => {
				try {
					const message: SignalKMessage = JSON.parse(event.data);
					this.messageHandlers.forEach((handler) => handler(message));
				} catch (error) {
					console.error('Error parsing SignalK WebSocket message:', error);
				}
			};
		} catch (error) {
			console.error('Error creating SignalK WebSocket:', error);
			this.handleDisconnect();
		}
	}

	private handleDisconnect() {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			this.reconnectAttempts++;
			const timeout =
				this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1);
			console.log(
				`Attempting to reconnect to SignalK in ${timeout}ms (attempt ${this.reconnectAttempts})`
			);
			setTimeout(() => this.connect(), timeout);
		} else {
			console.error('Max reconnection attempts to SignalK reached');
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

	// HTTP API methods
	async put(path: string, value: any, token?: string) {
		const url = `${this.httpUrl}/api/vessels/self/${path.replace(/\./g, '/')}`;
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
		};

		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		try {
			const response = await fetch(url, {
				method: 'PUT',
				headers,
				body: JSON.stringify({ value }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('Error making SignalK PUT request:', error);
			throw error;
		}
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

export function useSignalK(config: Partial<SignalKConfig> = {}) {
	const signalK = new SignalKWebSocket({ ...DEFAULT_CONFIG, ...config });

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
		put: (path: string, value: any, token?: string) =>
			signalK.put(path, value, token),
	};
}
