if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Controller = require('./controllers/controller')
const express = require('express')
const app = express()
const multer = require('multer')
const { storage } = require('./cloudinary/index')
const upload = multer({ storage })
const session = require('express-session')
const port = 3000

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: 'photopedia',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true
  }
}))
app.get('/', Controller.home)
app.get('/logout', Controller.logout)
app.get('/register', Controller.registerForm)
app.post('/register', Controller.registerAdd)
app.get('/login', Controller.loginForm)
app.post('/login', Controller.loginAdd)


app.get('/profile/:profileId', Controller.validateLogin, Controller.showProfile)

app.get('/post/add', Controller.validateLogin, Controller.addPost)
app.post('/post/add', upload.single('image'), Controller.postAddPost)
app.get('/post/:postId', Controller.validateLogin, Controller.postDetail)
app.post('/post/:postId/addComment', Controller.validateLogin, Controller.addComment)
app.get('/comment/:PostId/:id/delete', Controller.deleteComment)

app.get('/post/:postId/delete', Controller.deletePost)
app.get('/coba', Controller.coba)

app.listen(port, () => {
  console.log('listen');
})