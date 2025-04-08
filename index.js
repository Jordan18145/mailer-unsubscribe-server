const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const unsubFile = path.join('/data', 'unsubscribed.json');

// Ensure unsubscribed file exists
if (!fs.existsSync(unsubFile)) {
  fs.writeFileSync(unsubFile, JSON.stringify([]));
}

// Route: GET /
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h2>Welcome to the Mailer Unsubscribe Service</h2>
      <p>To unsubscribe, please use the link provided in your email.</p>
    </div>
  `);
});

// Route: GET /unsubscribe?email=...
app.get('/unsubscribe', (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).send('<h2>Missing email address.</h2>');
  }

  let unsubList = JSON.parse(fs.readFileSync(unsubFile));

  if (!unsubList.includes(email)) {
    unsubList.push(email);
    fs.writeFileSync(unsubFile, JSON.stringify(unsubList, null, 2));
    console.log('✅ Updated unsub list:', unsubList); // <-- Add this line
  }

  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h2>✅ You’ve been successfully unsubscribed.</h2>
      <p style="color: #666;">You will no longer receive emails from us at <strong>${email}</strong>.</p>
    </div>
  `);
});

// Route: GET /unsub-list
app.get('/unsub-list', (req, res) => {
    const unsubList = JSON.parse(fs.readFileSync(unsubFile));
    res.json(unsubList);
  });
  
  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Unsubscribe server running on port ${PORT}`);
  });