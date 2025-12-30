const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const reportRoutes = require('./routes/report.routes');
const { seedReports } = require('./controllers/report.controller');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/', (_req, res) => res.send('Dainik API is running'));
app.use('/api/reports', reportRoutes);

const startServer = async () => {
  await connectDB();
  await seedReports();

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();

