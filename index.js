const Plugin = require('@signalk/server-api').Plugin;
const PluginServerApp = require('@signalk/server-api').PluginServerApp;
const createServer = require('http').createServer;
const parse = require('url').parse;
const next = require('next');
const dgram = require('dgram');
const os = require('os');
const debugLib = require('debug');

const id = 'signalk-nmea-dashboard';
const debug = debugLib(id);
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

module.exports = (app) => {
	const plugin = {
		id: 'my-signalk-plugin',
		name: 'My Great Plugin',
		start: async (settings, restartPlugin) => {
			// update tiles object with eth0 ip address
			updateTilesIP();

			// start up code goes here.
			const nextApp = next({
				dev: settings.env !== 'production',
			});

			const routes = require('./routes');
			const handler = routes.getRequestHandler(nextApp);

			try {
				await nextApp.prepare();
				createServer((req, res) => {
					const parsedUrl = parse(req.url, true);
					handler(req, res, parsedUrl);
				}).listen(settings.port, (err) => {
					if (err) throw err;
					debug(`Ready on localhost:${settings.port}`);
				});
			} catch (err) {
				console.error('Error starting Next.js server:', err);
			}

			intervalid = setInterval(() => publishToNavico(tiles), 10 * 1000);
		},
		stop: () => {
			// shutdown code goes here.
			clearInterval(intervalid);
		},
		schema: {
			type: 'object',
			properties: {
				env: {
					type: 'string',
					title: 'NextJS Environment',
					default: 'production',
				},
				port: {
					type: 'number',
					title: 'NextJS Server Port',
					default: 3001,
				},
			},
		},
	};

	return plugin;
};

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
	const plugin = {
		id: 'my-signalk-plugin',
		name: 'My Great Plugin',
		start: async (settings, restartPlugin) => {
			// update tiles object with eth0 ip address
			updateTilesIP();

			// start up code goes here.
			const nextApp = next({
				dev: settings.env !== 'production',
			});

			const handler = routes.getRequestHandler(nextApp);

			try {
				await nextApp.prepare();
				createServer((req, res) => {
					const parsedUrl = parse(req.url, true);
					handler(req, res, parsedUrl);
				}).listen(settings.port, (err) => {
					if (err) throw err;
					debug(`Ready on localhost:${settings.port}`);
				});
			} catch (err) {
				console.error('Error starting Next.js server:', err);
			}

			intervalid = setInterval(() => publishToNavico(tiles), 10 * 1000);
		},
		stop: () => {
			// shutdown code goes here.
			clearInterval(intervalid);
		},
		schema: {
			type: 'object',
			properties: {
				env: {
					type: 'string',
					title: 'NextJS Environment',
					default: 'production',
				},
				port: {
					type: 'number',
					title: 'NextJS Server Port',
					default: 3001,
				},
			},
		},
	};

	return plugin;
};

// Your existing code here...
