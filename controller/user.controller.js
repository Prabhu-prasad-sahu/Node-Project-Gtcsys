const express = require("express")
const router = express.Router()
const userService = require("../service/user.service")
const { check, validationResult } = require("express-validator")

router.get("/users", (req, rsp) => {
    userService.getRetrieval(req, rsp)
})

router.post("/users", (req, rsp) => {
    userService.postRetrieval(req, rsp)
})

router.post("/users/:id", (req, rsp) => {
    userService.getUserById(req, rsp)
})

router.post("/createUser", (req, rsp) => {
    userService.create(req, rsp)
})




// router.post("/createUser",
//     check('email').notEmpty().withMessage("please enter your email address")
//         .bail()
//         .isEmail().withMessage("must be valid email address ")
//     , (req, rsp) => {
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             return rsp.status(400).json({
//                 success: false,
//                 errors: errors.array()
//             });
//         }
//         userService.create(req, rsp)
//     })
module.exports = router
