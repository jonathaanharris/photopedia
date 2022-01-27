if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const routerPost = express.Router()
const Controller = require('../controllers/controller')
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })

routerPost.get('/', Controller.showPost)
routerPost.get('/add', Controller.validateLogin, Controller.addPost)
routerPost.post('/add', upload.single('image'), Controller.postAddPost)
routerPost.get('/:postId', Controller.validateLogin, Controller.postDetail)
routerPost.get('/:postId/like', Controller.validateLogin, Controller.likePost)
routerPost.post('/:postId/addComment', Controller.validateLogin, Controller.addComment)
routerPost.get('/:postId/delete', Controller.deletePost)

module.exports = routerPost