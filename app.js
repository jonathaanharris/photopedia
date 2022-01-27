const Controller = require('./controllers/controller')
const express = require('express')
const app = express()
const session = require('express-session')
const router = require('./routers/index')
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
app.use('/', router)

app.listen(port, () => {
  console.log('listen');
})