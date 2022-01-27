
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
        let currentUser = req.session.userId

        res.render('home', { data, timeSince, currentUser })
      }).catch((err) => {
        res.send(err)
      });
  }

  static addPost(req, res) {
    let currentUser = req.session.userId
    res.render('addPost', { currentUser })
  }
  static postAddPost(req, res) {
    let { title, description, image } = req.body
    let UserId = req.session.userId

    Post.create({ UserId, title, description, image })
      .then(data => {
        res.redirect('/')
      })
      .catch(err => {
        if (err.name === 'SequelizeValidationError') {
          let arr = []
          err.errors.forEach(element => {
            arr.push(element.message)
          });
          res.send(arr)
        }
        res.send(err)
      })
  }

  static postDetail(req, res) {
    let { postId } = req.params
    let currentUser = req.session.userId
    Post.findAll({
      where: { id: postId },
      include: [{
        model: User,
        attributes: ["username", "id"],
        required: false,
      }, {
        model: Comment,
        required: false,
      }]
    })
      .then(data => {
        data = data[0]
        res.render('postDetail', { currentUser, data, timeSince })
      })
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
        if (username) {

          if (validPw) {
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
        { model: Post, include: [Comment] }
      ]
    })
      .then(data => res.send(data))
      .catch(err => res.send(err))
  }

}

module.exports = Controller