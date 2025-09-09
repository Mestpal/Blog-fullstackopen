const userRouter = require('express').Router()
const User = require('../models/user')
const bcryot = require('bcrypt')

userRouter.get('/', async(request, response) => {
  const users = await User.find({})
  response.json(users)
})

userRouter.post('/', async(request, response) => {
  const { username, name, password } = request.body

  const newUser = new User({
    username,
    name,
    passwordHash: await bcryot.hash(password, 10)
  })

  const savedUser = await newUser.save()

  response.status(201).json(savedUser)
})

module.exports = userRouter