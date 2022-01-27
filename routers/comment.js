const express = require('express')
const routerComment = express.Router()
const Controller = require('../controllers/controller')

routerComment.get('/:PostId/:id/delete', Controller.deleteComment)

module.exports = routerComment