const { spawn } = require('child_process');
const path = require('path');

// Start Vue dev server
const vueProcess = spawn('npm', ['run', 'dev'], {
	cwd: path.join(__dirname, '../vue-app'),
	stdio: 'inherit',
});

// Handle process termination
process.on('SIGTERM', () => {
	vueProcess.kill();
	process.exit();
});

process.on('SIGINT', () => {
	vueProcess.kill();
	process.exit();
});
