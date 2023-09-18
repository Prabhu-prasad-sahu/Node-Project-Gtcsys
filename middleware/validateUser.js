const { check, validationResult } = require("express-validator")
const fs = require("fs");

let rawdata = fs.readFileSync('user.json');
let userData = JSON.parse(rawdata);

const validateUser = [
    check('name', 'Name length should be 10 to 20 characters')
        .isLength({ min: 3, max: 30 }).bail(),
    check('mobilePhone', 'Mobile number should contains 10 digits')
        .isLength({ min: 10, max: 10 }).bail(),
    check('email').notEmpty().withMessage("please enter your Email address").bail()
        .isEmail().withMessage("please enter a valid Eamil").bail(),
    check("registered").notEmpty().withMessage("please enter registered value").bail()
        .isBoolean().withMessage("please enter True or False"),
]

const validateID = [
    check("id").custom(async id => {
        let getUserData = userData.find((users) => {
            return users.id == id
        })
        if (!getUserData) {
            throw new Error("user not found")
        }
    })
]

const validateRegistered = [
    check("registered").notEmpty().withMessage("please enter registered value").bail()
        .isBoolean().withMessage("please enter True or False"),
]

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { validateUser, handleValidationErrors, validateID, validateRegistered }