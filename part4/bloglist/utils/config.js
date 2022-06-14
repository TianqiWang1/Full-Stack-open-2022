require('dotenv').config()

let PORT = 3003 || process.env.PORT
let MONGODB_URI = 'mongodb+srv://tianqiwang:wtq960319@cluster0.52xaaww.mongodb.net/?retryWrites=true&w=majority' || process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}