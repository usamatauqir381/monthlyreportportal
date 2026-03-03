const tls = require('tls');
const options = {
  host: 'aws-1-ap-northeast-2.pooler.supabase.com',
  port: 6543,
  // rejectUnauthorized: false, // try both later
};

const socket = tls.connect(options, () => {
  console.log('connected', socket.authorized, socket.authorizationError);
  console.log(socket.getPeerCertificate(true));
  socket.end();
});

socket.on('error', (err) => {
  console.error('tls error', err);
});
