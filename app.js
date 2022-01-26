const Controller = require('./controllers/controller')
const express = require('express')
const app = express()
const session = require('express-session')
const port = 3000


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(session({
  secret: 'photopedia',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    sameSite: true
    }
}))


app.get('/', Controller.user)

app.get('/register', Controller.registerForm)
app.post('/register', Controller.registerAdd)

app.get('/login', Controller.loginForm)
app.post('/login', Controller.loginAdd)

app.use(function(req, res, next) {
  console.log(req.session);
  if(!req.session.userId) {
    const error = 'please login dulu'
    res.redirect(`/login?error=${error}`)
  } else {
    next()
  }
})

app.get('/coba', Controller.coba)

app.listen(port)