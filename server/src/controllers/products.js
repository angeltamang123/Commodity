const Product = require("../models/products");
const fs = require("fs");
const path = require("path");

// Helper function to delete a single file
const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "../..", "uploads", filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(`Error deleting file ${filename}:`, err);
    } else {
      console.log(`Successfully deleted file: ${filename}`);
    }
  });
};

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
    const productId = req.params.productId;
    const updates = { ...req.body }; // new object from req.body

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const oldMainImage = existingProduct.image;
    const oldAdditionalImages = existingProduct.images || [];

    // Handle main image update
    let newMainImageFilename = oldMainImage; // Keep old image by default
    if (req.files && req.files["image"] && req.files["image"][0]) {
      // A new main image was uploaded
      newMainImageFilename = req.files["image"][0].filename;
      // Delete the old main image
      if (oldMainImage) {
        deleteFile(oldMainImage);
      }
    }

    // Handle additional images update
    let newAdditionalImageFilenames = [];
    const uploadedAdditionalImages =
      req.files && req.files["images[]"]
        ? req.files["images[]"].map((file) => file.filename)
        : [];

    // Get existing additional images that the frontend explicitly sent to KEEP
    let keptExistingAdditionalImagesFromFrontend = [];
    if (updates?.existingImages) {
      try {
        const parsedImages = JSON.parse(updates?.existingImages);
        if (Array.isArray(parsedImages)) {
          keptExistingAdditionalImagesFromFrontend = parsedImages.filter(
            (img) => typeof img === "string" && img.length > 0
          );
        }
      } catch (e) {
        console.log("Error parsing existingImages from frontend:", e);
      }
    }

    // Combine newly uploaded and kept old images
    newAdditionalImageFilenames = [
      ...keptExistingAdditionalImagesFromFrontend,
      ...uploadedAdditionalImages,
    ];

    // Identify images to delete: old ones not found in the new list
    const imagesToDelete = oldAdditionalImages.filter(
      (img) => !newAdditionalImageFilenames.includes(img)
    );

    imagesToDelete.forEach(deleteFile);

    if (updates.name) existingProduct.name = updates.name;
    if (updates.description) existingProduct.description = updates.description;
    if (updates.category) existingProduct.category = updates.category;
    if (updates.status) existingProduct.status = updates.status;

    // Set main image field
    existingProduct.image = newMainImageFilename;

    // Set additional images field
    existingProduct.images = newAdditionalImageFilenames;

    // --- Type Conversions for other fields ---
    if (updates.hasOwnProperty("price")) {
      existingProduct.price = parseFloat(updates.price);
    }
    if (updates.hasOwnProperty("stock")) {
      const stock = parseInt(updates.stock, 10);
      existingProduct.stock = stock;
      if (stock === 0 && existingProduct.status === "active") {
        existingProduct.status = "inactive";
      }
    }
    if (updates.hasOwnProperty("discountPrice")) {
      existingProduct.discountPrice =
        updates.discountPrice === "" || updates.discountPrice == null
          ? null
          : parseFloat(updates.discountPrice);
    }
    if (updates.hasOwnProperty("discountTill")) {
      existingProduct.discountTill =
        updates.discountTill === "" || updates.discountTill == null
          ? null
          : new Date(updates.discountTill);
    }

    // Perform the Mongoose update
    const updatedProduct = await existingProduct.save();

    res.status(200).json({
      message: "Product updated successfully!!",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Error updating product:", err.message);
    // If files were uploaded during this update but an error occurred,
    // delete the newly uploaded files to prevent orphans.
    if (req.files && req.files["image"]) {
      deleteFile(req.files["image"][0].filename);
    }
    if (req.files && req.files["images[]"]) {
      req.files["images[]"].forEach((file) => deleteFile(file.filename));
    }
    res
      .status(500)
      .json({ message: err.message || "Failed to update product" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const skip = (page - 1) * limit;

    // Master Filter Object
    let filters = {};

    // Text Search
    if (req.query.q) {
      filters.$text = { $search: req.query.q };
    }

    // Category Filter
    if (req.query.category) {
      filters.category = req.query.category;
    }

    // Price Range Filter
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) {
        filters.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filters.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    // "Has Discount" Filter
    if (req.query.hasDiscount === "true") {
      filters.discountPrice = { $exists: true, $ne: null, $gt: 0 };
    }

    // Minimum Rating Filter
    if (req.query.minRating) {
      filters["rating.average"] = { $gte: parseFloat(req.query.minRating) };
    }

    const totalProducts = await Product.countDocuments(filters);

    const findOptions = {};

    // Only include text score when actually searching
    if (req.query.q) {
      findOptions.projection = { score: { $meta: "textScore" } };
      findOptions.sort = { score: { $meta: "textScore" } };
    } else {
      findOptions.sort = { createdAt: 1 }; // Default sort
    }

    const products = await Product.find(filters, findOptions.projection)
      .sort(findOptions.sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      products: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts: totalProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch products" });
  }
};

const getProductById = async (req, res) => {
  const data = await Product.findById(req.params.productId);
  res.send(data);
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find the product to get image filenames
    const productToDelete = await Product.findById(productId);
    if (!productToDelete) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    // Delete associated image files from the server
    if (productToDelete.image) {
      deleteFile(productToDelete.image);
    }
    if (productToDelete.images && productToDelete.images.length > 0) {
      productToDelete.images.forEach(deleteFile);
    }

    res.status(200).json({ message: "Product deleted successfully!!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to delete product" });
  }
};

const toggleStatus = async (req, res) => {
  const data = await Product.findById(req.params.productId);
  data.status = req.body.status;
  await data.save();
  res.status(200).json({ message: "Status Toggled" });
};

const getLatest = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const skip = (page - 1) * limit;

    // Calculate date 1 month ago from now
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const filter = {
      createdAt: { $gte: oneMonthAgo },
      status: "active",
    };

    const totalProducts = await Product.countDocuments(filter);

    const latestProducts = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      products: latestProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts: totalProducts,
      },
    });
  } catch (error) {
    console.error("Error in getLatest:", error);
    res.status(500).json({
      message: "Server error while fetching latest products",
    });
  }
};

const getDiscountedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const skip = (page - 1) * limit;

    const filter = {
      discountPrice: { $exists: true, $gt: 0 },
      status: "active",
    };

    const totalProducts = await Product.countDocuments(filter);

    const discountedProducts = await Product.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      products: discountedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts: totalProducts,
      },
    });
  } catch (error) {
    console.error("Error in getDiscountedProducts:", error);
    res.status(500).json({
      message: "Server error while fetching discounted products",
    });
  }
};

module.exports = {
  registerNewProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleStatus,
  getLatest,
  getDiscountedProducts,
};
