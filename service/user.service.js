const fs = require("fs")
const customError = require("../middleware/customError")
const { filterUsersByRegistered, paginateUsers, sortUsersById } = require("../utils/static")
const { applyFilters, paginateData, sortData } = require("../utils/dynamic");
const { commonResponseHandler } = require("../middleware/responceHandler");

//page=2&pageSize=10&sortBy=name&filter=age:25.

let rawdata = fs.readFileSync('user.json');
let userData = JSON.parse(rawdata);

const getAllUser = (req, rsp) => {
    rsp.sendResponse(userData)
}
const getRetrieval = (req, rsp, next) => {
    let { page, sortByid } = req.query
    let { Registered } = req.body
    let filterByRegistered = filterUsersByRegistered(userData, Registered);
    let paginatedUsers = paginateUsers(filterByRegistered, page);
    let sortedUsers = sortUsersById(paginatedUsers, sortByid);

    if (sortedUsers.length === 0) {
        return rsp.sendResponse("no content in this page", 204);

    }
    rsp.sendResponse({ inThisPage: sortedUsers.length, afterFilter: filterByRegistered.length, users: sortedUsers })
}

const postRetrieval = (req, rsp) => {
    let { Registered, page, sortByid } = req.body;

    let filterByRegistered = filterUsersByRegistered(userData, Registered);
    let paginatedUsers = paginateUsers(filterByRegistered, page);
    let sortedUsers = sortUsersById(paginatedUsers, sortByid);

    if (sortedUsers.length === 0) {
        return rsp.sendResponse("no content in this page", 204);
    }
    rsp.sendResponse({
        inThisPage: sortedUsers.length,
        afterFilter: filterByRegistered.length,
        users: sortedUsers,
    })
}

const getUserById = (req, rsp, next) => {

    const userId = parseInt(req.params.id);
    let getUserData = userData.find((users) => {
        return users.id == userId
    })
    if (!getUserData) {
        return next(new customError('User not found', 404))
    }
    rsp.sendResponse(getUserData)
}

let create = (req, rsp, next) => {
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
            return next(new customError('Internal Server Error', 500))
        }
        let users = JSON.parse(data);
        users.push(newUser);
        fs.writeFile('user.json', JSON.stringify(users), (err) => {
            if (err) {
                console.error('Error:', err);
                return next(new customError('Internal Server Error', 500))
            }
            rsp.sendResponse({ userId: newUser.id }, 201)
        });
    });
};

const updateUser = (req, rsp, next) => {
    let userID = req.params.id
    let { name, mobilePhone, email, dateOfBirth, registered, emergencyContacts } = req.body
    let getUserData = userData.find((users) => {
        return users.id == userID
    })
    if (!getUserData) {
        return next(new customError("user not found", 404))
    }
    getUserData.name = name
    getUserData.mobilePhone = mobilePhone
    getUserData.email = email
    getUserData.dateOfBirth = dateOfBirth
    getUserData.registered = registered
    getUserData.emergencyContacts = emergencyContacts
    fs.writeFile('user.json', JSON.stringify(userData), 'utf8', (err) => {
        if (err) {

            return next(new customError('Internal Server Error', 500))
        }
    })
    rsp.sendResponse({ message: 'User updated successfully.', user: getUserData })
}
const deleteUser = (req, rsp) => {
    let idToRemove = req.params.id
    let getUserID = userData.find((users) => {
        return users.id == idToRemove
    })
    if (!getUserID) {
        return next(new customError("user not found", 404))
    }
    let getUserIndex = userData.findIndex((users) => {
        return users.id == idToRemove
    })
    let deletedUser = userData.splice(getUserIndex, 1)
    fs.writeFile('user.json', JSON.stringify(userData), 'utf8', (err) => {
        if (err) {
            console.error(err);
            return next(new customError('Internal Server Error', 500))
        }
        rsp.sendResponse({ Message: "User has been removed" })
    });

}

const patchUser = (req, rsp, next) => {
    let idToPatch = req.params.id
    let { registered } = req.body
    let getUserData = userData.find((user) => {
        return user.id == idToPatch
    })
    if (!getUserData) {
        return next(new customError("user not found", 404))
    }
    if (registered === false) {
        return next(new customError("bad request", 400))
    }
    if (getUserData.registered && registered === true) {
        return next(new customError("Unprocessable Content :- user already registered", 422))
    }
    getUserData.registered = true;

    fs.writeFile('user.json', JSON.stringify(userData), 'utf8', (err) => {
        if (err) {
            console.error(err);
            return next(new customError('Internal Server Error', 500))
        }
    })
    rsp.sendResponse({ message: 'User registered sucessfully', user: getUserData })
}



const getDynamic = (req, rsp, next) => {
    const { page, limit, sortBy } = req.query;
    const filters = req.body;

    let filteredData = applyFilters(userData, filters);
    let paginatedData = paginateData(filteredData, page, limit);
    let sortedData = sortData(paginatedData, sortBy);

    if (sortedData.length === 0) {
        return rsp.status(204).send({ message: 'No user information' });
    }
    rsp.sendResponse({
        inThisPage: sortedData.length,
        afterFilter: filteredData.length,
        users: sortedData,
    })
};

const postDynamic = (req, rsp, next) => {
    const { page, limit, sortBy } = req.body;
    const filters = req.body;

    let filteredData = applyFilters(userData, filters);
    let paginatedData = paginateData(filteredData, page, limit);
    let sortedData = sortData(paginatedData, sortBy);

    if (sortedData.length === 0) {
        return rsp.status(204).send({ message: 'No user information' });
    }
    rsp.sendResponse({
        inThisPage: sortedData.length,
        afterFilter: filteredData.length,
        users: sortedData,
    })
};

module.exports = { getRetrieval, postRetrieval, getUserById, create, updateUser, deleteUser, patchUser, getDynamic, postDynamic, getAllUser }
