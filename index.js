const express = require("express")
const app = express()
const userController = require("./controller/user.controller")
const userRouter = require("./routes/user.routes")
const constants = require("./constants")
const ErrorHandler = require("./middleware/errorHandler")
const { commonResponseHandler } = require("./middleware/responceHandler")
let port = constants.PORT



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(commonResponseHandler)
app.use("/API", userRouter)
app.all("*", (req, rsp, next) => {
    let err = new Error("invalid end point")
    next(err)
})
app.use(ErrorHandler)

app.listen(port, () => {
    console.log("connected");
})























// app.use("/API", userController)

















