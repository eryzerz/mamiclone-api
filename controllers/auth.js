const jwt = require('jsonwebtoken')
const Joi = require('@hapi/joi')
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')

const User = require('../models').user
const Op = Sequelize.Op

exports.login = (req, res) => {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[0-9]+.*)[0-9a-zA-Z!@#\$%\^\&*\)\(\+\=\.\_\-]{8,}$/).required(), 
    }
    
    const { email, password } = req.body
    const result = Joi.validate(req.body, schema)

    if(result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }
    User.findOne({ where: {email, password}})
        .then(user => {
            if(user) {
                const token = jwt.sign({ id: user.id}, 'tautochrone', {expiresIn: 3600})
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
        password: Joi.string().regex(/^(?=.*[0-9]+.*)[0-9a-zA-Z!@#\$%\^\&*\)\(\+\=\.\_\-]{8,}$/).required(),
        phone: Joi.string().regex(/^[0-9]{10,}$/)
    }

    const result = Joi.validate(req.body, schema)
    

    if(result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }

    const salt = bcrypt.genSalt(10)
    const hashPw = bcrypt.hash(req.body.password, salt)

    Object.assign(req.body, {password: hashPw})

    const { email, username } = req.body

    User.findOne({ where: {[Op.or]:[{email}, {username}]}})
        .then(user => {
            if(user) {
                res.status(400).send({
                    message: 'Email/Username already exist'
                })
            } else {
                
                User.create(req.body)
                    .then(user => {
                        const token = jwt.sign({ id: user.id}, 'tautochrone', {expiresIn: 3600})
                        res.status(200).send({ user, token})
                    })
                    .catch((err) => res.status(400).send(err))
            }
        })
        .catch((err) => res.status(400).send(err))

    
}