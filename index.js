const express = require('express')
const bodyParser = require('body-parser')
require('express-group-routes')

const {authenticated} = require('./middleware')
const authController = require('./controllers/auth')
const userController = require('./controllers/user')
const dormController = require('./controllers/dorm')

const app = express()

app.use(bodyParser.json())
app.group('/api/v1', (router) => {
    
    //Auth API
    router.post('/login', authController.login)
    router.post('/signup', authController.signup)

    //Users API
    router.get('/users', userController.list)
    router.get('/user/:id', userController.getById)
    router.patch('/user/:id', userController.update)
    router.delete('/user/:id', userController.delete)

    //Dorms API
    router.get('/dorms', dormController.list)
    router.get('/dorms/city/:city', dormController.listByCity)
    router.get('/dorm/:id', dormController.getById)
    router.post('/dorms', authenticated, dormController.create)
    router.patch('/dorm/:id', authenticated, dormController.update)
    router.delete('/dorm/:id', authenticated, dormController.delete)

})

app.listen(process.env.PORT, () => {
    console.log(`Listening...`)
})