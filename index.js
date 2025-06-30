const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const userModel = require('./models/user');
const adminModel = require('./models/admin');
const productModel = require('./models/product');
const product = require('./models/product');
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.get('/',function(req,res){
        res.render('index');
});
async function fetchUser(email){
    return await userModel.findOne({email});
}
app.post('/create', async function(req,res){
    const {username, email, password, age , latitude, longitude } = req.body;
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
                age,
                //fetching latitude and longitude from the user
                latitude,
                longitude
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
         res.redirect('/showitem');
     
     }})}

    else{
        res.render('wrong')
    }
})
app.get('/showitem', checkAuth ,async function(req,res){
         const items = await productModel.find();
         let user = await req.user;
         console.log(user);
         res.render('showitem',{items,user})}
    
)
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
app.get('/listproduct',checkAuth,function(req,res)
{
    res.render('listproduct');
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
app.get('/view/:_id', checkAuth,async function(req,res){
                const _id = req.params._id;
                const token = req.cookies.token;
                const item = await productModel.findOne({_id:_id});
                const user = req.user;
                //console.log(token);
                if (token == ''){
                    res.render('login');
                }
                else {
                    res.render('productview',{item , user});
                }

            })
            async function checkAuth(req, res, next) {
                const token = req.cookies.token;
                if (!token) {
                    return res.render('login');
                }
                
                try {
                    const data = jwt.verify(token, "aquickbrownfoxjumpsoveralazydog");
                    if (data) {
                        const user = await fetchUser(data.email);  // Ensure we wait for the result
                        req.user = user;
                        next();  // Call next() after setting req.user
                    } else {
                        res.render('login');
                    }
                } catch (err) {
                    res.render('login');
                }
            }
            app.get('/delete',checkAuth,async function(req,res){
                    const user = await req.user;
                    const item = await productModel.find();
                    res.render('delete',{item,user});
            })
            //delete item code here.
app.post('/delete', checkAuth, async function(req,res){
                const _id = req.body._id;
                const token = req.cookies.token;
                const user = req.user ;
                if (token == ''){
                    res.render('login');
                }
                else {
                    try{
                        const data = jwt.verify(token, "aquickbrownfoxjumpsoveralazydog");
                        if(data){
                                let item = await productModel.findOneAndDelete({_id:_id});
                                console.log(item , "deleted")
                                item = await productModel.find();
                                res.render('delete',{item , user});
                        }
                        else{
                            res.render('login');
                        }

                    }
                    catch(err){
                        res.render('login');
                        console.log(err);
                    }
                }

        })

app.get('/cart', checkAuth, async (req,res)=>{
    const user = await req.user;
    res.render('cart', {user});
})


app.listen(3030,(err)=>{
        console.log('server started');
})

