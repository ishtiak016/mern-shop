const {body}=require("express-validator");
const validedUserRegistraTion=[
    body('name') 
    .trim()
    .notEmpty()
    .withMessage('NAME IS EMPTY')
    .isLength({ min: 3, max: 31 })
    .withMessage('Name length is 3 to 31 characters'),

    body('email') 
    .trim()
    .notEmpty()
    .withMessage('Email IS required')
    .isEmail()
    .withMessage('Invalid Email'),

    body('password') 
    .trim()
    .notEmpty()
    .withMessage('password IS EMPTY')
    .isLength({ min: 6 })
    .withMessage('Password length Must be 6 or high')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must contain one uppercase letter, one lowercase letter, one number, and one special character'),

    body('phone') 
    .trim()
    .notEmpty()
    .withMessage('phone IS EMPTY')
    .isLength({ min: 10 })
    .withMessage('phone length Must be 10'),

    body('image') 
    .optional()
    .isString()
    .withMessage('Image is required'),
];
module.exports={validedUserRegistraTion}