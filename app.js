const express = require('express')
const path = require('path')
const connectDB = require('./db/connectDB')
const PortC = require('./db/user')
const app = express()
const port = 3000
// getting-started.js
// const mongoose = require('mongoose');
// const PortC = require('./db/user')

app.use(express.static('templates'))
// app.use(express.static(path.join(__dirname, 'static')))
app.use(express.static(path.join(__dirname, 'public')))

// Middleware assistant for getting data from front end
app.use(express.urlencoded({ extended: true }))

// Middleware assistant for conveting data into json
app.use(express.json({ extended: true }))

//  View engine setup
app.set('view engine', 'ejs')



app.get('/', (req, res) => {
    res.render('index', {title: "personal portfolio"})
  })
app.get('/contact', (req, res) => {
  res.render('contact',{title: 'Contact me'})
})
app.get('/about', (req, res) => {
  res.render('about',{title: 'About Page'})
})

// Apis
app.post("/addcontact", async (req, res) =>{
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

connectDB();
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})