const express = require("express")
const route = express.Router()
const userService = require("../service/user.service")
const { validateUser, handleValidationErrors, validateID, validateRegistered } = require("../middleware/validateUser")



route.get("/allUser", (req, rsp) => {
    userService.getAllUser(req, rsp)
})
// route.get("/users", (req, rsp, next) => {
//     userService.getRetrieval(req, rsp, next)
// })
// route.post("/users", (req, rsp) => {
//     userService.postRetrieval(req, rsp)
// })

route.get("/users/:id", (req, rsp, next) => {
    userService.getUserById(req, rsp, next)
})

route.post("/createUser", validateUser, handleValidationErrors, (req, rsp, next) => {
    userService.create(req, rsp, next)
})

route.put("/users/:id", validateID, validateUser, handleValidationErrors, (req, rsp, next) => {
    userService.updateUser(req, rsp, next)
})

route.delete("/users/:id", validateID, handleValidationErrors, (req, rsp, next) => {
    userService.deleteUser(req, rsp, next)
})
route.patch("/users/:id", validateID, validateRegistered, handleValidationErrors, (req, rsp, next) => {
    userService.patchUser(req, rsp, next)
})
route.get("/users", (req, rsp, next) => {
    userService.getDynamic(req, rsp, next)
})
route.post("/users", (req, rsp, next) => {
    userService.postDynamic(req, rsp)
})

module.exports = route