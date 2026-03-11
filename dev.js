const { spawn } = require('child_process');
const path = require('path');

function runCommand(command, args, cwd, name) {
    const process = spawn(command, args, { cwd, shell: true });

    process.stdout.on('data', (data) => {
        console.log(`[${name}]: ${data}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`[${name}] ERR: ${data}`);
    });

    process.on('close', (code) => {
        console.log(`[${name}] process exited with code ${code}`);
    });

    return process;
}

const clientDir = path.join(__dirname, 'client');
const serverDir = path.join(__dirname, 'server');

console.log('Starting client and server...');

const clientProcess = runCommand('npm', ['run', 'dev'], clientDir, 'CLIENT');
const serverProcess = runCommand('npm', ['run', 'dev'], serverDir, 'SERVER');

// Handle process termination
process.on('SIGINT', () => {
    clientProcess.kill();
    serverProcess.kill();
    process.exit();
});
