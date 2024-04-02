const jwt = require('jsonwebtoken');
const http = require('http');
const secretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxMjA3NjI2OSwiaWF0IjoxNzEyMDc2MjY5fQ.zt3Kp2p5RatjuDxsZ3Ltro8wKzSLPhu8WnBjQ_QpGBM';
const server = http.createServer((req, res) => {
  // if you run the client from sth like file:///C:/nodejs/10httonlyCookie1/index.html
  // it would mean HTML file is being served via the file:// protocol directly from your filesystem rather than over HTTP or HTTPS.
  console.log('Request origin:', req.headers.origin);
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS || 'http://localhost');// Adjust the port if necessary
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    // Preflight request automatically sends by browser for many reasons
    res.writeHead(204);//success with no content to return to the client
    res.end();
    return;
  }
  /*\ /login */
  if (req.url === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);
        if (username === 'admin' && password === '111') {
          // Create a token with a secret key
          const token = jwt.sign({ username }, secretKey, { expiresIn: '1m' });
          res.writeHead(200, {
            'Set-Cookie': `token=${token}; HttpOnly;Max-Age=60000`,
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ message: 'Logged in successfully' }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Unauthorized' }));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
      }
    });
    /*\ /something, A protected route example which is only accessable to logged in users */
  } else if (req.url === '/something' && req.method === 'GET') {
    // Check if the user is logged in by checking the cookie that the browser still holds for this origin
    const cookie = req.headers.cookie;
    // Decode the cookie
    if (cookie) {
      const token = cookie.split('=')[1];
      try {
        const decoded = jwt.verify(token, secretKey);
        console.log('Decoded token:', decoded);
        if (decoded.username === 'admin') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'You are logged in, treasure:GDENEAR' }));
        } else {
          throw new Error();
        }
      } catch (e) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unauthorized: Invalid token' }));
      }
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Unauthorized: You are not logged in.' }));
    }
  } else {
    // For any other route, return 404 not found
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404 Not Found');
  }
});
server.listen(4444, () => {
  console.log('Server running on port 4444');
});//**  Generated mostly by chatGPT ver. 4 **/
