import net from 'net';

const host = 'aws-1-eu-central-1.pooler.supabase.com';
const port = 6543;

console.log(`Connecting to ${host}:${port}...`);
const socket = new net.Socket();

socket.setTimeout(5000);

socket.on('connect', () => {
    console.log('Connected!');
    socket.destroy();
});

socket.on('timeout', () => {
    console.error('Connection timed out');
    socket.destroy();
    process.exit(1);
});

socket.on('error', (err) => {
    console.error('Connection error:', err.message);
    process.exit(1);
});

socket.connect(port, host);
