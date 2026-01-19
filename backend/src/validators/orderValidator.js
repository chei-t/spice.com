import Joi from 'joi';

// Create order validation schema
export const createOrderSchema = Joi.object({
  orderItems: Joi.array()
    .items(
      Joi.object({
        product: Joi.string()
          .required()
          .messages({
            'string.empty': 'Product ID is required',
          }),
        quantity: Joi.number()
          .integer()
          .min(1)
          .required()
          .messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.min': 'Quantity must be at least 1',
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one item is required in the order',
    }),

  shippingAddress: Joi.object({
    address: Joi.string()
      .required()
      .messages({
        'string.empty': 'Shipping address is required',
      }),
    city: Joi.string()
      .required()
      .messages({
        'string.empty': 'City is required',
      }),
    postalCode: Joi.string()
      .required()
      .messages({
        'string.empty': 'Postal code is required',
      }),
    country: Joi.string()
      .required()
      .messages({
        'string.empty': 'Country is required',
      }),
  }).required(),

  paymentMethod: Joi.string()
    .valid('card', 'paypal', 'stripe')
    .required()
    .messages({
      'any.only': 'Payment method must be card, paypal, or stripe',
    }),
});

// Update order status validation schema
export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, processing, shipped, delivered, cancelled',
    }),
});

// Order ID validation
export const orderIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'string.empty': 'Order ID is required',
    }),
});