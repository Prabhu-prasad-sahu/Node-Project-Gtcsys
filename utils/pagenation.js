const pagenation = (req, rsp, next) => {
    const pageAsNumber = Number.parseInt(req.query.page) || 1
    const limitAsNumber = 5
    const sortId = req.query.sortId

    req.pagenation = { pageAsNumber, limitAsNumber, sortId }
    next()
}

module.exports = { pagenation }