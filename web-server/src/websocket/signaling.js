// const { createServer } = require('http');
// const WebSocket = require('ws');
// const { RTCPeerConnection, RTCSessionDescription } = require('wrtc');
// const { spawn } = require('child_process');

// const PORT = process.env.WEBRTC_PORT || 4000;
// const server = createServer();
// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {
//     console.log('Cliente WebRTC conectado');

//     ws.on('message', async (message) => {
//         const data = JSON.parse(message);

//         if (data.type === 'offer') {
//             console.log('Recibida oferta WebRTC');
//             const answer = await handleWebRTCOffer(data.sdp, ws);
//             ws.send(JSON.stringify({ type: 'answer', sdp: answer }));
//         }
//     });

//     ws.on('close', () => console.log('Cliente WebRTC desconectado'));
// });

// async function handleWebRTCOffer(offer, ws) {
//     const peer = new RTCPeerConnection({
//         iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//     });

//     peer.ontrack = (event) => {
//         console.log('Recibiendo video desde WebRTC...');
//         startFFmpeg(event.streams[0]);
//     };

//     await peer.setRemoteDescription(new RTCSessionDescription(offer));
//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);

//     return answer;
// }

// function startFFmpeg(stream) {
//     console.log('Iniciando FFmpeg para convertir WebRTC a RTMP...');

//     const ffmpeg = spawn('ffmpeg', [
//         '-i', '-',  // Entrada desde WebRTC
//         '-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'zerolatency',
//         '-f', 'flv',
//         'rtmp://node-media-server:1935/live/stream_camara'
//     ]);

//     ffmpeg.stdin.on('error', (e) => console.error('Error en FFmpeg:', e));
//     ffmpeg.stderr.on('data', (data) => console.log(`FFmpeg: ${data}`));

//     stream.getTracks().forEach(track => {
//         const sender = peer.addTrack(track, stream);
//         sender.replaceTrack(track);
//     });
// }

// server.listen(PORT, () => {
//     console.log(`Servidor WebRTC corriendo en http://localhost:${PORT}`);
// });
