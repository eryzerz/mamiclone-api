const Sequelize = require('sequelize')

const User = require('../models').user
const Dorm = require('../models').dorm


const Op = Sequelize.Op

exports.list = (req, res) => {
    Dorm.findAll({
        include: [
            {
                model: User
            }
        ],
    })
        .then(dorm => res.status(200).send(dorm))
        .catch(err => res.status(400).send(err))
}

exports.getById = (req, res) => {
    Dorm.findOne({where: {id: req.params.id}})
        .then(dorm => {
            if (!dorm) {
                return res.status(404).send({
                    message: `Dorm with id ${req.params.id} is not found!`,
                })
            }
            return res.status(200).send(dorm)
        })
        .catch(err => res.status(400).send(err))
}

exports.listByCity = (req, res) => {
    Dorm.findAll({
        where: {
            city: {
                [Op.substring]: req.params.city
            }
        }
    })
        .then(dorm => res.status(200).send(dorm))
        .catch(err => res.status(400).send(err))
}

exports.create = (req, res) => {
    console.log(req.user.id)
    Object.assign(req.body, {createdBy: req.user.id})
    Dorm.create(req.body)
        .then(dorm => res.status(201).send(dorm))
        .catch(error => res.status(400).send(error))
}

exports.update = (req, res) => {
    Dorm.findOne({where: {id: req.params.id}})
        .then(dorm => {
            if(!dorm) {
                return res.status(404).send({
                    message:`Dorm with id ${req.params.id} is not found!`
                })
            }
            return dorm.update(
                req.body
            )
                .then((dorm) => res.status(200).send(dorm))
                .catch(err => res.status(400).send(err))
        })
        .catch(err => res.status(400).send(err))

}


exports.delete = (req, res) => {
    Dorm.findOne({where: {id: req.params.id}})
        .then(dorm => {
            if(!dorm) {
                return res.status(404).send({
                    message: `Dorm with id ${req.params.id} is not found!`
                })
            }
            return dorm.destroy()
                .then(() => res.status(204).send())
                .catch(error => res.status(400).send(error))
        })
        .catch(error => res.status(400).send(error))
}