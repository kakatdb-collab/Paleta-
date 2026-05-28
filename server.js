const express = require('express');
const path = require('path');
const fs = require('fs');

const distPath = path.join(__dirname, 'dist');
const app = express();

// Serve the static files from the build (dist) directory
app.use(express.static(distPath));

// Send all other requests to index.html for React template routing
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('Application build is missing. Please ensure "npm run build" is executed before visiting this page.');
  }
});

// Configure PORT for standard environments vs Passenger UNIX sockets
const PORT = process.env.PORT || 3000;

// If PORT is not a number, it's a UNIX socket (typical in Phusion Passenger / Hostinger)
if (isNaN(PORT)) {
  app.listen(PORT, () => {
    console.log(`Server is running on Passenger UNIX socket: ${PORT}`);
  });
} else {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${parseInt(PORT, 10)}`);
  });
}
