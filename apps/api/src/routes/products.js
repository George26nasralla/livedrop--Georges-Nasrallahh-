import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/products.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      tag = '',
      category = '',
      sort = 'createdAt',
      page = 1,
      limit = 20,
    } = req.query;

    // Build query
    const query = {};

    // Text search (name and description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Build sort object
    const sortOptions = {};
    if (sort === 'price-asc') {
      sortOptions.price = 1;
    } else if (sort === 'price-desc') {
      sortOptions.price = -1;
    } else if (sort === 'name') {
      sortOptions.name = 1;
    } else {
      sortOptions.createdAt = -1; // Default: newest first
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOptions)
        .limit(limitNum)
        .skip(skip),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch products',
    });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found',
      });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid product ID format',
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch product',
    });
  }
});


router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array(),
        });
      }

      const { name, description, price, category, tags, imageUrl, stock } = req.body;

      // Create product
      const product = new Product({
        name,
        description,
        price,
        category,
        tags: tags || [],
        imageUrl: imageUrl || 'https://via.placeholder.com/400',
        stock: stock || 0,
      });

      await product.save();

      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          error: 'Validation Error',
          message: error.message,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create product',
      });
    }
  }
);

export default router;