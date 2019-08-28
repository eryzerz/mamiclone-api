const Sequelize = require('sequelize')
const Joi = require('@hapi/joi')

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
    const schema = {
        type: Joi.string().required(),
        city: Joi.string().required(),
        village: Joi.string().required(),
        region: Joi.string().required(),
        province: Joi.string().required(),
        name: Joi.string().required(),
        cost: Joi.number().integer().required(),
        room: Joi.number().integer().required(),
        latitude: Joi.string().required(),
        longitude: Joi.string().required(),
        photoURL: Joi.string().uri().required(),
        area: Joi.string().required(),
        facility: Joi.string().required(), 
    }

    Object.assign(req.body, {createdBy: req.user.id})

    const result = Joi.validate(req.body, schema)
    if(result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }

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
                .then(() => res.status(204).send({
                    message: 'User deleted!'
                }))
                .catch(error => res.status(400).send(error))
        })
        .catch(error => res.status(400).send(error))
}