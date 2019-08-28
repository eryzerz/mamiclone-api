const jwt = require('jsonwebtoken')
const Joi = require('@hapi/joi')
const Sequelize = require('sequelize')

const User = require('../models').user
const Op = Sequelize.Op

exports.login = (req, res) => {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[0-9]+.*)(?=.*[A-Z]+.*)(?=.*[!@#\$%\^\&\*\)\(\+\=\.\_\-]+.*)[0-9a-zA-Z!@#\$%\^\&*\)\(\+\=\.\_\-]{8,}$/).required(), 
    }
    
    const { email, password } = req.body
    const result = Joi.validate(req.body, schema)
    console.log(result.error)

    if(result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }
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
        .catch((err) => res.status(400).send(err))
}


exports.signup = (req, res) => {
    const schema = {
        username: Joi.string().min(3).required(),
        email: Joi.string().email(),
        password: Joi.string().regex(/^(?=.*[0-9]+.*)(?=.*[A-Z]+.*)(?=.*[!@#\$%\^\&\*\)\(\+\=\.\_\-]+.*)[0-9a-zA-Z!@#\$%\^\&*\)\(\+\=\.\_\-]{8,}$/).required(),
    }

    const { email, username, password } = req.body
    const result = schema.validate({email, username, password})

    if(result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }

    User.findOne({ where: {[Op.or]:[{email}, {username}]}})
        .then(user => {
            if(user) {
                res.status(400).send({
                    message: 'Email/Username already exist'
                })
            } else {
                User.create(req.body)
                    .then(user => {
                        const token = jwt.sign({ id: user.id}, 'tautochrone', {expiresIn: "3 hours"})
                        let { id, username, email, createdAt } = user
                        res.status(200).send({ id, username, email, createdAt, token})
                    })
                    .catch((err) => res.status(400).send(err))
            }
        })
        .catch((err) => res.status(400).send(err))

    
}