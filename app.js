const express = require('express')
const path = require('path')
const app = express()
const port = 3000
// getting-started.js
const mongoose = require('mongoose');
const { title } = require('process');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://arshadraza:arshad7862@cluster0.lrpglgh.mongodb.net/portfolio');
}

app.use(express.static('templates'))
// app.use(express.static(path.join(__dirname, 'static')))
app.use(express.static(path.join(__dirname, 'public')))

// Middleware assistant for getting data from front end
app.use(express.urlencoded({ extended: true }))

// Middleware assistant for conveting data into json
app.use(express.json({ extended: true }))

//  View engine setup
app.set('view engine', 'ejs')

// Intializing schema/structure for model
const noteSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String

},
  {
      versionKey: false //here
  }
);

// Creating model & collection or a table
const Portcontacts = mongoose.model('Portcontacts', noteSchema);



app.get('/', (req, res) => {
    res.render('index', {title: "personal portfolio"})
  })
app.get('/contact', (req, res) => {
  res.render('contact',{title: 'Contact me'})
})

// Insert an data of contact form
app.post('/contact', (req, res) => {
  let data = req.body
  console.log(data)
  Portcontacts.create(data)
  // res.status(200).json({success:true})
  res.redirect("/contact")
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})