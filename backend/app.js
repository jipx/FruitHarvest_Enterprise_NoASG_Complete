require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const healthRoutes = require('./routes/health');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const inventoryRoutes = require('./routes/inventory');

const app = express();

app.use(cors({ origin: '*'}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('combined'));

app.use('/health', healthRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/inventory', inventoryRoutes);

app.get('/', (req, res) => {
  res.json({
    service: 'FruitHarvest Enterprise Backend',
    version: '1.0.0',
    mode: 'No ASG',
    status: 'running'
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`FruitHarvest backend running on port ${port}`);
});
