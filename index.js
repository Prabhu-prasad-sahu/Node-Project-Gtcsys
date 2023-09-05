const express = require("express")
const app = express()
const userController = require("./controller/user.controller")
let port = 4040



app.use(express.json())
app.use("/API", userController)


app.listen(port, () => {
    console.log("connected");
})