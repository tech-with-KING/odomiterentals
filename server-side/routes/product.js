const express = require('express')
const { upload, processAndUploadImage, deleteFromCloudinary, getPublicIdFromUrl } =  require('../milldewares/cloudinary');
const { v4: uuidv4 } = require('uuid');
const { ProductDetail } = require('../models/products');
const productRouter = express.Router()
productRouter.post('/', upload, processAndUploadImage, async (req, res) => {
  if (!req.processedImage) {
    return res.status(400).send({ error: "Profile Image required" });
  }
  
  let imageUploaded = false;
  try {
    imageUploaded = true;
    const { product_name, cartegory, price, desc, instock, uniltsleft, color } = req.body;
    
    const existingProduct = await ProductDetail.findOne({ product_name });
    if (existingProduct) {
      throw new Error("Product already exists");
    }

    const newProduct = new ProductDetail({
      id: uuidv4(),
      product_name,
      cartegory,
      price,
      desc,
      img: req.processedImage.url,
      instock,
      color,
      uniltsleft
    });

    await newProduct.save();
    const userResponse = newProduct.toObject();
    res.status(201).send(userResponse);
  } catch (e) {
    console.log('Add product error:', e);
    if (imageUploaded) {
      try {
        const publicId = getPublicIdFromUrl(req.processedImage.url);
        await deleteFromCloudinary(publicId);
        console.log('Cleanup: Image deleted from Cloudinary');
      } catch (deleteError) {
        console.error('Error during image cleanup:', deleteError);
      }
    }
    if (e.message === "Product already exists") {
      res.status(400).send({ error: e.message });
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});
// Update products
productRouter.put('/', upload, processAndUploadImage, async (req, res) => {
  if (!req.processedImage) {
    return res.status(400).send({ error: "Profile Image required" });
  }
  try {
    const { product_name, cartegory, price, desc, color } = req.body;
    const existingProduct = await ProductDetail.findOne({ product_name });
    if (existingProduct) {
      return res.status(400).send({ error: "product already exists" });
    }
    const newProduct = new ProductDetail({
      id: uuidv4(),
      product_name,
      cartegory,
      desc,
      price,
      color,
      img: req.processedImage.url
    });
    await newProduct.save();

    const userResponse = newProduct.toObject();
    res.status(201).send(userResponse);
  } catch (e) {
    console.log('Add product error:', e);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = productRouter;
