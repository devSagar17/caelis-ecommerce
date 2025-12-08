const { spawn } = require('child_process');
const path = require('path');

console.log('Starting e-commerce servers...');

// Start backend server
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  shell: true
});

backend.stdout.on('data', (data) => {
  console.log(`[Backend] ${data}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data}`);
});

backend.on('close', (code) => {
  console.log(`[Backend] Process exited with code ${code}`);
});

// Start frontend server
const frontend = spawn('python', ['-m', 'http.server', '8000'], {
  cwd: __dirname,
  shell: true
});

frontend.stdout.on('data', (data) => {
  console.log(`[Frontend] ${data}`);
});

frontend.stderr.on('data', (data) => {
  console.error(`[Frontend Error] ${data}`);
});

frontend.on('close', (code) => {
  console.log(`[Frontend] Process exited with code ${code}`);
});

console.log('Servers started successfully!');
console.log('');
console.log('To access the admin panel, open your browser and go to:');
console.log('http://localhost:8000/admin.html');
console.log('');
console.log('Press Ctrl+C to stop both servers');