const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const vueAppPath = path.join(__dirname, 'vue-app');

function log(message) {
	console.log(`[PostInstall] ${message}`);
}

function handleError(error) {
	console.error(`[PostInstall Error] ${error.message}`);
	process.exit(1);
}

async function buildVueApp() {
	try {
		// Check if we're installed as a dependency
		const isInstalledAsDependency =
			path.basename(path.join(__dirname, '..')) === 'node_modules';

		// Skip build if we're in development (not installed as dependency)
		if (!isInstalledAsDependency) {
			log('Skipping build in development environment');
			return;
		}

		// Check if vue-app directory exists
		if (!fs.existsSync(vueAppPath)) {
			throw new Error('vue-app directory not found');
		}

		// Install dependencies
		log('Installing Vue app dependencies...');
		await new Promise((resolve, reject) => {
			exec(
				'npm install',
				{
					cwd: vueAppPath,
				},
				(error) => {
					if (error) {
						reject(error);
						return;
					}
					resolve();
				}
			);
		});

		// Build the app
		log('Building Vue application...');
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
				(error) => {
					if (error) {
						reject(error);
						return;
					}
					resolve();
				}
			);
		});

		log('Vue app built successfully');
	} catch (error) {
		handleError(error);
	}
}

// Run the build
buildVueApp();
