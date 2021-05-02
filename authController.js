const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../model/userModel');

router.use(express.urlencoded({extended:true}));
router.use(express.json());

router.get('/users',(req,res) => {
    User.find({},(err,data) => {
        res.send(data)
    })
})

 //register
  router.post('/register',(req,res)=>{
    var hashpassword = bcrypt.hashSync(req.body.password, 8);

      User.create({
          name:req.body.name,
          email:req.body.email,
          password:hashpassword,
          role:req.body.role?req.body.role:'User'

      },(err,user)=>{
          if(err) return res.send(err)
          res.send('register successs')
      })
  })


 //login
 router.post('/login',(req,res)=>{
     User.findOne({email:req.body.email},(err,user)=>{
         if(err) return res.status(500).send({auth:false,token:'error'})
         if(!user) res.status(500).send({auth:false,token:'user not found'})
         else{
                const passIsValid = bcrypt.compareSync(req.body.password, user.password)
                 if(!passIsValid) res.status(500).send({auth:false,token:'invalid password'})
                 var token = jwt.sign({id:user._id}, config.secert,{expiresIn:86400})
                 res.send({auth:true,token:token})
         }
     }) 
 })


 

// userinfo
router.get('/userInfo',(req,res) => {
    var token = req.headers['x-access-token'];
    if(!token) res.send({auth:false,token:'No Token Provided'})
    jwt.verify(token, config.secert, (err,data) => {
        User.findById(data.id,(err,result) => {
             res.send(result)
         })
    })
 })

module.exports = router