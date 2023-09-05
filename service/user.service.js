const fs = require("fs")

let rawdata = fs.readFileSync('user.json');
let userData = JSON.parse(rawdata);

const getRetrieval = (req, rsp) => {

    const { page, sortId } = req.query
    let { Registered } = req.body


    //filter
    let filterByRegistered;

    if (Registered == "true") {
        filterByRegistered = userData.filter((user) => {
            return user.registered === true;
        });
    } else if (!Registered) {
        filterByRegistered = userData
    } else {
        filterByRegistered = userData.filter((user) => {
            return user.registered === false;
        });
    }

    // pagenation
    const pageAsNumber = Number.parseInt(page) || 1
    const limitAsNumber = 5
    const start = (pageAsNumber - 1) * limitAsNumber;
    const end = start + limitAsNumber;
    const users = filterByRegistered.slice(start, end);

    // Sorting
    const sortedData = users.sort((a, b) => {
        if (sortId === 'desc') {
            return b["id"] - a["id"];
        } else {
            return a["id"] - b["id"];
        }
    })

    rsp.status(200).json({ countUser: users.length, users: sortedData })
}

const postRetrieval = (req, rsp) => {
    const { page, limit, filterRegistered, shortById } = req.body

    // filter
    let filterByRegistered;
    if (filterRegistered == true) {
        filterByRegistered = userData.filter((user) => {
            return user.registered === true;
        });
    } else if (filterRegistered == undefined) {

        filterByRegistered = userData
    } else {

        filterByRegistered = userData.filter((user) => {
            return user.registered === false;
        });
    }

    //pagenation 
    const pageAsNumber = Number.parseInt(page) || 1
    const limitAsNumber = Number.parseInt(limit) || 5
    const start = (pageAsNumber - 1) * limitAsNumber;
    const end = start + limitAsNumber;
    const users = filterByRegistered.slice(start, end);

    //sorting
    const sortedData = users.sort((a, b) => {
        if (shortById === 'desc') {
            return b["id"] - a["id"];
        } else {
            return a["id"] - b["id"];
        }
    })
    rsp.status(200).json({ countUser: users.length, users: sortedData })
}

const getUserById = (req, rsp) => {

    const userId = parseInt(req.params.id);
    let getUserData = userData.find((users) => {
        return users.id == userId
    })
    if (!getUserData) {
        return rsp.status(404).json({ error: 'User not found' });
    }
    rsp.status(200).json({ user: getUserData })
}

let create = (req, rsp) => {
    let newUser = req.body;
    fs.readFile('user.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading user data:', err);
            return rsp.status(500).json({ error: 'Internal Server Error' });
        }
        let users = JSON.parse(data);
        users.push(newUser);
        fs.writeFile('user.json', JSON.stringify(users), (err) => {
            if (err) {
                console.error('Error writing user data:', err);
                return rsp.status(500).json({ error: 'Internal Server Error' });
            }

            rsp.status(201).json(newUser);
        });
    });
};

module.exports = { getRetrieval, postRetrieval, getUserById, create }
