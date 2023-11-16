import express from "express";
import { createServer } from 'http';
import { Server } from 'socket.io';
import exphbs from 'express-handlebars';
import productosRoutes from "./routes/productosRoutes.js";
import carritosRoutes from "./routes/carritosRoutes.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());

const PORT = process.env.PORT || 8080;

app.use("/api/products", productosRoutes);
app.use("/api/carts", carritosRoutes);

// Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Servidor de socket.io
io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado');

  socket.on('create product', (product) => {
    console.log(`Producto creado: ${product}`);
    io.emit('product created', product);
  });

  socket.on('delete product', (product) => {
    console.log(`Producto eliminado: ${product}`);
    io.emit('product deleted', product);
  });
});

// ruta para la vista "home.handlebars"
app.get('/', (req, res) => {
  const products = ['Producto 1', 'Producto 2', 'Producto 3'];
  res.render('home', { products });
});

// Configura la ruta para la vista "realTimeProducts.handlebars"
app.get('/realtimeproducts', (req, res) => {
  const products = ['Producto 1', 'Producto 2', 'Producto 3'];
  res.render('realTimeProducts', { products });
});

app.post('/create-product', (req, res) => {
  const product = req.body.product;
  io.emit('create product', product);
  res.send('Producto creado');
});

app.post('/delete-product', (req, res) => {
  const product = req.body.product;
  io.emit('delete product', product);
  res.send('Producto eliminado');
});

// Inicia el servidor
server.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
