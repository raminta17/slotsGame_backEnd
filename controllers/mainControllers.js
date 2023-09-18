const usersDb = require('../schemas/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function randomNum() {
    return Math.floor(Math.random() * 5);
}

module.exports = {
    register: async (req, res) => {
        const {username, pass1} = req.body;
        const hash = await bcrypt.hash(pass1, 13);
        console.log('hash', hash);
        const user = new usersDb({
            username,
            password: hash
        });
        console.log(user);
        user.save().then(() => {
            console.log('user added');
            res.send({error: false, data: null, message: 'User added successfully'});
        }).catch((e) => {
            console.log('error', e)
        })
    },
    login: async (req, res) => {
        const user = req.body;
        const foundUser = await usersDb.findOne({username: user.username})
        const userToToken = {
            _id: foundUser._id
        }

        const token = jwt.sign(userToToken, process.env.JWT_SECRET);
        res.send({
            error: false,
            data: {username: foundUser.username, money: foundUser.money},
            token: token,
            message: 'Login success'
        });
    },
    gamble: async (req, res) => {
        const {bid} = req.params;
        const user = req.user;
        const findUser = await usersDb.findOne({_id: user._id});
        const chanceCombo = [
            randomNum(), randomNum(), randomNum()
        ];
        if (findUser.money - Number(bid) < 0) return res.send({
            error: false,
            data: {money: findUser.money},
            notEnoughMoney: true,
            message: 'YOU DO NOT HAVE ENOUGH MONEY TO MAKE THIS BID'
        });

        async function updateMoney(win) {
            const updateUser = await usersDb.findOneAndUpdate(
                {_id: user._id},
                {$inc: {money: Number(bid) * win}},
                {new: true}
            )
            return updateUser.money;
        }

        const isComboEqual = chanceCombo.every(combo => combo === chanceCombo[0])
        if (isComboEqual) {
            if (chanceCombo[0] === 0) {
                const money = await updateMoney(100);
                return res.send({error: false, data: {money: money}, chanceCombo, message: 'JACKPOT!!!'});
            }
            if (chanceCombo[0] === 1) {
                const money = await updateMoney(50);
                return res.send({
                    error: false,
                    data: {money: money},
                    chanceCombo,
                    message: 'Triple Cherries, congratulations, you won!!'
                });
            }
            if (chanceCombo[0] === 2) {
                const money = await updateMoney(20);
                return res.send({
                    error: false,
                    data: {money: money},
                    chanceCombo,
                    message: 'Triple Bars, congratulations, you won!!'
                });
            }
            if (chanceCombo[0] === 3) {
                const money = await updateMoney(10);
                return res.send({
                    error: false,
                    data: {money: money},
                    chanceCombo,
                    message: 'Triple Crowns, congratulations, you won!!'
                });
            }
            if (chanceCombo[0] === 4) {
                const money = await updateMoney(5);
                return res.send({
                    error: false,
                    data: {money: money},
                    chanceCombo,
                    message: 'Triple Bells, congratulations, you won!!'
                });
            }
        }
        const updateUser = await usersDb.findOneAndUpdate(
            {_id: user._id},
            {$inc: {money: -Number(bid)}},
            {new: true}
        )
        if (updateUser.money <= 0) return res.send({
            error: false,
            data: {money: updateUser.money},
            chanceCombo,
            message: 'You lost all your money'
        });
        res.send({error: false, data: {money: updateUser.money}, chanceCombo, message: 'Better luck neck time, pal.'});
    },
    getUserInfo: async (req, res) => {
        const user = await usersDb.findOne({_id: req.user._id})
        res.send({error: false, data: {username: user.username, money: user.money}, message: 'User info send'});
    },
    restartGame: async (req, res) => {
        const user = await usersDb.findOneAndUpdate(
            {_id: req.user._id},
            {$set: {money: 200}},
            {new: true})
        res.send({error: false, data: {money: user.money}, message: 'User info send'});
    }
}
