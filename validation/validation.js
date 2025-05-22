import Joi from "joi";

const registerSchema = Joi.object({
  UserName: Joi.string()
    .pattern(/^[A-Z][a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.pattern.base": "The name must start with a capital letter, contain only letters, and be at least 3 characters long.",
      "string.empty": "Name is required.",
      "any.required": "Name is required.",
    }),

  password: Joi.string()
    .min(6)
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};:\'",.<>/?]).+$'))
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long.",
      "string.empty": "Password is required.",
      "any.required": "Password is required.",
      "string.pattern.base": "Password must contain at least one uppercase letter, one number, and one special character."
    }),

  universityId: Joi.string().optional().allow(null, ''),
  role: Joi.string().valid("student", "admin").default("user"),
});

export default registerSchema;
