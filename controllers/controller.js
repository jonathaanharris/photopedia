const { User, Post, Comment } = require('../models')
const bcrypt = require('bcryptjs');
const timeSince = require('../helper/time')
const { Op } = require('sequelize')

class Controller {

  static home(req, res) {
    let { search } = req.query
    let obj = {
      include: [{
        model: User
      }]
    }
    if (search) {
      obj.where = {}
      obj.where.title = { [Op.iLike]: `%${search}%` }
    }
    console.log(obj);

    Post.findAll(obj)
      .then((data) => {
        let currentUser = req.session.userId
        res.render('home', { data, timeSince, currentUser })
      }).catch((err) => {
        res.send(err)
      });
  }

  static addPost(req, res) {
    let currentUser = req.session.userId
    // res.send('test')
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
    let data
    Post.findAll({
      where: { id: postId },
      include: [{
        model: User,
        attributes: ["username", "id"],
        required: false,
      }
        // , {
        //   model: Comment,
        //   required: false,
        // }
      ]
    })
      .then(temp => {
        data = temp[0]
        return Comment.findAll({
          where: { PostId: postId },
          include: [{
            model: User,
            attributes: ["username", "id"],
            required: false,
          }]
        })
      }).then(comment => {
        res.render('postDetail', { currentUser, data, comment, timeSince })
      })
  }

  static registerForm(req, res) {
    res.render('registerForm')
  }
  static addComment(req, res) {
    let { postId } = req.params
    let { content } = req.body
    let UserId = req.session.userId
    Comment.create({
      content,
      PostId: postId,
      UserId
    }).then(data => {
      res.redirect(`/post/${postId}`)
    }).catch(err => {
      res.send(err)
    })
  }

  static deleteComment(req, res) {
    let { id, PostId } = req.params
    Comment.destroy({
      where: { id }
    }).then(data => {
      res.redirect(`/post/${PostId}`)
    }).catch(err => {
      res.send(err)
    })
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

  static logout(req, res) {
    req.session.destroy(err => {
      if (err) res.send(err)
      else res.redirect('/')
    })
  }

  static validateLogin(req, res, next) {
    if (!req.session.userId) {
      const error = 'please login dulu'
      res.redirect(`/login?error=${error}`)
    } else {
      next()
    }
  }

}

module.exports = Controller