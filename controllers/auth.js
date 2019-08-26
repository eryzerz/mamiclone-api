const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')

const User = require('../models').user
const Op = Sequelize.Op

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

    User.findOne({ where: {[Op.or]:[{email}, {username}]}})
        .then(user => {
            if(user) {
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
        })

    
}