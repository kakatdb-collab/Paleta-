const express = require('express');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const distPath = path.join(__dirname, 'dist');

// Auto-build fallback if dist folder is missing (very common on Hostinger/cPanel)
if (!fs.existsSync(distPath)) {
  console.log('dist/ directory not found on startup. Executing production build...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Production build completed successfully!');
  } catch (error) {
    console.error('Failed to run production build on startup:', error);
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static files from the build (dist) directory
app.use(express.static(distPath));

// Send all other requests to index.html for React template routing
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('Application build in progress or dist/index.html is missing. Please refresh in a moment.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
