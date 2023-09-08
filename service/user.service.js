const fs = require("fs")

//page=2&pageSize=10&sortBy=name&filter=age:25.

let rawdata = fs.readFileSync('user.json');
let userData = JSON.parse(rawdata);

const getAllUser = (req, rsp) => {
    rsp.status(200).json({ users: userData })
}

const getRetrieval = (req, rsp) => {

    //filter
    let { page, sortByid } = req.query
    let { Registered } = req.body
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

    if (sortByid === "asc") {
        users.sort((a, b) => a.id - b.id);
    }
    if (sortByid === "desc") {
        users.sort((a, b) => b.id - a.id);
    }

    if (users.length == 0) {
        return rsp.status(204).send({ message: "no user information" })
    }

    rsp.status(200).json({ inThisPage: users.length, afterFilter: filterByRegistered.length, users: users })
}

const postRetrieval = (req, rsp) => {
    //filter
    let { Registered, page, sortByid } = req.body
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

    if (sortByid === "asc") {
        users.sort((a, b) => a.id - b.id);
    }
    if (sortByid === "desc") {
        users.sort((a, b) => b.id - a.id);
    }

    if (users.length == 0) {
        return rsp.status(204).send({ message: "no user information" })
    }

    rsp.status(200).json({ inThisPage: users.length, afterFilter: filterByRegistered.length, users: users })
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
    let newUser = {
        id: userData.length + 1,
        name: req.body.name,
        homePhone: req.body.homePhone || null,
        mobilePhone: req.body.mobilePhone,
        email: req.body.email,
        dateOfBirth: req.body.dateOfBirth || null,
        registered: req.body.registered,
        emergencyContacts: req.body.emergencyContacts
    }


    fs.readFile('user.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error:', err);
            return rsp.status(500).json({ error: 'Internal Server Error' });
        }
        let users = JSON.parse(data);
        users.push(newUser);
        fs.writeFile('user.json', JSON.stringify(users), (err) => {
            if (err) {
                console.error('Error:', err);
                return rsp.status(500).json({ error: 'Internal Server Error' });
            }

            rsp.status(201).json({ created: true, userId: newUser.id });
        });
    });
};

const updateUser = (req, rsp) => {
    let userID = req.params.id
    let { name, mobilePhone, email, dateOfBirth, registered, emergencyContacts } = req.body
    let getUserData = userData.find((users) => {
        return users.id == userID
    })
    if (!getUserData) {
        return rsp.status(404).json({ message: "user not found" })
    }
    getUserData.name = name
    getUserData.mobilePhone = mobilePhone
    getUserData.email = email
    getUserData.dateOfBirth = dateOfBirth
    getUserData.registered = registered
    getUserData.emergencyContacts = emergencyContacts
    fs.writeFile('user.json', JSON.stringify(userData), 'utf8', (err) => {
        if (err) {
            console.error(err);
        }
    })
    rsp.json({ message: 'User updated successfully.', user: getUserData });
}

const deleteUser = (req, rsp) => {
    let idToRemove = req.params.id
    let getUserID = userData.find((users) => {
        return users.id == idToRemove
    })
    if (!getUserID) {
        return rsp.status(404).json({ message: "user not found" })
    }
    let getUserIndex = userData.findIndex((users) => {
        return users.id == idToRemove
    })
    let deletedUser = userData.splice(getUserIndex, 1)
    fs.writeFile('user.json', JSON.stringify(userData), 'utf8', (err) => {
        if (err) {
            console.error(err);
        }

        rsp.status(200).json({ Message: "User has been removed" }); // 204 No Content indicates successful deletion
    });

}

const patchUser = (req, rsp) => {
    let idToPatch = req.params.id
    let { registered } = req.body
    let getUserData = userData.find((user) => {
        return user.id == idToPatch
    })
    if (!getUserData) {
        return rsp.status(404).json({ message: "USER NOT FOUND" })
    }
    if (getUserData.registered && registered === true) {
        return rsp.status(400).json({ message: "User already registered" });
    }
    getUserData.registered = true;

    fs.writeFile('user.json', JSON.stringify(userData), 'utf8', (err) => {
        if (err) {
            console.error(err);
        }
    })
    rsp.status(200).json({ message: 'User registered sucessfully', user: getUserData });
}



