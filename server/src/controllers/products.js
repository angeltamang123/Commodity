const Product = require("../models/products");

const registerNewProduct = async (req, res) => {
  req.body.image =req.file.filename
  Product.create(req.body)
  res.send('product created!!')
};

const getAllProducts = async (req, res) => {
 const data = await Product.find()
 res.send(data)
};

const getProductById = async (req, res) => {
  const data = await Product.findById(req.params.productId)
  res.send(data)
 };
 

module.exports = { registerNewProduct, getAllProducts,getProductById };
