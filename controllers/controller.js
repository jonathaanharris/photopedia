const { User, Post, Comment, Profile } = require('../models')

const bcrypt = require('bcryptjs');
const timeSince = require('../helper/time')
const { Op } = require('sequelize')

class Controller {
  static home(req, res) {
    let currentUser = req.session.userId
    res.render('home', { currentUser })
  }

  static showPost(req, res) {
    let { search } = req.query
    let obj = {
      include: [{
        model: User
      }],
      order: [['createdAt', 'DESC']]
    }
    if (search) {
      obj.where = {}
      obj.where.title = { [Op.iLike]: `%${search}%` }
    }
    Post.findAll(obj)
      .then((data) => {
        let currentUser = req.session.userId
        let role = req.session.role
        res.render('showPost', { data, timeSince, currentUser, role })
      }).catch((err) => {
        res.send(err)
      });
  }

  static addPost(req, res) {
    let currentUser = req.session.userId
    let error = req.query.error
    res.render('addPost', { currentUser, error })
  }

  static deletePost(req, res) {
    let { postId } = req.params
    Post.destroy({
      where: {
        id: postId
      }
    }).then(data => {
      res.redirect('/')
    }).catch(err => {
      res.send(err)
    })
  }

  static postAddPost(req, res) {
    let { title, description } = req.body
    let UserId = req.session.userId
    let image = ''

    if (req.file) {
      image = req.file.path
      image = image.replace('/upload', '/upload/w_300')
    }



    Post.create({ UserId, title, description, image })
      .then(data => {
        res.redirect('/')
      })
      .catch(err => {
        if (err.name === 'SequelizeValidationError') {
          err = err.errors.map(el => el.message)
          res.redirect(`/post/add?error=${err}`)
        }
      })
  }

  static postDetail(req, res) {
    let { postId } = req.params
    let currentUser = req.session.userId
    let { error } = req.query
    let role = req.session.role
    let data
    Post.findAll({
      where: { id: postId },
      include: [{
        model: User,
        attributes: ["username", "id"],
        required: false,
      }]
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
        res.render('postDetail', { currentUser, data, comment, timeSince, error, role })
      })
  }

  static likePost(req, res) {
    let { postId } = req.params
    console.log(postId, '===========================');
    Post.increment('like', { where: { id: postId }, by: 1 })
      .then(() => res.redirect(`/post/${postId}`))
      .catch(err => res.send(err))
  }

  static registerForm(req, res) {
    let error = req.query.error
    res.render('registerForm', { error })
  }

  static registerAdd(req, res) {
    let { username, password, role, email } = req.body
    User.create({ username, password, role, email })
      .then((result) => {
        res.redirect('/')
      }).catch((err) => {
        if (err.name === 'SequelizeValidationError') {
          err = err.errors.map(el => el.message)
          res.redirect(`/register/?error=${err}`)
        } else if (err.name === 'SequelizeUniqueConstraintError') {
          err = err.errors.map(el => el.message)
          res.redirect(`/register/?error=${err}`)
        }
        else {
          res.send(err)
        }
      })
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
      if (err.name === 'SequelizeValidationError') {
        err = err.errors.map(el => el.message)
        res.redirect(`/post/${postId}?error=${err}`)
      }
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
            req.session.role = data.role
            return res.redirect('/')
          }
          else return res.redirect(`/login?error=${error}`)
        } else {
          return res.redirect(`/login?error=${error}`)
        }
      })
      .catch(err => res.redirect(`/login?error=${error}`))
  }

  static showProfile(req, res) {
    let currentUser = req.session.userId
    User.findAll({
      where: { id: currentUser },
      include: [{
        model: Profile,
        required: false
      }, {
        model: Post,
        required: false,
      }]
    })
      .then(data => {
        data = data[0]
        res.render('profile', { currentUser, data, timeSince })
      })
  }

  static profileForm(req, res) {
    let currentUser = req.session.userId
    let error = req.query.error
    Profile.findAll({
      where: { UserId: currentUser }
    })
      .then(data => {
        data = data[0]
        console.log(data);
        res.render('editProfileForm', { data, currentUser, error })
      })
      .catch(err => res.send(err))

  }

  static addProfile(req, res) {
    let currentUser = req.session.userId
    let { firstName, lastName, dateOfBirth } = req.body
    Profile.create({ firstName, lastName, dateOfBirth, UserId: currentUser })
      .then(data => {
        res.redirect(`/profile/${currentUser}`)
      })
      .catch(err => {
        if (err.name === 'SequelizeValidationError') {
          err = err.errors.map(el => el.message)
          res.redirect(`/profile/${currentUser}/form?error=${err}`)
        }
      })

  }

  static editProfile(req, res) {
    let currentUser = req.session.userId
    let { firstName, lastName, dateOfBirth } = req.body
    Profile.update({ firstName, lastName, dateOfBirth }, {
      where: { UserId: currentUser }
    })
      .then(data => {
        res.redirect(`/profile/${currentUser}`)
      })
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
      const error = 'Please Login!'
      res.redirect(`/login?error=${error}`)
    } else {
      next()
    }
  }

}

module.exports = Controller