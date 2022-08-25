const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/key');
const errorHandler = require('../utils/errorHandler')

module.exports.login = async (req, res) => {
    try {
        const {email , password} = req.body;
        const candidate = await User.findOne({email : email})
        if(candidate){
            const passwordResult = bcrypt.compareSync(password, candidate.password);
            if(passwordResult) {
                // Генерация токена
                const token = jwt.sign({
                    email : candidate.email,
                    userId : candidate._id
                },config.jwtSecret, {expiresIn : 60 * 60})

                res.status(200).json({
                    token : `Bearer ${token}`
                })
            }else {
                res.status(404).json({message : "Неверный пароль."})
            }
        }else{
            res.status(404).json({message : "Пользователя с таким email не существует."})
        }
    } catch (error) {
        errorHandler(res, error)
        console.log(error)
    }
}

module.exports.register = async (req, res) => {
    try {
        const {email , password} = req.body
        const candidate = await User.findOne({email : email})
        if(candidate) {
            res.status(409).json({
                message : "Такой email уже занят."
            })
        } else{
            const salt = bcrypt.genSaltSync(8)
            const user = new User({
                email : email,
                password : bcrypt.hashSync(password, salt)
            })
            await user.save()
            const token = jwt.sign({
                email : user.email,
                userId : user._id
            },config.jwtSecret, {expiresIn : 60 * 60})

            res.status(200).json({
                token : `Bearer ${token}`
            })
        }
    } catch (error) {
        errorHandler(res, error)
        console.log(error)
    }
}