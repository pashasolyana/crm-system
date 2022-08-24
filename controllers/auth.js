module.exports.login = async (req, res) => {
    res.status(200).json({
        login : true
    })
}

module.exports.register = async (req, res) => {
    res.status(200).json({
        reg : true
    })
}