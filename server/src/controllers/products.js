const Product = require("../models/products");

const registerNewProduct = async (req, res) => {
  req.body.image = req.file.filename;
  Product.create(req.body);
  res.send("product created!!");
};

const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      res.send("Product not updated!!");
    }
    res.send("product Updated!!");
  } catch (err) {
    res.send(err);
  }
};

const getAllProducts = async (req, res) => {
  const data = await Product.find();
  res.send(data);
};

const getProductById = async (req, res) => {
  const data = await Product.findById(req.params.productId);
  res.send(data);
};

module.exports = {
  registerNewProduct,
  getAllProducts,
  getProductById,
  updateProduct,
};
