const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const handlebars = require('express-handlebars')
const passport = require('./config/passport.js')
const db = require('./models')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use('/upload', express.static(__dirname + '/upload'))
app.use(methodOverride('_method'))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.engine('handlebars', handlebars({
  defaultlayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})
app.listen(port, () => {
  console.log(`this app is running on port: ${port}`)
})

require('./routes')(app)