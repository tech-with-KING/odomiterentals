const express = require('express')
const { upload, processAndUploadImage, deleteFromCloudinary, getPublicIdFromUrl } =  require('../milldewares/cloudinary');
const { v4: uuidv4 } = require('uuid');
const { ProductDetail } = require('../models/products');
const productRouter = express.Router()
const {adminAuthMiddleware } = require('../milldewares/auth');
productRouter.post('/',adminAuthMiddleware, upload, processAndUploadImage, async (req, res) => {
  if (!req.processedImage) {
    return res.status(400).send({ error: "Profile Image required" });
  }
  
  let imageUploaded = false;
  try {
    imageUploaded = true;
    const { product_name, category, price, desc, instock, unitsleft, color } = req.body;
    
    const existingProduct = await ProductDetail.findOne({ product_name });
    if (existingProduct) {
      throw new Error("Product already exists");
    }
    console.log(req.body)

    const newProduct = new ProductDetail({
      id: uuidv4(),
      product_name,
      category,
      price,
      desc,
      img: req.processedImage.url,
      instock,
      color,
      unitsleft
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

productRouter.get('/', async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await ProductDetail.find();

    // Return the products as a response
    res.status(200).send(products);
  } catch (e) {
    console.log('Fetch products error:', e);
    res.status(500).send('Internal Server Error');
  }
});
productRouter.put('/:id', adminAuthMiddleware, async (req, res, next) => {
  const { id } = req.params;

  try {
    // If an image is provided in the request, process the image before proceeding
    if (req.file) {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).send({ error: "Image upload failed" });
        }
        await processAndUploadImage(req, res, async () => next());
      });
    } else {
      // If no image is provided, proceed to update the product without image processing
      next();
    }
  } catch (error) {
    return res.status(500).send('Internal Server Error');
  }
}, async (req, res) => {
  const { id } = req.params;

  try {
    const existingProduct = await ProductDetail.findById(id);

    if (!existingProduct) {
      return res.status(404).send({ error: "Product not found" });
    }

    const { product_name, cartegory, price, desc, color } = req.body;

    if (product_name) existingProduct.product_name = product_name;
    if (cartegory) existingProduct.cartegory = cartegory;
    if (price) existingProduct.price = price;
    if (desc) existingProduct.desc = desc;
    if (color) existingProduct.color = color;

    // If a new image was uploaded, delete the old image and update the new one
    if (req.processedImage) {
      try {
        const publicId = getPublicIdFromUrl(existingProduct.img);
        await deleteFromCloudinary(publicId);
        existingProduct.img = req.processedImage.url;
      } catch (deleteError) {
        console.error('Error during image cleanup:', deleteError);
        return res.status(500).send({ error: 'Image update failed' });
      }
    }

    await existingProduct.save();

    const userResponse = existingProduct.toObject();
    res.status(200).send(userResponse);
  } catch (e) {
    console.log('Update product error:', e);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = productRouter;
