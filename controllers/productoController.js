import fs from "fs";
import { generateId } from "../helpers/generateID.js";

export const crearProducto = async (req, res) => {
  const newProduct = req.body;
  let productos = JSON.parse(fs.readFileSync("./data/productos.json", "utf8"));
  if (!Array.isArray(productos)) {
    productos = [];
  }
  newProduct.id = generateId();
  productos.push(newProduct);
  fs.writeFileSync("./data/productos.json", JSON.stringify(productos, null, 2));
  res.status(201).json(newProduct);
};

export const obtenerProductos = async (req, res) => {
  const productos = JSON.parse(
    fs.readFileSync("./data/productos.json", "utf8")
  );
  res.json(productos);
};

export const obtenerProducto = async (req, res) => {
  const pid = req.params.pid;
  const productos = JSON.parse(
    fs.readFileSync("./data/productos.json", "utf8")
  );
  const producto = productos.find((p) => p.id === pid);
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
};

export const actualizarProducto = async (req, res) => {
  const pid = req.params.pid;
  const updatedFields = req.body;
  const productos = JSON.parse(
    fs.readFileSync("./data/productos.json", "utf8")
  );
  const index = productos.findIndex((p) => p.id === pid);
  if (index !== -1) {
    // Actualiza solo los campos proporcionados en la solicitud POST
    for (const key in updatedFields) {
      if (Object.hasOwnProperty.call(updatedFields, key)) {
        productos[index][key] = updatedFields[key];
      }
    }
    fs.writeFileSync(
      "./data/productos.json",
      JSON.stringify(productos, null, 2)
    );
    res.json(productos[index]);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
};

export const eliminarProducto = async (req, res) => {
  const pid = req.params.pid;
  const productos = JSON.parse(
    fs.readFileSync("./data/productos.json", "utf8")
  );
  const index = productos.findIndex((p) => p.id === pid);
  if (index !== -1) {
    productos.splice(index, 1);
    fs.writeFileSync(
      "./data/productos.json",
      JSON.stringify(productos, null, 2)
    );
    res.json({ message: "Producto eliminado" });
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
};
