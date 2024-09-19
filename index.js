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
	const plugin = {
		id: 'nmea-dashboard',
		name: 'NMEA Dashboard',
		start: async (settings, restartPlugin) => {
			// update tiles object with eth0 ip address
			updateTilesIP();
			app.debug('Tiles updated with IP address:', tiles);
			try {
				// start up code goes here.
				const nextApp = next({
					dev: true,
					dir: path.join(__dirname, 'src'), // Adjust this path to your Next.js app directory,
					port: 3001,
					swcMinify: false,
					appDir: true,
					conf: {
						experimental: { useWasmBinary: false },
					},
				});

				const handler = nextApp.getRequestHandler(nextApp);

				nextApp
					.prepare()
					.then(() => {
						app.debug('Next.js app is prepared');
						createServer((req, res) => {
							const parsedUrl = parse(req.url, true);
							handler(req, res, parsedUrl);
						}).listen(3001);

						app.debug(
							`> Server listening at http://localhost:${3001} as ${
								dev ? 'development' : process.env.NODE_ENV
							}`
						);
					})
					.catch((err) => {
						app.debug('Error starting Next.js server:', err);
					});
			} catch (err) {
				app.debug('Error starting Next.js server:', err);
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
