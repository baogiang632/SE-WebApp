const bodyParser = require('body-parser');
const e = require('connect-flash');
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const {engine} = require("express-handlebars");
const bcrypt = require('bcrypt');
const saltRounds = 10; 

var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");

var setUpPassport = require("./setuppassport");
const { resolve, extname } = require('path');
const { allowedNodeEnvironmentFlags } = require('process');
const { getAllOrder, getAllProduct } = require('./dbfunction/authen');
const { match } = require('assert');
const { type } = require('os');

const checkExist = require('./dbfunction/authen').checkExist;
const checkLogin = require('./dbfunction/authen').checkLogin;
const addUser = require('./dbfunction/authen').addUser;
const delUser = require('./dbfunction/authen').delUser;
const findOne = require('./dbfunction/authen').findOne;
const addProduct = require('./dbfunction/authen').addProduct;
const getLength = require('./dbfunction/authen').getLength;
const getCategory = require('./dbfunction/authen').getCategory;
const getAllUser = require('./dbfunction/authen').getAllUser;
const checkProductExist = require('./dbfunction/authen').checkProductExist;
const delProduct = require('./dbfunction/authen').delProduct;
const updateProduct = require('./dbfunction/authen').updateProduct;



setUpPassport();
app = express();
app.use(express.static('public'));
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
console.log(path.join(__dirname));
app.engine('hbs', engine());




app.get('/', (req, res)=>{
  res.render('index2')
});

app.get('/home', (req, res)=>{
  res.render('index2')
});

app.get('/login', (req, res)=>{
  res.render('login')
});

app.get('/signup', (req, res)=>{
  res.render('signup')
});
app.get('/user', (req, res)=>{
  res.render('user')
});

app.get('/userManage', (req, res)=>{
  let a = getAllUser();
  a.then(allUser=>{
    res.render('userManage', {allUser});
  })
});

app.post('/userManage', function(req, res){
  const _user = req.body.username;
  console.log(_user);
  let a = delUser(_user);
  let b = getAllUser();
  a.then(result=>{
    if(result === true)
      console.log('Delete account success');
  });
  
  b.then(allUser=>{
    res.render('userManage', {allUser});
  })
});

app.get('/addProduct', (req, res)=>{
  let a = getAllProduct();
  a.then(allPro=>{
    res.render('addProduct', {allPro});
  })
});

app.post('/addProduct', function(req, res){
  const _id = req.body.id;
  const _bookname = req.body.bookname;
  const _category = req.body.category;
  const _price = req.body.price;
  const _link = req.body.link;
  const _date = req.body.date;

  let a = addProduct(_id, _bookname, _category, _price, _link, _date);
  let b = getAllProduct();
  a.then(result=>{
    if(result === false){
      b.then(allPro=>{
        res.render('addProduct', {allPro, addEr: 'ID has already exist'});
      })
      
    }
    else{
      console.log('Add book success');
      b.then(allPro=>{
        res.render('addProduct', {allPro});
      })
    }
  });
});

app.get('/updateProduct', (req, res)=>{
  let a = getAllProduct();
  a.then(allPro=>{
    res.render('updateProduct', {allPro});
  })
});

app.post('/updateProduct', function(req, res){
  const _id = req.body.id;
  const _bookname = req.body.bookname;
  const _category = req.body.category;
  const _price = req.body.price;
  const _link = req.body.link;
  const _date = req.body.date;

  let a = updateProduct(_id, _bookname, _category, _price, _link, _date);
  let b = getAllProduct();
  a.then(result=>{
    if(result === false){
      b.then(allPro=>{
        res.render('updateProduct', {allPro, addEr: "ID hasn't already exist"});
      });
      
    }
    else{
      console.log('Update book success');
      b.then(allPro=>{
        res.render('updateProduct', {allPro});
      });
    }
  });
});

app.get('/delProduct', (req, res)=>{
  let a = getAllProduct();
  a.then(allPro=>{
    res.render('delProduct', {allPro});
  })
});

app.post('/delProduct', function(req, res){
  const _id = req.body.id;

  let a = delProduct(_id);
  let b = getAllProduct();
  a.then(result=>{
    if(result === false){
      b.then(allPro=>{
        res.render('delProduct', {allPro, addEr: "ID hasn't already exist"});
      })
    }
    else{
      console.log('Delete book success');
      b.then(allPro=>{
        res.render('delProduct', {allPro});
      })
    }
  });
});

