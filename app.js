require('dotenv').config();
const express = require('express')
const path = require('path')
const connectDB = require('./server/db/connectDB')
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const mongoStore = require('connect-mongo')
const PortC = require('./server/db/user')
const blogPost = require('./server/db/blogPost')
const Admin = require('./server/db/admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 3000

// connectDB();
const jwtsecret = process.env.OWT_SECRET;

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


app.get('/', (req, res) => {
  const title= {
    title: "Portfolio",
    discription: "simple blog page create by arshad"
  }
    res.render('index', {title})
  })

app.get('/contact', (req, res) => {
  const title= {
  title: "Content page",
        discription: "simple blog page create by arshad"
  }
  res.render('contact',{title})
  })
app.get('/about', (req, res) => {
const title= {
title: "About page",
discription: "simple blog page create by arshad"
}
res.render('about',{title})
})
app.get('/blog', async(req, res) => {
const title= {
title: "Blog page",
discription: "simple blog page create by arshad"
}
let data = await blogPost.find();
// console.log(data[12])
res.render('blog', {title, data})
})

// reading blog using _id
app.get('/readBlog/:id', async(req, res) => {
  try{
    const title= {
      title: "Blog page",
      discription: "simple blog page create by arshad"
    }

    let id = req.params.id
    const data = await blogPost.findById({_id: id});
  res.render('blogread', {title, data})
  }catch(error){
    console.log(error)
  }
})

// Api
app.post("/addcontact", async (req, res) =>{
  const {name,email,message} = req.body;
  await PortC.create({name,email,message})
  res.redirect('/contact')
})  
// admin main
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token

  if(!token) {
    return res.status(401).json({message: "unauthorized"})
  }
  try {
    const decoded = jwt.verify(token, jwtsecret)
    req.userId = decoded.userId
    next();
  } catch(error) {
    return res.status(401).json({message: "unauthorized"})
  }
}

// admin route and
app.get('/admin', async(req, res) => {
  try{
    const title= {
      title: "Admin",
      discription: "simple blog page created by arshad"
    }
  res.render('admin', {title})
  }catch(error){
    console.log(error)
  }
})
// dashboard route
app.get('/dashboard', authMiddleware, async(req, res) => {
  try {
    const title= {
      title: "dashboard",
      discription: "simple blog page created by arshad"
    }
    const data = await blogPost.find()
    res.render('dashboard', {title, data})
  } catch (error) {
    console.log(error)
  }
  
})
// admin - create new blog post
app.get('/addBlog', authMiddleware, async(req, res) => {
  try {
    const title= {
      title: "add blog",
      discription: "simple blog page created by arshad"
    }
    // const data = await Admin.find()
    res.render('addBlog', {title})
  } catch (error) {
    console.log(error)
  }
  
})

// admin - create new blog post and adding database
app.post('/addBlog', authMiddleware, async(req, res) => {
  try {
  //  console.log(req.body)
  try {
    const newBlog = new blogPost({
      blog_title: req.body.blog_title,
      blog_body: req.body.blog_body
    })
    await blogPost.create(newBlog)
    res.redirect('/dashboard')
  } catch (error) {
    console.log(error)
  }
   
  } catch (error) {
    console.log(error)
  }
  
})
// admin - create edit route to update the blog
app.get('/editBlog/:id', authMiddleware, async(req, res) => {
  try {
    const title= {
      title: "Edit Blog",
      discription: "simple blog page created by arshad"
    }
    const data = await blogPost.findOne({_id: req.params.id})
    res.render('editBlog', {title,data})
  } catch (error) {
    console.log(error)
  }
  
})
// admin - create edit route to update the blog
app.put('/editBlog/:id', authMiddleware, async(req, res) => {
  try {
    await blogPost.findByIdAndUpdate(req.params.id, {
      blog_title: req.body.blog_title,
      blog_body: req.body.blog_body,
      updateded: Date.now
      
    })
    res.redirect(`/dashboard`)
    // res.send('this is edit page')
  } catch (error) {
    console.log(error)
  }
  
})
// admin - creating delete route to delete  blog
app.delete('/deleteBlog/:id', authMiddleware, async(req, res) => {
  try {
    await blogPost.deleteOne({_id: req.params.id})
    res.redirect('/dashboard')
    // res.send('this is edit page')
  } catch (error) {
    console.log(error)
  }
  
})

// admin route and login page
app.post('/admin', async(req, res) => {
  try{
    const title= {
      title: "Admin",
      discription: "simple blog page created by arshad"
    }
    const {username,password} = req.body
    const user = await Admin.findOne({username});
    if (!user){
      return res.status(401).json({message: 'Invalid credentials'});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({message: 'Invalid credentials'});
    }
    const token = jwt.sign({userId: user._id}, jwtsecret);
    res.cookie('token', token, {httpOnly: true})
    res.redirect('/dashboard')
  }catch(error){
    console.log(error)
  }
})

// admin route and register
app.post('/register', async(req, res) => {
  try{
    const title= {
      title: "Admin",
      discription: "simple blog page created by arshad"
    }
    const {username,password} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
      try {
        const user = await Admin.create({username, password: hashedPassword})
        res.status(201).json({message: "user created", user})
      } catch (error) {
        if(error.code === 11000) {
          res.status(409).json({message: 'user already in use'})
        }
        res.status(501).json({message: 'internal server error'})
      }
    // console.log(req.body)
    // await Admin.create({username,password})
    // res.redirect("/admin")
  }catch(error){
    console.log(error)
  }
})
// admin logout
app.get("/logout",(req, res) =>{
  res.clearCookie('token')
  res.redirect('/')
})



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