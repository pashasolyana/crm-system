const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = mongoose.model('users')
const config = require('../config/key')

const options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : config.jwtSecret
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, async (payload, done) =>{
            try {
                const user = await User.findById({ _id : payload.userId}).select('email id')
                if(user){
                    done(null, user)
                } else{
                    done(null, false)
                }  
            } catch (error) {
                console.log(error)
            }
        })
    )
}