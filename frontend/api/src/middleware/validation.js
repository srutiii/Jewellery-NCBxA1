import Joi from 'joi';

// Gemstone details schema
const gemstoneDetailsSchema = Joi.object({
  type: Joi.string().allow(null, ''),
  carat: Joi.number().allow(null),
  color: Joi.string().allow(null, ''),
  clarity: Joi.string().allow(null, ''),
  cut: Joi.string().allow(null, '')
});

// Discount applied schema
const discountAppliedSchema = Joi.object({
  type: Joi.string().allow(null, ''),
  amount: Joi.number().allow(null),
  percentage: Joi.number().allow(null)
});

// Purchase history item schema
const purchaseHistoryItemSchema = Joi.object({
  purchase_id: Joi.string(),
  purchase_date: Joi.string(),
  item_description: Joi.string().allow(null, ''),
  item_category: Joi.string().allow(null, ''),
  item_type: Joi.string().allow(null, ''),
  price: Joi.number().allow(null),
  weight: Joi.string().allow(null, ''),
  metal_type: Joi.string().allow(null, ''),
  metal_purity: Joi.string().allow(null, ''),
  gemstone_details: gemstoneDetailsSchema.allow(null),
  discount_applied: discountAppliedSchema.allow(null),
  payment_method: Joi.string().allow(null, ''),
  sales_person: Joi.string().allow(null, '')
});

// Customer validation schema
const customerSchema = Joi.object({
  // Required fields
  full_name: Joi.string().required().messages({
    'string.empty': 'Full name is required',
    'any.required': 'Full name is required'
  }),
  contact_number: Joi.string().required().messages({
    'string.empty': 'Contact number is required',
    'any.required': 'Contact number is required'
  }),
  phone: Joi.string(), // For backward compatibility
  occasion_for_purchase: Joi.string().required().messages({
    'string.empty': 'Occasion for purchase is required',
    'any.required': 'Occasion for purchase is required'
  }),
  occasion: Joi.string(), // For backward compatibility
  
  // Optional fields
  email_address: Joi.string().email().allow(null, ''),
  email: Joi.string().email().allow(null, ''), // For backward compatibility
  address: Joi.string().allow(null, ''),
  community: Joi.string().allow(null, ''),
  sub_community: Joi.string().allow(null, ''),
  date_of_birth: Joi.string().allow(null, ''),
  dob: Joi.string().allow(null, ''), // For backward compatibility
  anniversary_date: Joi.string().allow(null, ''),
  gender: Joi.string().valid('male', 'female', 'other', 'Male', 'Female', 'Other').allow(null, ''),
  marital_status: Joi.string().valid('single', 'married', 'divorced', 'widowed', 'Single', 'Married', 'Divorced', 'Widowed').allow(null, ''),
  location: Joi.string().allow(null, ''),
  city: Joi.string().allow(null, ''), // For backward compatibility
  
  // Purchase history
  purchase_history: Joi.array().items(purchaseHistoryItemSchema).allow(null),
  
  // Additional customer information
  gift_recipient_relationship: Joi.string().allow(null, ''),
  items_shown_or_discussed: Joi.string().allow(null, ''),
  expressed_interest_or_intent: Joi.string().allow(null, ''),
  in_store_query: Joi.string().allow(null, ''),
  budget_mentioned: Joi.string().allow(null, ''),
  budget: Joi.string().allow(null, ''), // For backward compatibility
  frequency_of_visit: Joi.string().allow(null, ''),
  
  // Legacy fields for backward compatibility
  diamond_shape: Joi.string().allow(null, ''),
  first_visit: Joi.string().allow(null, ''),
  lead_source: Joi.string().allow(null, ''),
  notes: Joi.string().allow(null, '')
});

// Middleware to validate customer data
export const validateCustomer = (req, res, next) => {
  // Handle backward compatibility for required fields
  if (!req.body.contact_number && req.body.phone) {
    req.body.contact_number = req.body.phone;
  }
  
  if (!req.body.occasion_for_purchase && req.body.occasion) {
    req.body.occasion_for_purchase = req.body.occasion;
  }
  
  const { error } = customerSchema.validate(req.body, { abortEarly: false, allowUnknown: true });  

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    return res.status(400).json({
      error: 'Validation Error',
      details: errorMessages
    });
  }
  
  next();
};