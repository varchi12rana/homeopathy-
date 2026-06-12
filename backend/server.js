const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const companyRoutes = require('./routes/companyRoutes');
const messageRoutes = require('./routes/messageRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config({ path: path.resolve(__dirname, '.env') });

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/sitemap.xml', sitemapRoutes);
app.use('/api/users', userRoutes);

app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /

Sitemap: ${baseUrl}/api/sitemap.xml`);
});

app.get('/', (req, res) => {
  res.send('Backend API is running fine...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