app.get('/admin?user=admin&pass=nhuqy&type=1', (req, res)=>{
  let a = getAllUser();
  a.then(allUser=>{
    console.log(allUser);
    res.render('userManage', {allUser});
  })
});

app.get('/admin', (req, res)=>{
  let q = req.query.user;
  let p = req.query.pass;
  let w = req.query.type;
  if(q === 'admin' && p === 'nhuqy'){
    if(typeof(w) === 'undefined'){
      res.render('Admin');
    }
    else{
      if(w === '1'){
        let a = getAllUser();
        a.then(allUser=>{
          console.log(allUser);
          res.render('userManage', {allUser});
        });
      }
      if(w === '2'){
        let a = getAllProduct();
        a.then(allUser=>{
          console.log(allUser);
          res.render('Admin', {allUser});
        });
      }
      if(w === '3'){
        let a = getAllUser();
        a.then(allUser=>{
          console.log(allUser);
          res.render('Admin', {allUser});
        });
      }
    }
    
  }

  else res.redirect('/home');
});

app.get('/product', (req, res)=>{
  let _IT = getCategory('IT');
  let _Education = getCategory('Education');
  let _Detective = getCategory('Detective');
  let _Psychology = getCategory('Psychology');
  let countIT = 0;
  let countEducation = 0;
  let countPsychology = 0;
  let countDetective = 0;
  _IT.then(count=>{
    countIT = count.length;
  });
  _Education.then(count=>{
    countEducation = count.length;
  });
  _Detective.then(count=>{
    countDetective = count.length;
  });
  _Psychology.then(count=>{
    countPsychology = count.length;
  });

  let a = getAllProduct();
  a.then(_product => { 
    console.log(_product.length);
    let count = _product.length;
    let q = '';
    q = req.query.q;
    console.log(q);
    let matchProduct = _product.filter(function(product){
      return product.TenSP.indexOf(q) !== -1;
    });
    if(typeof(q) === 'undefined')
      res.render('product', { _product,  count, countIT, countEducation, countPsychology, countDetective});
    else
        res.render('product', { matchProduct,  count:matchProduct.length, countIT, countEducation, countPsychology, countDetective});
  });
  
});

app.get('/IT', (req, res)=>{
  let _IT = getCategory('IT');
  let _Education = getCategory('Education');
  let _Detective = getCategory('Detective');
  let _Psychology = getCategory('Psychology');
  let countIT = 0;
  let countEducation = 0;
  let countPsychology = 0;
  let countDetective = 0;
  _IT.then(count=>{
    countIT = count.length;
  });
  _Education.then(count=>{
    countEducation = count.length;
  });
  _Detective.then(count=>{
    countDetective = count.length;
  });
  _Psychology.then(count=>{
    countPsychology = count.length;
  });

  let a = getCategory('IT');
  a.then(_product => { 
    console.log(_product);
    let count = _product.length;
    let q = '';
    q = req.query.q;
    console.log(q);
    let matchProduct = _product.filter(function(product){
      return product.TenSP.indexOf(q) !== -1;
    });
    if(typeof(q) === 'undefined')
      res.render('product', { _product,  count, countIT, countEducation, countPsychology, countDetective});
    else
        res.render('product', { matchProduct,  count, countIT, countEducation, countPsychology, countDetective});
  });
})

app.get('/Education', (req, res)=>{
  let _IT = getCategory('IT');
  let _Education = getCategory('Education');
  let _Detective = getCategory('Detective');
  let _Psychology = getCategory('Psychology');
  let countIT = 0;
  let countEducation = 0;
  let countPsychology = 0;
  let countDetective = 0;
  _IT.then(count=>{
    countIT = count.length;
  });
  _Education.then(count=>{
    countEducation = count.length;
  });
  _Detective.then(count=>{
    countDetective = count.length;
  });
  _Psychology.then(count=>{
    countPsychology = count.length;
  });
  let a = getCategory('Education');
  a.then(_product => { 
    console.log(_product);
    let count = _product.length;
    let q = '';
    q = req.query.q;
    console.log(q);
    let matchProduct = _product.filter(function(product){
      return product.TenSP.indexOf(q) !== -1;
    });
    if(typeof(q) === 'undefined')
      res.render('product', { _product,  count, countIT, countEducation, countPsychology, countDetective});
    else
        res.render('product', { matchProduct,  count, countIT, countEducation, countPsychology, countDetective});
  });
})

