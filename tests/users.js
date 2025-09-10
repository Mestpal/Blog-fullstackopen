const newUser = {
  "name": "Test",
  "username": "test",
  "password": "test"
}

const user = {
  "name": "Default",
  "username": "Default",
  "password": "1234"
}

const wrongUser = {
  "name": "Test",
  "username": "te",
  "password": "test"
}

const wrongUserNoUsername= {
  "name": "Test",
  "password": "test"
}

const wrongUserPassword = {
  "name": "Test",
  "username": "test",
  "password": "te"
}

module.exports = {
  user,
  newUser,
  wrongUser,
  wrongUserNoUsername,
  wrongUserPassword
}