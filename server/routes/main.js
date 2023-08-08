const express = require('express')
const router = express.Router();
const PortC = require('../db/user')
const blogPost = require('../db/blogPost')


// router
router.get('/', (req, res) => {
      const title= {
        title: "Portfolio",
        discription: "simple blog page create by arshad"
      }
        res.render('index', {title})
      })

router.get('/contact', (req, res) => {
      const title= {
      title: "Content page",
            discription: "simple blog page create by arshad"
      }
      res.render('contact',{title})
      })
router.get('/about', (req, res) => {
  const title= {
    title: "About page",
    discription: "simple blog page create by arshad"
  }
  res.render('about',{title})
})
router.get('/blog', async(req, res) => {
  const title= {
    title: "Blog page",
    discription: "simple blog page create by arshad"
  }
  let data = await blogPost.find();
    res.render('blog', {title, data})
})

// reading blog using _id
router.get('/readBlog/:id', async(req, res) => {
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
router.post("/addcontact", async (req, res) =>{
      const {name,email,message} = req.body;
      await PortC.create({name,email,message})
      res.redirect('/contact')
    //   try{
    //     const {name,email,message} = req.body;
    //     // console.log(req)
    //     const user = new PortC({name,email,message})
    //     await user.save();
    //     // res.status(201).json({message:"Registration Successfull"})
    //     res.send("sended")
    // }
    // catch(error){
    //     res.status(500).json({error:"Registration Failed"})
    // }
    })    
module.exports = router      