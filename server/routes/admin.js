const express = require('express')
const router = express.Router();
const Admin = require('../db/admin')
const blogPost = require('../db/blogPost')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const jwtsecret = process.env.OWT_SECRET;
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
    router.get('/admin', async(req, res) => {
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
    router.get('/dashboard', authMiddleware, async(req, res) => {
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
    router.get('/addBlog', authMiddleware, async(req, res) => {
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
    router.post('/addBlog', authMiddleware, async(req, res) => {
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
    router.get('/editBlog/:id', authMiddleware, async(req, res) => {
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
    router.put('/editBlog/:id', authMiddleware, async(req, res) => {
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
    router.delete('/deleteBlog/:id', authMiddleware, async(req, res) => {
      try {
        await blogPost.deleteOne({_id: req.params.id})
        res.redirect('/dashboard')
        // res.send('this is edit page')
      } catch (error) {
        console.log(error)
      }
      
    })
    
    // admin route and login page
    router.post('/admin', async(req, res) => {
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
    router.post('/register', async(req, res) => {
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
    router.get("/logout",(req, res) =>{
      res.clearCookie('token')
      res.redirect('/')
    })


module.exports = router      