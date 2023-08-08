require('dotenv').config();
const express = require('express')
const path = require('path')
const connectDB = require('./server/db/connectDB')
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const mongoStore = require('connect-mongo')
const app = express()
const port = 3000 || process.env.PORT

// connectDB();

app.use(express.static('templates'))
// app.use(express.static(path.join(__dirname, 'static')))
app.use(express.static(path.join(__dirname, 'public')))

// Middleware assistant for getting data from front end
app.use(express.urlencoded({ extended: true }))

// Middleware assistant for conveting data into json
app.use(express.json({ extended: true }))
app.use(cookieParser())
app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: mongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  })

}))

//  View engine setup
// app.use(expressLayout)
// app.set('layout','./layouts/main')
app.set('view engine', 'ejs')


app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))

// blog post api
// app.post('/blogP', async(req, res) => {
//  const {blog_title} = req.body
//  await blogPost.create({blog_title})
//   res.send("your blog sended")
// })



// search blog
// app.post('/search', async(req, res) => {
 
//   try{
//     const title= {
//       title: "searh blog",
//       discription: "simple blog page create by arshad"
//     }
//     let search = req.body.search;
//     const searchSpecialChar = search.replace(/[^a-zA-Z0-9]/g,"")
//     const data = await blogPost.find({
//       $or:[
//         {blog_title: {$regex: new ReqExp(search, 'i')}}
//       ]
//     })
//     console.log(search)
//     res.send("blogsearch", {title, data})
//   }catch (error){
//     console.log(error)
//   }
  
// })


// rendering blog page

connectDB();
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})