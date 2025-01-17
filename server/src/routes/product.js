const { Router } = require("express");
const multer = require('multer')
const { registerNewProduct, getAllProducts } = require("../controllers/products");
const app = Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })
app.get("/products", getAllProducts);
app.post("/products", upload.single('image'), registerNewProduct);



module.exports = app;
