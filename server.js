import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __filename and __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static files from the build (dist) directory
app.use(express.static(path.join(__dirname, 'dist')));

// Send all other requests to index.html for React template routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
