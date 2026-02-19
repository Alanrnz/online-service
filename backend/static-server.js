const express = require('express');
const path = require('path');

const app = express();
const frontendPath = path.join(__dirname, '..', 'frontend');

app.use(express.static(frontendPath));

const PORT = process.env.FRONTEND_PORT || 3000;
app.listen(PORT, () => {
  console.log(`📦 Static frontend server running at http://localhost:${PORT}`);
});
