const {User} = require('../models')
const bcrypt = require('bcryptjs');

class Controller {

  static user(req, res) {
    User.findAll()
    .then((result) => {
      res.send(result)
    }).catch((err) => {
      res,send(err)
    });
  }

  static registerForm(req, res) {
    res.render('registerForm')
  }

  static registerAdd(req, res) {
    let {username, password, role} = req.body
    User.create({username, password, role})
      .then((result) => {
        res.redirect('/')
      }).catch((err) => {
        res.send(err)
      });
  }

  static loginForm(req, res) {
    let err = req.query.error
    res.render('loginForm', {err})
  }
  
  static loginAdd(req, res) {
    let {username, password} = req.body
    const error = 'invalid username/password'
    User.findOne({where : {username : username}})
      .then(data => {
        const validPw = bcrypt.compareSync(password, data.password)
        if(username) {
          if(validPw) return res.redirect('/')
          else return res.redirect(`/login?error=${error}`)
        } else {
          return res.redirect(`/login?error=${error}`)
        }
      })
      .catch(err => res.redirect(`/login?error=${error}`))
  }
  


}

module.exports = Controller