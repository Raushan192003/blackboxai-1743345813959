const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize users.json if it doesn't exist
if (!fs.existsSync('users.json')) {
  fs.writeFileSync('users.json', JSON.stringify({ users: [] }));
}

// API Endpoints
app.post('/api/predict-color', (req, res) => {
  const { r, g, b } = req.body;
  
  // Simple color prediction logic
  let style = 'Neutral';
  if (r > 200 && g < 100 && b < 100) style = 'Bold Red';
  else if (g > 200 && r < 100 && b < 100) style = 'Natural Green';
  else if (b > 200 && r < 100 && g < 100) style = 'Cool Blue';
  else if (r > 200 && g > 200 && b < 100) style = 'Vibrant Yellow';
  
  res.json({ style });
});

app.post('/api/save-score', (req, res) => {
  const { colors, score, style } = req.body;
  const usersData = JSON.parse(fs.readFileSync('users.json'));
  
  const newUser = {
    id: usersData.users.length + 1,
    colors,
    score,
    style
  };

  usersData.users.push(newUser);
  fs.writeFileSync('users.json', JSON.stringify(usersData, null, 2));
  
  res.json({ success: true, user: newUser });
});

// Serve frontend files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});