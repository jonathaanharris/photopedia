
const { User, Post, Comment } = require('../models')
const bcrypt = require('bcryptjs');
const timeSince = require('../helper/time')

class Controller {

  static home(req, res) {
    Post.findAll({
      include: [{
        model: User
      }]
    })
      .then((data) => {
        console.log(data);
        res.render('home', { data, timeSince })
      }).catch((err) => {
        res, send(err)
      });
  }
  static addPost(req, res) {

  }

  static registerForm(req, res) {
    res.render('registerForm')
  }

  static registerAdd(req, res) {

    let { username, password, role, email } = req.body
    User.create({ username, password, role, email })
      .then((result) => {
        res.redirect('/')
      }).catch((err) => {
        res.send(err)
      });
  }

  static loginForm(req, res) {
    let err = req.query.error
    res.render('loginForm', { err })
  }

  static loginAdd(req, res) {
    let { username, password } = req.body
    const error = 'invalid username/password'
    User.findOne({ where: { username: username } })
      .then(data => {
        const validPw = bcrypt.compareSync(password, data.password)
        if(username) {
          
          if(validPw) {
            req.session.userId = data.id
            return res.redirect('/')
          } 

          else return res.redirect(`/login?error=${error}`)
        } else {
          return res.redirect(`/login?error=${error}`)
        }
      })
      .catch(err => res.redirect(`/login?error=${error}`))
  }
 
  static coba(req, res) {
    User.findAll({
      include: [
        {model: Post, include: [Comment] }
      ]
    })
    .then(data => res.send(data))
    .catch(err => res.send(err))
  }


}

module.exports = Controller