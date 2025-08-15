const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { connectDB } = require('./libs/db.js');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors({ origin: process.env.FRONTENDURL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Routes
const authRoutes = require('./routes/user.route.js');
const inventoryRoutes = require('./routes/inventory.route.js');
const Carregisteration = require('./routes/registeration.route.js');
const contactRoutes = require('./routes/contact.route.js');
const blogRoutes = require('./routes/blogs.route.js');
const orderRoutes = require('./routes/order.route.js');
const shipmentRoutes = require('./routes/shipment.route.js');
const wishlistRoutes = require('./routes/wishlist.route.js');
const wireRoutes = require('./routes/wire.route.js');
const docsRoutes = require('./routes/docs.route.js');
const walletRoutes = require('./routes/wallet.route.js');
const estimationRoutes = require('./routes/estimation.route.js');
const employeeRoutes = require('./routes/employee.route.js');
const rentRoutes = require('./routes/rent.route.js');
const estimateRoutes = require('./routes/estimate.route.js');
const invoiceRoutes = require('./routes/invoice.routes.js');

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/users/', authRoutes);
app.use('/api/inventory/', inventoryRoutes);
app.use('/api/registeration/', Carregisteration);
app.use('/api/contact/', contactRoutes);
app.use('/api/blogs/', blogRoutes);
app.use('/api/order/', orderRoutes);
app.use('/api/shipment/', shipmentRoutes);
app.use('/api/wishlist/', wishlistRoutes);
app.use('/api/wire/', wireRoutes);
app.use('/api/docs/', docsRoutes);
app.use('/api/wallet/', walletRoutes);
app.use('/api/estimation/', estimationRoutes);
app.use('/api/employee/', employeeRoutes);
app.use('/api/rentassets', rentRoutes);
app.use('/api/estimate', estimateRoutes);
app.use('/api/invoice', invoiceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();