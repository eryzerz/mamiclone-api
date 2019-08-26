const jwt = require('jsonwebtoken')

const User = require('../models').user

exports.login = (req, res) => {
    const { email, password } = req.body

    User.findOne({ where: {email, password}})
        .then(user => {
            if(user) {
                const token = jwt.sign({ id: user.id}, 'tautochrone', {expiresIn: "3 hours"})
                res.send({
                    error: false,
                    message: 'You are logged in!',
                    token
                })
            } else {
                res.send({
                    error: true,
                    message: 'Wrong Email or Password!'
                })
            }
        })
}


exports.signup = (req, res) => {
    const { email, username } = req.body

    if ( email === User.findOne({where: {email}}).then(user => user.email) || username === User.findOne({where: {username}}).then(user => user.username)) {
        res.send({
            message: 'Email/Username already exist'
        })
    } else {
        User.create(req.body)
        .then(user => {
            const token = jwt.sign({ id: user.id}, 'tautochrone', {expiresIn: "3 hours"})
            let { id, username, email, createdAt } = user
            res.send({ id, username, email, createdAt, token})
        })
    }

    
}