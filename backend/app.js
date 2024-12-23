const express = require('express');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const SECRET = 'saipavan2620';

app.use(bodyParser.json());

// Initialize SQLite
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("CREATE TABLE videos (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, description TEXT, url TEXT, FOREIGN KEY(user_id) REFERENCES users(id))");
  db.run("INSERT INTO users (username, password) VALUES ('test', 'password')");
});

// Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');
  
  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch {
    res.status(401).send('Invalid token');
  }
};

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Server error');
            return;
        }
        console.log('Received credentials:', username, password);
        console.log('Database rows:', rows);

        const user = rows.find(
            (row) => row.username === username && row.password === password
        );

        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            'secret_key',
            { expiresIn: '1h' }
        );

        res.json({ user, token });
    });
});


// Upload video endpoint
app.post('/upload', authenticate, (req, res) => {
  const { googleDriveUrl } = req.body;
  const title = `Video ${Date.now()}`;
  const description = 'Uploaded from Google Drive';

  db.run("INSERT INTO videos (user_id, title, description, url) VALUES (?, ?, ?, ?)", [req.user.id, title, description, googleDriveUrl], function (err) {
    if (err) return res.status(500).send('Error uploading video');
    res.send('Video uploaded successfully');
  });
});

// Fetch videos endpoint
app.get('/videos', authenticate, (req, res) => {
  const { title = '' } = req.query;
  db.all("SELECT * FROM videos WHERE user_id = ? AND title LIKE ?", [req.user.id, `%${title}%`], (err, rows) => {
    if (err) return res.status(500).send('Error fetching videos');
    res.json(rows);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
