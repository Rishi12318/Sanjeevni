require('dotenv').config();

const express = require('express');
const cors = require('cors');
const triageRoutes = require('./routes/triageRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({ ok: true, name: 'Sanjeevani AI backend' });
});

app.use('/api', triageRoutes);

const port = Number(process.env.PORT || 5050);
app.listen(port, () => {
  console.log(`Sanjeevani AI backend listening on http://localhost:${port}`);
});

