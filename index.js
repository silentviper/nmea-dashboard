const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs').promises;
const dgram = require('dgram');
const os = require('os');
const debug = require('debug')('signalk-nmea-dashboard');

const PUBLISH_PORT = 2053;
const MULTICAST_GROUP_IP = '239.2.1.1';

class NavicoPublisher {
	constructor(app) {
		this.app = app;
		this.intervalId = null;
		this.tiles = [
			{
				Source: 'SignalK',
				IP: '192.168.x.x',
				FeatureName: 'Signal K webapps',
				Name: 'Dashboard',
				Description: 'NMEA Dashboard',
				Icon: 'http://192.168.x.x:3001/assets/img/logo.png',
				URL: 'http://192.168.x.x:3001/nmea-dashboard/',
				MenuText: 'Signal K Menu Text',
			},
		];
	}

	updateTilesIP() {
		const interfaces = os.networkInterfaces();
		for (const interfaceName in interfaces) {
			const addresses = interfaces[interfaceName];
			for (const addressInfo of addresses) {
				if (
					addressInfo.family === 'IPv4' &&
					!addressInfo.internal &&
					interfaceName === 'eth0'
				) {
					this.tiles[0].IP = addressInfo.address;
					this.tiles[0].Icon = `http://${addressInfo.address}:3001/assets/img/logo.png`;
					this.tiles[0].URL = `http://${addressInfo.address}:3001/nmea-dashboard/`;
				}
			}
		}
	}

	getPublishMessage(tile) {
		return JSON.stringify({
			Version: '1',
			Source: tile.Source,
			IP: tile.IP,
			FeatureName: tile.FeatureName,
			Text: [
				{
					Language: 'en',
					Name: tile.Name,
					Description: tile.Description,
				},
			],
			Icon: tile.Icon,
			URL: tile.URL,
			OnlyShowOnClientIP: 'true',
			BrowserPanel: {
				Enable: true,
				ProgressBarEnable: true,
				MenuText: [
					{
						Language: 'en',
						Name: tile.MenuText,
					},
				],
			},
		});
	}

	send(msg, fromAddress, toAddress, port) {
		const socket = dgram.createSocket('udp4');
		socket.once('listening', () => {
			socket.send(msg, port, toAddress, () => {
				socket.close();
				debug(`${fromAddress}=>${toAddress} @${port} ${msg}`);
			});
		});
		socket.bind(PUBLISH_PORT, fromAddress);
	}

	publishToNavico() {
		for (const [name, infos] of Object.entries(os.networkInterfaces())) {
			for (const addressInfo of infos || []) {
				this.tiles.forEach((tile) => {
					if (addressInfo.address === tile.IP) {
						debug('tile: %j', JSON.stringify(tile));
						this.send(
							this.getPublishMessage(tile),
							addressInfo.address,
							MULTICAST_GROUP_IP,
							PUBLISH_PORT
						);
					}
				});
			}
		}
	}

	start() {
		this.updateTilesIP();
		this.app.debug('Tiles updated with IP address:', this.tiles);
		this.intervalId = setInterval(() => this.publishToNavico(), 10 * 1000);
	}

	stop() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}
}

module.exports = (app) => {
	let webServer = null;
	let navicoPublisher = null;

	const plugin = {
		id: 'nmea-dashboard',
		name: 'NMEA Dashboard',
		schema: {
			type: 'object',
			properties: {
				port: {
					type: 'number',
					title: 'Web Server Port',
					default: 3001,
				},
			},
		},

		start: async (settings) => {
			try {
				const server = express();
				const publicPath = path.join(__dirname, 'vue-app', 'dist');

				// Check if the build exists
				if (!require('fs').existsSync(publicPath)) {
					throw new Error('Vue app build not found. Please run npm install');
				}

				// Serve static files
				server.use('/nmea-dashboard', express.static(publicPath));

				// Handle SPA routing
				server.get('/nmea-dashboard/*', (req, res) => {
					res.sendFile(path.join(publicPath, 'index.html'));
				});

				// Start web server
				const serverPort = settings.port || 3001;
				webServer = server.listen(serverPort, () => {
					app.debug(`Web interface started on port ${serverPort}`);

					// Start Navico publisher after server is running
					navicoPublisher = new NavicoPublisher(app);
					navicoPublisher.start();
				});
			} catch (error) {
				app.error('Failed to start plugin:', error);
				throw error;
			}
		},

		stop: () => {
			if (navicoPublisher) {
				navicoPublisher.stop();
				navicoPublisher = null;
			}

			if (webServer) {
				webServer.close();
				webServer = null;
			}

			app.debug('Plugin stopped');
		},
	};

	return plugin;
};