app.get('/Psychology', (req, res)=>{
  let _IT = getCategory('IT');
  let _Education = getCategory('Education');
  let _Detective = getCategory('Detective');
  let _Psychology = getCategory('Psychology');
  let countIT = 0;
  let countEducation = 0;
  let countPsychology = 0;
  let countDetective = 0;
  _IT.then(count=>{
    countIT = count.length;
  });
  _Education.then(count=>{
    countEducation = count.length;
  });
  _Detective.then(count=>{
    countDetective = count.length;
  });
  _Psychology.then(count=>{
    countPsychology = count.length;
  });
  let a = getCategory('Psychology');
  a.then(_product => { 
    console.log(_product);
    let count = _product.length;
    let q = '';
    q = req.query.q;
    console.log(q);
    let matchProduct = _product.filter(function(product){
      return product.TenSP.indexOf(q) !== -1;
    });
    if(typeof(q) === 'undefined')
      res.render('product', { _product,  count, countIT, countEducation, countPsychology, countDetective});
    else
        res.render('product', { matchProduct,  count, countIT, countEducation, countPsychology, countDetective});
  });
})

app.get('/Detective', (req, res)=>{
  let _IT = getCategory('IT');
  let _Education = getCategory('Education');
  let _Detective = getCategory('Detective');
  let _Psychology = getCategory('Psychology');
  let countIT = 0;
  let countEducation = 0;
  let countPsychology = 0;
  let countDetective = 0;
  _IT.then(count=>{
    countIT = count.length;
  });
  _Education.then(count=>{
    countEducation = count.length;
  });
  _Detective.then(count=>{
    countDetective = count.length;
  });
  _Psychology.then(count=>{
    countPsychology = count.length;
  });
  let a = getCategory('Detective');
  a.then(_product => { 
    console.log(_product);
    let count = _product.length;
    let q = '';
    q = req.query.q;
    console.log(q);
    let matchProduct = _product.filter(function(product){
      return product.TenSP.indexOf(q) !== -1;
    });
    if(typeof(q) === 'undefined')
      res.render('product', { _product,  count, countIT, countEducation, countPsychology, countDetective});
    else
        res.render('product', { matchProduct,  count, countIT, countEducation, countPsychology, countDetective});
  });
})

app.post('/formBook', (req, res)=>{
  console.log(req.body);
});

app.post('/login', function(req, res){
  const _username = req.body.username;
  const _password = req.body.password;
  console.log(_username, _password);
  b = checkLogin(_username, _password);
  b.then(result => {
    console.log(result);
    if(result === true){
      console.log("dang nhap thanh cong");
      res.render('user', {userName: _username})
    }
    else if(result === false){
      res.render('login', {loginEr: 'Incorrect account or password'});
    }
  });
});

app.post('/signup', function (req, res) {

  let _MaKH = null;
  const _phone = null;
  const _address = null;
  const _username = req.body.username;
  const _email = req.body.email;
  const _password = req.body.password;
  const _confirmpassword = req.body.confirmpassword;
  console.log(_username, _email, _password, _confirmpassword);

  b = checkExist(_username);
  c = getLength();
  
  b.then(result => {
    if(result === true && _password !== _confirmpassword){
      console.log("{ User exist and password not match }");
      var a = findOne(_username);
      a.then(result => { 
        console.log(result);// result is sqlResult
      });
      res.render("signup", {passEr: 'Password and confirm password do not match', mess: 'Username already exists'});
    }
    else if(result === true){
      console.log("{ User exist }");
      var a = findOne(_username);
      a.then(result => { 
        console.log(result);// result is sqlResult
      });
      res.render("signup", {mess: 'Username already exists'});
    }
    else if(_password !== _confirmpassword){
      console.log("{ Password and confirm password do not match }");
      res.render("signup", {passEr: 'Password and confirm password do not match'});
    }
    else if(result === false){
      console.log("{ User not exist }");
      c.then(cc =>{
        console.log(cc.length);
        _MaKH = (cc.length+1).toString();
        addUser(_MaKH, _username, _email, _phone, _address, _password);
        res.render('user', {userName: _username});
      })
    }
  });
});

app.listen(app.get("port"), function(){
  console.log("Server started on port " + app.get("port"));
});