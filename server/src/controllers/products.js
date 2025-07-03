const Product = require("../models/products");

const registerNewProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price, // String from FormData
      category,
      stock, // String from FormData
      status,
      discountPrice, // String from FormData, or undefined if not sent
      discountTill, // ISO string from FormData, or undefined if not sent
    } = req.body;

    // --- Type Conversion ---
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);

    const parsedDiscountPrice = discountPrice
      ? parseFloat(discountPrice)
      : null;
    const parsedDiscountTill = discountTill ? new Date(discountTill) : null;

    const mainImage =
      req.files && req.files["image"] && req.files["image"][0]
        ? req.files["image"][0].filename
        : null;

    const additionalImages =
      req.files && req.files["images[]"]
        ? req.files["images[]"].map((file) => file.filename)
        : [];

    let finalStatus = status;
    if (parsedStock === 0 && status === "active") {
      finalStatus = "inactive";
    }

    const newProduct = await Product.create({
      name,
      description,
      price: parsedPrice,
      category,
      stock: parsedStock,
      status: finalStatus,
      image: mainImage,
      images: additionalImages,
      ...(parsedDiscountPrice !== null && {
        discountPrice: parsedDiscountPrice,
      }),
      ...(parsedDiscountTill !== null && { discountTill: parsedDiscountTill }),
    });

    res
      .status(201)
      .json({ message: "Product created successfully!!", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(400)
      .json({ message: error.message || "Failed to create product" });
  }
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
  try {
    const data = await Product.find(req.query);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getProductById = async (req, res) => {
  const data = await Product.findById(req.params.productId);
  res.send(data);
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.productId);
    res.send("Product Deleted!!");
  } catch (error) {
    res.send(500).send(error.message);
  }
};

module.exports = {
  registerNewProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
