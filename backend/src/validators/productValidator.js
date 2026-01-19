import Joi from 'joi';

// Create product validation schema
export const createProductSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name must not exceed 100 characters',
    }),

  description: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Product description is required',
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description must not exceed 1000 characters',
    }),

  price: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be a positive number',
    }),

  category: Joi.string()
    .required()
    .messages({
      'string.empty': 'Category is required',
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Stock must be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock cannot be negative',
    }),

  images: Joi.array()
    .items(Joi.string().uri())
    .min(1)
    .messages({
      'array.min': 'At least one image is required',
      'string.uri': 'Image must be a valid URL',
    }),
});

// Update product validation schema
export const updateProductSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .messages({
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name must not exceed 100 characters',
    }),

  description: Joi.string()
    .min(10)
    .max(1000)
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description must not exceed 1000 characters',
    }),

  price: Joi.number()
    .positive()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be a positive number',
    }),

  category: Joi.string(),

  stock: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'Stock must be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock cannot be negative',
    }),

  images: Joi.array()
    .items(Joi.string().uri())
    .messages({
      'string.uri': 'Image must be a valid URL',
    }),
});

// Product ID validation
export const productIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'string.empty': 'Product ID is required',
    }),
});