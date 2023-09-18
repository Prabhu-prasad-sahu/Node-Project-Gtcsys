
const constants = require("../constants");

let filterUsersByRegistered = (userData, registered) => {
    if (registered === 'true') {
        return userData.filter((user) => user.registered === true);
    } else if (!registered) {
        return userData;
    } else {
        return userData.filter((user) => user.registered === false);
    }
};

const paginateUsers = (users, page) => {
    const pageAsNumber = Number.parseInt(page) || Number.parseInt(constants.PAGE);
    const limitOfPage = Number.parseInt(constants.LIMIT)
    const start = (pageAsNumber - 1) * limitOfPage;
    const end = start + limitOfPage;
    return users.slice(start, end);
};

const sortUsersById = (users, sortByid) => {
    if (sortByid === 'asc') {
        return users.sort((a, b) => a.id - b.id);
    } else if (sortByid === 'desc') {
        return users.sort((a, b) => b.id - a.id);
    } else {
        return users;
    }
};
module.exports = { filterUsersByRegistered, paginateUsers, sortUsersById }