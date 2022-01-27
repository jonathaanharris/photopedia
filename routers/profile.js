const express = require('express')
const routerProfile = express.Router()
const Controller = require('../controllers/controller')

routerProfile.get('/:profileId', Controller.validateLogin, Controller.showProfile)
routerProfile.get('/:profileId/form', Controller.validateLogin, Controller.profileForm)
routerProfile.post('/:profileId/add', Controller.validateLogin, Controller.addProfile)
routerProfile.post('/:profileId/edit', Controller.validateLogin, Controller.editProfile)


module.exports = routerProfile