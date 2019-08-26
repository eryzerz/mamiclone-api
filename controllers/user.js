const User = require('../models').user
const Dorm = require('../models').dorm

exports.list = (req, res) => {
    User.findAll({
        include: [
            {
                model: Dorm
            }
        ],
    })
        .then(user => res.status(200).send(user))
        .catch(err => res.status(400).send(err))
}

exports.getById = (req, res) => {
    User.findOne({where: {id: req.params.id}})
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: `User with id ${req.params.id} is not found!`,
                })
            }
            return res.status(200).send(user)
        })
        .catch(err => res.status(400).send(err))
}

exports.update = (req, res) => {
    User.findOne({where: {id: req.params.id}})
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message:`User with id ${req.params.id} is not found!`
                })
            }
            return user.update(req.body)
                .then(() => res.status(200).send(user))
                .catch(err => res.status(400).send(err))
        })
        .catch(err => res.status(400).send(err))

}

exports.delete = (req, res) => {
    User.findOne({where: {id: req.params.id}})
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: `User with id ${req.params.id} is not found!`
                })
            }
            return user.destroy()
                .then(() => res.status(204).send({
                    message: `User with id ${req.params.id} has been deleted`
                }))
                .catch(error => res.status(400).send(error))
        })
        .catch(error => res.status(400).send(error))
}