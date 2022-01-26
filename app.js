const Controller = require('./controllers/controller')

const express = require('express')
const app = express()
const port = 3000
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.get('/', Controller.user)


app.get('/register', Controller.registerForm)
app.post('/register', Controller.registerAdd)

app.get('/login', Controller.loginForm)
app.post('/login', Controller.loginAdd)

app.use(function(req, res, next) {
  next()
})


app.listen(port)