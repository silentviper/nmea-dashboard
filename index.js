const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs').promises;

const http = require('http');

const id = 'signalk-nmea-dashboard';
const parse = require('url').parse;
const next = require('next');
const dgram = require('dgram');
const os = require('os');
const debug = require('debug')(id);
const path = require('path');
const createServer = require('http').createServer;

const PUBLISH_PORT = 2053;
const MULTICAST_GROUP_IP = '239.2.1.1';

const tiles = [
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

const updateTilesIP = () => {
	const interfaces = os.networkInterfaces();
	for (const interfaceName in interfaces) {
		const addresses = interfaces[interfaceName];
		for (const addressInfo of addresses) {
			if (
				addressInfo.family === 'IPv4' &&
				!addressInfo.internal &&
				interfaceName === 'eth0'
			) {
				tiles[0].IP = addressInfo.address;
				tiles[0].Icon = `http://${addressInfo.address}:3001/assets/img/logo.png`;
				tiles[0].URL = `http://${addressInfo.address}:3001/nmea-dashboard/`;
			}
		}
	}
};

let intervalid;

const getPublishMessage = (tile) => {
	return JSON.stringify({
		Version: '1',
		Source: tile['Source'],
		IP: tile['IP'],
		FeatureName: tile['FeatureName'],
		Text: [
			{
				Language: 'en',
				Name: tile['Name'],
				Description: tile['Description'],
			},
		],
		Icon: tile['Icon'],
		URL: tile['URL'],
		OnlyShowOnClientIP: 'true',
		BrowserPanel: {
			Enable: true,
			ProgressBarEnable: true,
			MenuText: [
				{
					Language: 'en',
					Name: tile['MenuText'],
				},
			],
		},
	});
};

const send = (msg, fromAddress, toAddress, port) => {
	const socket = dgram.createSocket('udp4');
	socket.once('listening', () => {
		socket.send(msg, port, toAddress, () => {
			socket.close();
			debug(`${fromAddress}=>${toAddress} @${port} ${msg}`);
		});
	});
	socket.bind(PUBLISH_PORT, fromAddress);
};

const publishToNavico = (tiles) => {
	for (const [name, infos] of Object.entries(os.networkInterfaces())) {
		for (const addressInfo of infos || []) {
			tiles.forEach((tile) => {
				if (addressInfo.address == tile['IP']) {
					debug('tile: %j', JSON.stringify(tile));
					send(
						getPublishMessage(tile),
						addressInfo.address,
						MULTICAST_GROUP_IP,
						PUBLISH_PORT
					);
				}
			});
		}
	}
};
// Your existing code here...

module.exports = (app) => {
	let webServer = null;

	async function buildVueApp() {
		const vueAppPath = path.join(__dirname, 'vue-app');

		try {
			// Check if node_modules exists, if not run npm install
			try {
				await fs.access(path.join(vueAppPath, 'node_modules'));
			} catch {
				app.debug('Installing Vue app dependencies...');
				await new Promise((resolve, reject) => {
					exec(
						'npm install',
						{
							cwd: vueAppPath,
						},
						(error, stdout, stderr) => {
							if (error) {
								app.error('Failed to install dependencies:', error);
								reject(error);
								return;
							}
							app.debug('Dependencies installed');
							resolve();
						}
					);
				});
			}

			// Build the Vue app using Vite
			app.debug('Building Vue application...');
			await new Promise((resolve, reject) => {
				exec(
					'npm run build',
					{
						cwd: vueAppPath,
						env: {
							...process.env,
							NODE_ENV: 'production',
						},
					},
					(error, stdout, stderr) => {
						if (error) {
							app.error('Build failed:', error);
							reject(error);
							return;
						}
						app.debug('Vue app built successfully');
						resolve();
					}
				);
			});
		} catch (error) {
			app.error('Failed to build Vue app:', error);
			throw error;
		}
	}

	const plugin = {
		id: 'nmea-dashboard',
		name: 'NMEA Dashboard',
		start: async (settings, restartPlugin) => {
			// update tiles object with eth0 ip address

			// Check if we are in production mode
			const isProd = process.env.NODE_ENV === 'production';
			updateTilesIP();
			app.debug('Tiles updated with IP address:', tiles);

			try {
				// Build Vue app before starting server
				await buildVueApp();

				// Start Express server
				const server = express();

				// Serve static Vue.js files from the Vite build directory
				const publicPath = path.join(__dirname, 'vue-app', 'dist');
				server.use(express.static(publicPath));

				// Handle SPA routing - send all requests to index.html
				server.get('*', (req, res, next) => {
					if (!req.path.startsWith('/api')) {
						res.sendFile(path.join(publicPath, 'index.html'));
					} else {
						next();
					}
				});

				// Start the server
				const serverPort = settings.port || 3001;
				webServer = server.listen(serverPort, () => {
					app.debug(`Web interface started on port ${serverPort}`);
					intervalid = setInterval(() => publishToNavico(tiles), 10 * 1000);
				});
			} catch (error) {
				app.error('Failed to start plugin:', error);
				throw error;
			}
		},
		stop: () => {
			clearInterval(intervalid);
			// shutdown code goes here.
			if (webServer) {
				webServer.close();
				webServer = null;
			}
			app.debug('Plugin stopped');
		},
		schema: {
			type: 'object',
			properties: {
				env: {
					type: 'string',
					title: 'Vue Environment',
					default: 'production',
				},
				port: {
					type: 'number',
					title: 'Web Server Port',
					default: 3001,
				},
			},
		},
	};

	return plugin;
};
