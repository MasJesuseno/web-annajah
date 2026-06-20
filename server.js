const http = require('http');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => {
    handle(req, res);
  }).listen(3000, (err) => {
    if (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
    console.log('> Next.js ready on port 3000');
  });
}).catch((err) => {
  console.error('Next.js prepare failed:', err);
  process.exit(1);
});
