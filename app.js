const express = require('express');
const app=express();
const bcrypt = require('bcrypt');
const path = require('path');
const cookieParser = require('cookie-parser');
 
const userModel = require('./models/user');

const jwt =require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded ({extended : true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.use(cookieParser());

 
app.get('/',(req,res)=>{
    res.render("index");
})





app.post('/create',  (req,res) =>  {
    let {username,email,password,age} = req.body;


    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async (err,hash) => {
           
   let createdUser = await userModel.create({
        username,
        email,
        password:hash,
        age
    })
    let token = jwt.sign({email},"shhh");
    res.cookie("token",token);
    res.send(createdUser);
        })
    })
})

app.get('/login',(req,res)=>{
    res.render("login");
})

app.post('/login', async (req,res) => {
    let user = await userModel.findOne({email:req.body.email});
    if (!user) res.send( "Something went wrong");
    bcrypt.compare(req.body.password,user.password,(err,result) => {
        if (result){
            let token = jwt.sign({email:user.email},"shhh");
    res.cookie("token",token); 
            res.send("you can login");
        }
    })
})




app.listen(3000);

