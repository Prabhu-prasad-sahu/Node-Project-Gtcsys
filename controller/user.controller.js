const express = require("express")
const router = express.Router()
const userService = require("../service/user.service")
const { pagenation } = require("../utils/pagenation")

router.get("/users", pagenation, (req, rsp) => {
    userService.allUser(req, rsp)
})

module.exports = router
