const constants = require("../constants");
const applyFilters = (userData, filters) => {
    let filteredData = userData;

    if (filters.Contacts === 'null') {
        filteredData = filteredData.filter((user) => !user.emergencyContacts || user.emergencyContacts.length === 0);
    } else if (filters.Contacts === '1') {
        filteredData = filteredData.filter((user) => user.emergencyContacts && user.emergencyContacts.length >= 1);
    }

    if (filters.registered === 'true') {
        filteredData = filteredData.filter((user) => user.registered === true);
    } else if (filters.registered === 'false') {
        filteredData = filteredData.filter((user) => user.registered === false);
    }

    if (filters.startYear || filters.endYear) {
        filteredData = filteredData.filter((user) => {
            const birthYear = new Date(user.dateOfBirth).getFullYear();
            if (filters.startYear && filters.endYear) {
                return birthYear >= filters.startYear && birthYear <= filters.endYear;
            } else if (filters.startYear || filters.endYear) {
                const targetYear = filters.startYear || filters.endYear;
                return birthYear == targetYear;
            }
        });
    }

    if (filters.minAge && filters.maxAge) {
        filteredData = filteredData.filter((user) => {
            const currentDate = new Date();
            const birthDate = new Date(user.dateOfBirth);
            const age = currentDate.getFullYear() - birthDate.getFullYear();
            return age >= filters.minAge && age <= filters.maxAge;
        });
    } else if (filters.minAge || filters.maxAge) {
        const currentDate = new Date();
        const targetAge = filters.minAge || filters.maxAge;
        filteredData = filteredData.filter((user) => {
            const birthDate = new Date(user.dateOfBirth);
            const age = currentDate.getFullYear() - birthDate.getFullYear();
            return age == targetAge;
        });
    }

    return filteredData;
};

const paginateData = (data, page, limit) => {
    const pageAsNumber = Number.parseInt(page) || Number.parseInt(constants.PAGE);
    const limitAsNumber = Number.parseInt(limit) || Number.parseInt(constants.LIMIT);
    const start = (pageAsNumber - 1) * limitAsNumber;
    const end = start + limitAsNumber;
    return data.slice(start, end);
};

const sortData = (data, sortBy) => {
    if (sortBy === 'dateOfBirth') {
        return data.sort((a, b) => new Date(a.dateOfBirth) - new Date(b.dateOfBirth));
    } else if (sortBy) {
        return data.sort((a, b) => a[sortBy] - b[sortBy]);
    } else {
        return data;
    }
};

module.exports = { applyFilters, paginateData, sortData }