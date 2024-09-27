const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user');
const adminModel = require('./models/admin');
const productModel = require('./models/product');
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.get('/',function(req,res){
        res.render('index');
});
app.post('/create', async function(req,res){
    const {username, email, password, age } = req.body;
    const _checkUser = await userModel.find({email});
    if (_checkUser!=''){
        res.render('wrong');
    }
    else{
    const hashPassword = null;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt,async function(err, hash) {
            const newUser = await userModel.create({
                username,
                email,
                password:hash,
                age
            })
            const token = jwt.sign({email},"aquickbrownfoxjumpsoveralazydog");
            res.cookie("token",token);
            console.log(newUser + '\ndata saved.');
            res.redirect('/');
        });
    });}
    
})
app.get('/logout',function(req,res){
    res.cookie('token','');
    res.redirect('/login')
})
app.get('/login',function(req,res){
    res.render('login');
})
app.post('/login',async function(req,res){
    const {email ,password} = req.body;
    const user = await userModel.findOne({email});
   
    if (user) {
        const pass = user.password;
        bcrypt.compare(password, pass ,async function(err, result) {
        if(err) res.render('wrong');
        else{ 
         const token =  jwt.sign({email},"aquickbrownfoxjumpsoveralazydog");
         res.cookie("token",token)
         const items = await productModel.find();
         res.render('showitem',{items})}
     
     });}

    else{
        res.render('wrong')
    }
})
app.get('/admin',function(req,res){
    res.render('admin')
})
app.post('/admin',async function(req,res){
    const {username, email, password, age , secretcode } = req.body;
    const hashPassword = null;
    const check = await adminModel.findOne({email});
    console.log(check);
    if (check != null || secretcode != 'admin123'){
        res.render('wrong');
    }
    else{
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt,async function(err, hash) {
            const newAdmin = await adminModel.create({
                username,
                email,
                password:hash,
                age
            })
            const token = jwt.sign({email},"aquickbrownfoxjumpsoveralazydog");
            res.cookie("token",token);
            res.redirect('/admin');
        });
    });}
})

app.get('/adminlogin',function(req,res){
    res.render('adminlogin');
});

app.post('/adminlogin',async function(req,res){
    const {email ,password} = req.body;
    const user = await adminModel.findOne({email});
    if (!user) res.render('wrong');
    else{
    bcrypt.compare(password, user.password, function(err, result) {
       if(err) res.render('wrong');
       else{ 
        const token =  jwt.sign({email},"aquickbrownfoxjumpsoveralazydog");
        res.cookie("token",token)
        const items = productModel.find();
        res.render('listproduct',{user,items})}
    });
}
})
app.post('/listitem',async function(req,res){
        const {item , img , price , description} = req.body;
        const product = await productModel.create({
            item,
            img,
            price,
            description
        })
        res.render('listproduct');
})
            app.get('/view/:_id',async function(req,res){
                const _id = req.params._id;
                const token = req.cookies.token;
                const item = await productModel.findOne({_id:_id});
                console.log(token);
                if (token == ''){
                    res.render('login');
                }
                else {
                    res.render('productview',{item});
                }

            })





app.listen(3030,(err)=>{
        console.log('server started');
})