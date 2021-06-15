'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});











//seedr
  // await seedr.login("mandalbis1729@gmail.com","Bm782403");

let  getFile = async (user,pass) => {
  if(!user){
    user = "mandalbis1729@gmail.com";
  }

  if(!pass){
    pass = "Bm782403";
  }

  var seedr = require("./seedr");
  var seedr = new seedr();
  await seedr.login(user,pass);
  return  await seedr.getVideos();
  //await seedr.deleteFile("file_id");
  
};


let  init = async (user,pass,link) => {
  if(!user){
    user = "mandalbis1729@gmail.com";
  }

  if(!pass){
    pass = "Bm782403";
  }
  var seedr = require("./seedr");
  var seedr = new seedr();
  await seedr.login(user,pass);
  var all =  await seedr.getAllFilesandFolders();
  // console.log(all);
  var finalall = [];


 all.forEach(each => {
   each.forEach(each => {
    if(!finalall.includes(each['fid'])){
      // console.log(each);
      finalall.push(each['fid']);
    }
   });
  } );


  // console.log(finalall);

  for (var each of finalall) {
   var lol = await seedr.deleteFolder(each);
  //  console.log(lol);
  }

  //await seedr.deleteFile("file_id");
  var magnet =  await seedr.addMagnet(link);

  var n = true;
  while(n==true){
   var vids = await seedr.getVideos();
   if(vids.length === 0){
     n = true;
   }else{
     n = false;
     var url = await seedr.getFile(vids[0][0]['id']);
     url = url['url'];
    //  console.log(url);
     return url;
   }
  }
 
};




let  getall = async (user,pass) => {
  if(!user){
    user = "mandalbis1729@gmail.com";
  }

  if(!pass){
    pass = "Bm782403";
  }
  var seedr = require("./seedr");
  var seedr = new seedr();
  await seedr.login(user,pass);
  return await seedr.getAllFilesandFolders();
};




let  download = async (id,user,pass) => {
  if(!user){
    user = "mandalbis1729@gmail.com";
  }

  if(!pass){
    pass = "Bm782403";
  }
  var seedr = require("./seedr");
  // console.log(user,pass);
  var seedr = new seedr();
  await seedr.login(user,pass);
  return  await seedr.getFile(id);
  //
  
};

let  deleteFolder = async (fid,user,pass) => {
  if(!user){
    user = "mandalbis1729@gmail.com";
  }

  if(!pass){
    pass = "Bm782403";
  }
  var seedr = require("./seedr");
  var seedr = new seedr();
  await seedr.login(user,pass);
  return  await seedr.deleteFolder(fid);
  //
  
};

let  addMagnet = async (link,user,pass) => {
  if(!user){
    user = "mandalbis1729@gmail.com";
  }

  if(!pass){
    pass = "Bm782403";
  }
  var seedr = require("./seedr");
  var seedr = new seedr();
  await seedr.login(user,pass);
  return  await seedr.addMagnet(link);
  //
  
};


router.get('/seedr/get', async function(req, res){
  const user = req.query.user
  const pass = req.query.pass
  var value = await getFile(user,pass); 
  try{
  res.send(value);
  }
  catch(e){
    res.send(e);

}
})

router.get('/seedr/download', async function(req, res){
  const id = req.query.id
  const user = req.query.user
  const pass = req.query.pass
  try{
  var value = await download(id,user,pass); 

  var uri = value['url'];
  res.writeHead(302, {
    'Location': uri
    //add other headers here...
  });
  res.end();

  // console.log(uri);

  }
  catch(e){
      res.send(e);
  }
  // res.send(value);
})

router.get('/seedr/delete', async function(req, res){
  const user = req.query.user
  const pass = req.query.pass
  const fid = req.query.fid
  try{
  var value = await deleteFolder(fid,user,pass); 
  res.send(value);
  }  catch(e){
    res.send(e);

}
})

router.get('/seedr/magnet', async function(req, res){
  const user = req.query.user
  const pass = req.query.pass
  const link = req.query.link
  try{
  var value = await addMagnet(link,user,pass); 
  res.send(value);
  }
  catch(e){
    res.send(e);

}
})


router.get('/seedr/stream', async function(req, res){
  const user = req.query.user
  const pass = req.query.pass
  const link = req.query.link
  try{
  var value = await init(user,pass,link); 
  // res.pipe(request.get(value)).pipe(res);
  // res.send(value);
  var uri = value;
  res.writeHead(302, {
    'Location': uri
    //add other headers here...
  });
  res.end();

  }
  catch(e){
    res.send(e);
}
})




router.get('/seedr/getall', async function(req, res){
  const user = req.query.user
  const pass = req.query.pass
  try{
  var value = await getall(user,pass); 
  res.send(value);
  }
  catch(e){
    res.send(e);

}
})


//seedr









module.exports = app;
module.exports.handler = serverless(app);
