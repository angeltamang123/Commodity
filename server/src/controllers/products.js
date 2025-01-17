const Product = require("../models/products");

const registerNewProduct = async (req, res) => {
  Product.create(req.body)
  res.send('product created!!')
};

const getAllProducts = async (req, res) => {
 const data = await Product.find()
 res.send(data)
};
module.exports = { registerNewProduct, getAllProducts };
