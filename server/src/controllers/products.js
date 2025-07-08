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
  // We
  try {
    const productId = req.params.productId;
    const updates = req.body;

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
    if (updates.existingImages) {
      try {
        const parsedImages = JSON.parse(updates.existingImages);
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

    // Prepare update object for Mongoose ---
    const updateFields = { ...updates };

    // Set main image field
    updateFields.image = newMainImageFilename;

    // Set additional images field
    updateFields.images = newAdditionalImageFilenames;

    // --- Type Conversions for other fields ---
    if (updateFields.price) {
      updateFields.price = parseFloat(updateFields.price);
    }
    if (updateFields.stock) {
      updateFields.stock = parseInt(updateFields.stock, 10);
    }
    if (updateFields.discountPrice) {
      updateFields.discountPrice = parseFloat(updateFields.discountPrice);
    }
    if (updateFields.discountTill) {
      updateFields.discountTill = new Date(updateFields.discountTill);
    }
    // Handle status change if stock goes to 0
    if (updateFields.stock === 0 && updateFields.status === "active") {
      updateFields.status = "inactive";
    }

    // Perform the Mongoose update
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found or not updated",
        product: updatedProduct,
      });
    }

    res.status(200).json({
      message: "Product updated successfully!!",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Error updating product:", err);
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

module.exports = {
  registerNewProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
