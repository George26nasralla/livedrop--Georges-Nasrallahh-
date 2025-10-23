import express from 'express';
import Customer from '../models/customers.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email query parameter is required',
      });
    }

    const customer = await Customer.findOne({ email: email.toLowerCase() });

    if (!customer) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Customer not found with this email',
      });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer by email:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch customer',
    });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Customer not found',
      });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid customer ID format',
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch customer',
    });
  }
});

export default router;