require('msnodesqlv8');
require('tedious');
const bcrypt = require('bcrypt');
const saltRounds = 10; 

const config = require('../dbconfig')

var sql = require("mssql");
const { user } = require('../dbconfig');

  // connect to your database
async function checkExist(username){
    try {
        await sql.connect(config)
        const result = await sql.query('use QLSACH; select * from KHACHHANG');
        for (var i = 0; i < result.recordset.length; i++){ 
            if(result.recordset[i].TenKH === username){
              return true;
            }
        }
        return false;
    } catch (err) {
      console.log(err);
    }
}

async function checkProductExist(ID){
  try {
      await sql.connect(config)
      const result = await sql.query('use QLSACH; select * from SanPham');
      for (var i = 0; i < result.recordset.length; i++){ 
          if(result.recordset[i].MaSP === ID){
            return true;
          }
      }
      return false;
  } catch (err) {
    console.log(err);
  }
}

async function getLength(){
  try {
      await sql.connect(config)
      const result = await sql.query('use QLSACH; select * from KHACHHANG');
      return result.recordset;
  } catch (err) {
    console.log(err);
  }
}

async function checkLogin(username, password){
  try {
      await sql.connect(config)
      const result = await sql.query('use QLSACH; select * from KHACHHANG');
      for (var i = 0; i < result.recordset.length; i++){ 
          if(result.recordset[i].TenKH === username){
            const isMatch = await bcrypt.compare(password, result.recordset[i].Pass);
            if(isMatch === true)
              return true;
            else
              return false;
          }
      }
      return false;
  } catch (err) {
    console.log(err);
  }
}

async function findOne(username){
    let sqlResult = '';
    try {
        await sql.connect(config)
        const result = await sql.query('use QLSACH; select * from KHACHHANG');
        for (var i = 0; i < result.recordset.length; i++){ 
            if(result.recordset[i].TenKH === username){
              return result.recordset[i];
            }
          }
        // return false
    } catch (err) {
        console.log(err)
    }

    return sqlResult;
}

async function addUser(MaKH, username, email, phone, address, password){
  if(await checkExist(username) == true){ 
    console.log("User already existed")
    return false;
  }
  else{
    sql.connect(config, function (err) {
      
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        bcrypt.hash(password, saltRounds, function(err, hash) {
          if (err) console.log(err);
          request.query("use QLSach; INSERT INTO KHACHHANG(MaKH, TenKH, Email, SDT, DiaChi, Pass) VALUES('"+MaKH +"', '"+username +"', '"+email +"','"+phone +"', '"+address +"', '"+hash +"')", function (err, data) {  
            if (err) console.log(err)
            else console.log("User added successfully")
            
            return true;
          });
        });
    });
  }
}

async function delUser(username){
  if(checkExist(username) === false){ 
    console.log("User not exist")
    return false;
  }
  else{
    sql.connect(config, function (err) {
      
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        request.query("use QLSach; DELETE FROM KHACHHANG WHERE TenKH ='"+username +"'", function (err, data) {  
          if (err) console.log(err)
          else console.log("User deleted succesfully")
          return true
        });
    });
  }
}

async function delProduct(id){
  if(await checkProductExist(id) !== true){ 
    console.log("Book not exist")
    return false;
  }
  else{
    sql.connect(config, function (err) {
      
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        request.query("use QLSach; DELETE FROM SanPham WHERE MaSP ='"+id +"'", function (err, data) {  
          if (err) console.log(err)
          else console.log("Book deleted succesfully")
          return true
        });
    });
  }
}

async function getAllOrder(){
  let sqlResult = '';
  try {
      await sql.connect(config)
      const result = await sql.query('use QLSach; select * from ORDER');
      return result.recordset
  } catch (err) {
      console.log(err)
  }

  return sqlResult;
}

async function getAllUser(){
  let sqlResult = '';
  try {
      await sql.connect(config)
      const result = await sql.query('use QLSach; select * from KhachHang');
      console.log("adfadf");
      console.log(result.recordset);
      return result.recordset;
  } catch (err) {
      console.log(err)
  }

  return sqlResult;
}

async function getAllProduct(){
  let sqlResult = '';
  try {
      await sql.connect(config)
      const result = await sql.query('use QLSach; select * from SanPham');
      return result.recordset
  } catch (err) {
      console.log(err)
  }
  return sqlResult;
}

async function getCategory(cate){
  let sqlResult = '';
  try {
      await sql.connect(config)
      const result = await sql.query("use QLSach; select * from SanPham where LoaiSP='"+cate +"'");
      return result.recordset
  } catch (err) {
      console.log(err)
  }
  return sqlResult;
}

async function addProduct(ID, name, category, price, link, date){
  if(await checkProductExist(ID) === true){ 
    console.log("Product already existed")
    return false;
  }
  else{
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
          if (err) console.log(err);
          request.query("use QLSach; INSERT INTO SANPHAM(MaSP, TenSP, LoaiSP, Gia, LinkAnh, NgayThem) VALUES('"+ID +"', '"+name +"', '"+category +"', '"+price +"', '"+link +"', '"+date +"')", function (err, data) {  
            if (err) console.log(err)
            else console.log("Product added successfully")
            return true
          });
    });
  }
}


async function updateProduct(ID, name, category, price, link, date){
  if(await checkProductExist(ID) !== true){ 
    console.log("Product doesn't exists")
    return false;
  }
  else{
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
          if (err) console.log(err);
          request.query("use QLSach; UPDATE SANPHAM SET TenSP = '"+name +"', LoaiSP = '"+category +"', Gia = '"+price +"', LinkAnh = '"+link +"', NgayThem = '"+date +"' WHERE MaSP = '"+ID +"'", function (err, data) {  
            if (err) console.log(err)
            else console.log("Product changed successfully")
            return true
          });
    });
  }
}

async function pushEL(){
  let error = "USER EXSIT";
  document.getElementById("error").innerHTML = error;
}

module.exports = {
  checkExist: checkExist,
  addUser: addUser,
  delUser: delUser,
  findOne: findOne,
  getAllOrder: getAllOrder,
  getAllProduct: getAllProduct,
  addProduct: addProduct,
  updateProduct: updateProduct,
  pushEL: pushEL,
  checkLogin: checkLogin,
  getLength: getLength,
  getCategory: getCategory,
  getAllUser: getAllUser,
  checkProductExist: checkProductExist,
  delProduct: delProduct,
}
