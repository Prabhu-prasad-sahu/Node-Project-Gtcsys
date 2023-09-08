const express = require("express")
const router = express.Router()
const userService = require("../service/user.service")
const { check, validationResult, body } = require("express-validator")
const fs = require("fs")

let rawdata = fs.readFileSync('user.json');
let userData = JSON.parse(rawdata);

router.get("/allUser", (req, rsp) => {
    userService.getAllUser(req, rsp)
})
// router.get("/users", (req, rsp) => {
//     userService.getRetrieval(req, rsp)
// })

// router.post("/users", (req, rsp) => {
//     userService.postRetrieval(req, rsp)
// })

router.get("/users/:id", (req, rsp) => {
    userService.getUserById(req, rsp)
})

router.post("/createUser", [
    check('name', 'Name length should be 10 to 20 characters')
        .isLength({ min: 3, max: 10 }).bail(),
    check('mobilePhone', 'Mobile number should contains 10 digits')
        .isLength({ min: 10, max: 10 }).bail(),
    check('email').notEmpty().withMessage("please enter your Email address").bail()
        .isEmail().withMessage("please enter a valid Eamil").bail(),
    check("registered").notEmpty().withMessage("please enter registered value").bail()
        .isBoolean().withMessage("please enter True or False"),
], (req, rsp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return rsp.status(400).json({
            success: false,
            errors: errors.array()
        });
    } else {
        userService.create(req, rsp)
    }
})

router.put("/users/:id", [
    check("id").custom(async id => {
        let getUserData = userData.find((users) => {
            return users.id == id
        })
        if (!getUserData) {
            throw new Error("user not found")
        }
    }),
    check('name').notEmpty().withMessage("enter your Name").bail(),
    check('mobilePhone').notEmpty().withMessage("enter your mobileNo").bail()
        .isLength({ min: 10, max: 10 }).withMessage('Mobile number should contains 10 digits').bail(),
    check('email').notEmpty().withMessage("please enter your Email address").bail()
        .isEmail().withMessage("please enter a valid Eamil").bail(),
    check("registered").notEmpty().withMessage("please enter registered value").bail()
        .isBoolean().withMessage("please enter True or False"),
], (req, rsp) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return rsp.status(400).json({
            success: false,
            errors: errors.array()
        });
    } else {
        userService.updateUser(req, rsp)
    }
})
router.delete("/users/:id", (req, rsp) => {
    userService.deleteUser(req, rsp)
})
router.patch("/users/:id", check("registered").notEmpty().withMessage("please enter registered value").bail()
    .isBoolean().withMessage("please enter True or False"),
    (req, rsp) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return rsp.status(400).json({
                success: false,
                errors: errors.array()
            });
        } else {
            userService.patchUser(req, rsp)
        }
    })
router.get("/users", (req, rsp) => {
    userService.getDynamic(req, rsp)
})
router.post("/users", (req, rsp) => {
    userService.PostDaynamic(req, rsp)
})
module.exports = router
