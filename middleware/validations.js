const usersDb = require('../schemas/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    validateRegister: async (req, res, next) => {
        const {username, pass1, pass2, age} = req.body;
        if (!username) return res.send({error: true, data: null, message: 'username cannot be empty'});
        if (!pass1) return res.send({error: true, data: null, message: 'password cannot be empty'});
        if (pass1 !== pass2) return res.send({error: true, data: null, message: 'passwords should match'});
        if (!age) return res.send({
            error: true,
            data: null,
            message: 'You have to be 18 or over to be able to register, sorry little friend.'
        });
        const foundUser = await usersDb.findOne({username});
        console.log('foundUser', foundUser);
        if (foundUser) return res.send({error: true, data: null, message: 'Username already exists'});
        next();
    },
    validateLogin: async (req, res, next) => {
        const user = req.body;
        if (!user.username) return res.send({error: true, data: null, message: 'username cannot be empty'});
        if (!user.password) return res.send({error: true, data: null, message: 'password cannot be empty'});
        const foundUser = await usersDb.findOne({username: user.username})
        if (!foundUser) return res.send({error: true, data: null, message: 'User not found'});
        const isMatch = await bcrypt.compare(user.password, foundUser.password)
        if (!isMatch) return res.send({
            error: true,
            data: null,
            message: 'Password is incorrect'
        });
        next();
    },
    authorize: (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) return res.send({error: true, data: null, message: 'Authorization failed'});
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) {
                console.log('i am inside an error', err)
                return res.send({error: true, data: null, message: 'No user found in middleware'});
            }
            req.user = data;
        })
        next();
    }
}