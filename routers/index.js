const express = require('express')
const router = express.Router()
const routerProfile = require('../routers/profile')
const routerPost = require('../routers/post')
const routerComment = require('../routers/comment')

router.use('/profile', routerProfile)
router.use('/post', routerPost)
router.use('/comment', routerComment)

module.exports = router