const getDynamic = (req, rsp) => {
    const { page, limit, sortBy } = req.query;
    const { Contacts, registered, startYear, endYear, minAge, maxAge } = req.body;

    // Start with the original data
    let rowdata = userData;

    // Apply filters
    if (Contacts === "null") {
        rowdata = rowdata.filter((user) => !user.emergencyContacts || user.emergencyContacts.length === 0);
    } else if (Contacts === "1") {
        rowdata = rowdata.filter((user) => user.emergencyContacts && user.emergencyContacts.length >= 1);
    }

    if (registered === "true") {
        rowdata = rowdata.filter((user) => user.registered === true);
    } else if (registered === "false") {
        rowdata = rowdata.filter((user) => user.registered === false);
    }

    if (startYear || endYear) {
        rowdata = rowdata.filter((user) => {
            const BirthYear = new Date(user.dateOfBirth).getFullYear();
            if (startYear && endYear) {
                return BirthYear >= startYear && BirthYear <= endYear;
            } else if (startYear || endYear) {
                const targetYear = startYear || endYear;
                return BirthYear == targetYear;
            }

        });
    }
    if (minAge && maxAge) {
        rowdata = rowdata.filter((user) => {
            const currentDate = new Date();
            const birthDate = new Date(user.dateOfBirth);
            const age = currentDate.getFullYear() - birthDate.getFullYear();
            return age >= minAge && age <= maxAge;
        });
    } else if (minAge || maxAge) {
        const currentDate = new Date();
        const targetAge = minAge || maxAge;
        rowdata = rowdata.filter((user) => {
            const birthDate = new Date(user.dateOfBirth);
            const age = currentDate.getFullYear() - birthDate.getFullYear();
            return age == targetAge;
        });
    }

    // Pagination
    const pageAsNumber = Number.parseInt(page) || 1;
    const limitAsNumber = Number.parseInt(limit) || 5;
    const start = (pageAsNumber - 1) * limitAsNumber;
    const end = start + limitAsNumber;
    const getuser = rowdata.slice(start, end);

    // Sorting
    if (sortBy === "dateOfBirth") {
        getuser.sort((a, b) => {
            const dateA = new Date(a.dateOfBirth);
            const dateB = new Date(b.dateOfBirth);
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            return 0;
        });
    } else if (sortBy) {
        getuser.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return -1;
            if (a[sortBy] > b[sortBy]) return 1;
            return 0;
        });
    }
    if (getuser.length === 0) {
        return rsp.status(204).send({ message: "no user information" })
    }
    rsp.status(200).json({ inthisPage: getuser.length, afterFilter: rowdata.length, users: getuser });
}


const PostDaynamic = (req, rsp) => {
    const { Contacts, registered, startYear, endYear, minAge, maxAge, page, limit, sortBy } = req.body;

    // Start with the original data
    let rowdata = userData;

    // Apply filters
    if (Contacts === "null") {
        rowdata = rowdata.filter((user) => !user.emergencyContacts || user.emergencyContacts.length === 0);
    } else if (Contacts === "1") {
        rowdata = rowdata.filter((user) => user.emergencyContacts && user.emergencyContacts.length >= 1);
    }

    if (registered == "true") {
        rowdata = rowdata.filter((user) => user.registered === true);
    } else if (registered == "false") {
        rowdata = rowdata.filter((user) => user.registered === false);
    }

    if (startYear || endYear) {
        rowdata = rowdata.filter((user) => {
            const BirthYear = new Date(user.dateOfBirth).getFullYear();
            if (startYear && endYear) {
                return BirthYear >= startYear && BirthYear <= endYear;
            } else if (startYear || endYear) {
                const targetYear = startYear || endYear;
                return BirthYear == targetYear;
            }

        });
    }
    if (minAge && maxAge) {
        rowdata = rowdata.filter((user) => {
            const currentDate = new Date();
            const birthDate = new Date(user.dateOfBirth);
            const age = currentDate.getFullYear() - birthDate.getFullYear();
            return age >= minAge && age <= maxAge;
        });
    } else if (minAge || maxAge) {
        const currentDate = new Date();
        const targetAge = minAge || maxAge;
        rowdata = rowdata.filter((user) => {
            const birthDate = new Date(user.dateOfBirth);
            const age = currentDate.getFullYear() - birthDate.getFullYear();
            return age == targetAge;
        });
    }

    // Pagination
    const pageAsNumber = Number.parseInt(page) || 1;
    const limitAsNumber = Number.parseInt(limit) || 5;
    const start = (pageAsNumber - 1) * limitAsNumber;
    const end = start + limitAsNumber;
    const getuser = rowdata.slice(start, end);

    // Sorting
    if (sortBy === "dateOfBirth") {
        getuser.sort((a, b) => {
            const dateA = new Date(a.dateOfBirth);
            const dateB = new Date(b.dateOfBirth);
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            return 0;
        });
    } else if (sortBy) {
        getuser.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return -1;
            if (a[sortBy] > b[sortBy]) return 1;
            return 0;
        });
    }
    if (getuser.length === 0) {
        return rsp.status(204).send({ message: "no user information" })
    }

    rsp.status(200).json({ inthisPage: getuser.length, afterFilter: rowdata.length, users: getuser });
}

module.exports = { getRetrieval, postRetrieval, getUserById, create, updateUser, deleteUser, patchUser, getDynamic, PostDaynamic, getAllUser }
