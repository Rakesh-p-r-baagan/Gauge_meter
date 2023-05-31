const express = require('express');
const app = express();
const mysql = require('mysql2');
const path = require('path');
const createTableQuery = `SELECT speed FROM Latest_Speed;`;

//------------------------------------------------------connecting to hostinger database-----------------------------------------------
const connection = mysql.createConnection({
  host: 'host_key',
  port: '3306',
  database: 'Database_name',
  user: 'user_name',
  password: 'password',
});

// Establish the connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to Hostinger database:', err);
    return;
  }
  console.log('Connected to Hostinger database!');
});

function fetchRecentData(callback) {
  connection.query(createTableQuery, (err, res) => {
    if (err) {
      console.error('Error fetching data from Latest_Speed table', err);
      callback(err, null);
      return;
    }
    const speed = parseInt(res[0].speed);
    callback(null, speed);
  });
}

//-------------------------------------------------------server side event handlers----------------------------------------------------
function sendEvent(res, type, data) {
  res.write(`data: ${JSON.stringify({ type, data })}\n\n`);
}

function sseHandler(req, res) {
  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });
  console.log('client connected');

  req.on('close', () => {
    console.log('client disconnected.');
    sendEvent(res, 'close', null);
    res.end();
  });

  const interval = setInterval(() => {
    fetchRecentData((err, data) => {
      if (err) {
        console.error('Error fetching recent data:', err);
        clearInterval(interval);
        sendEvent(res, 'error', 'Error fetching recent data');
        res.end();
        return;
      }
      sendEvent(res, 'message', data);
    });
  }, 1000);
}

//-----------------------------------------------------------host--------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public'), {
  // Set the default MIME type for JavaScript files
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'text/javascript');
    }
  }
}));

const server = app.listen(4000, () => {
  console.log('server started on 4000');
});

function handleServerClose() {
  console.log('server disconnected'); // console.log('server disconnected in handlerServerClose');
}

server.on('close', handleServerClose);

process.on('SIGINT', () => {
  server.close(() => {
    // console.log('server closed in process.on');
    process.exit(0);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/events', sseHandler);

// Serve static files from the "public" directory


