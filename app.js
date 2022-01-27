const Controller = require('./controllers/controller')
const express = require('express')
const app = express()
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

app.get('/logout', Controller.logout)
app.get('/register', Controller.registerForm)
app.post('/register', Controller.registerAdd)
app.get('/login', Controller.loginForm)
app.post('/login', Controller.loginAdd)
app.get('/', Controller.home)

app.get('/profile/:profileId', Controller.validateLogin, Controller.profile)
app.get('/profile/:profileId/form', Controller.validateLogin, Controller.profileForm)
app.post('/profile/:profileId/add', Controller.validateLogin, Controller.addProfile)
app.post('/profile/:profileId/edit', Controller.validateLogin, Controller.editProfile)

app.get('/post/add', Controller.validateLogin, Controller.addPost)
app.post('/post/add', Controller.postAddPost)
app.get('/post/:postId', Controller.validateLogin, Controller.postDetail)
app.post('/post/:postId/addComment', Controller.validateLogin, Controller.addComment)
app.get('/comment/:PostId/:id/delete', Controller.deleteComment)

app.get('/coba', Controller.coba)

app.listen(port, () => {
  console.log('listen');
})