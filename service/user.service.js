const fs = require("fs")
const allUser = (req, rsp) => {
    const { pageAsNumber, limitAsNumber, sortId } = req.pagenation;

    // const sortField = req.query.sortField || 'id'

    const start = (pageAsNumber - 1) * limitAsNumber;
    const end = start + limitAsNumber;


    let rawdata = fs.readFileSync('user.json');
    let userData = JSON.parse(rawdata);

    //filter
    let filterByRegistered = userData.filter((user) => {
        return user.registered == true
    })

    // pagenation
    const users = filterByRegistered.slice(start, end);


    //Sorting
    const sortedData = users.sort((a, b) => {
        if (sortId === 'desc') {
            return b["id"] - a["id"];
        } else {
            return a["id"] - b["id"];
        }
    })


    rsp.status(200).json({ countUser: users.length, users: sortedData })
}

module.exports = { allUser }
