const express = require("express")
const app = express()
const fs = require("fs")
let port = 4040


app.get("/", (req, rsp) => {
    let rawdata = fs.readFileSync('user.json');
    let userData = JSON.parse(rawdata)
    rsp.send(userData)
})

app.listen(port, () => {
    console.log("connected");
})