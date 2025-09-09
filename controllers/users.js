const userRouter = require('express').Router()
const User = require('../models/user')
const bcryot = require('bcrypt')

userRouter.get('/', async(request, response) => {
  const users = await User.find({})
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })

  response.json(users)
})

userRouter.post('/', async(request, response) => {
  const { username, name, password } = request.body

  if (password.length < 3) {
    response.status(400)
      .send({ error: 'User not valid, password need to have 3 or more characters' })
  } else {
    const newUser = new User({
      username,
      name,
      passwordHash: await bcryot.hash(password, 10)
    })

    const savedUser = await newUser.save()

    response.status(201).json(savedUser)
  }

})

module.exports = userRouter