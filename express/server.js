'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const fs = require('fs');
const http = require('http');
const request = require('request');
var cors = require('cors');
var os = require('os');
var axios = require("axios");
var FormData = require('form-data');


var key = 'somebodysomewhereanddevlol';


String.prototype.nthLastIndexOf = function(searchString, n) {
    var url = this;
    if (url === null) {
        return -1;
    }
    if (!n || isNaN(n) || n <= 1) {
        return url.lastIndexOf(searchString);
    }
    n--;
    return url.lastIndexOf(searchString, url.nthLastIndexOf(searchString, n) - 1);
};

// Create an encryptor:
var encryptor = require('simple-encryptor')(key)

const router = express.Router();


router.use(cors());

let domain = 'https://thawning.tanishagoyal.repl.co/';




router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});










app.get('/api', (req, res) => {
    try {

        if (req.query.name) {
            res.header('Content-Disposition', 'attachment; filename="' + req.query.name + '"');
        }

        var uri = req.query.uri // $_GET["id"]

        req.pipe(request.get(uri)).pipe(res)
    } catch (e) {
        res.send(e)
    }
})




app.get('/voesx', async function(req, res) {
    try {
        var uri = req.query.url; // $_GET["id"]

        var data = await getHTML(uri);
        // console.log(data)
        const regex = /[hls:"]([http|https][\.\d\w\-\.\/\\\:\?\&\#\%\_\,]*(\.m3u8))/;
        data = data.match(regex);
        url = data[1];
        res.redirect('/multim3u8?url=' + url);

    } catch (e) {
        res.send(e);
    }
})
//voesx




app.get("/mailru", async function(req, res) {
    var axios = require("axios");

    try {
        var m = req.query.mid; // $_GET["id"]
        var i = req.query.pid; // $_GET["id"]
        var data = await axios.get(`https://cloud.mail.ru/api/v2/dispatcher?api=2&build=release-cloudweb-12350-82-0-1.202108031333&x-page-id=${i}&email=anonym&x-email=anonym&_=1628592047469`)

        data = data.data;

        // https://cloclo20.cloud.mail.ru/videowl/0p/ZjVXUi85UnFLUVJxa3A=.m3u8?double_encode=1
        // https://cloclo20.cloud.mail.ru/videowl/

        //example mid = ZjVXUi85UnFLUVJxa3A & pid = OyMIEYWQII



        var cloud_url = `${data.body.weblink_video[0].url}0p/${m}=.m3u8?double_encode=1`;

        res.redirect("/mailrumultim3u8?url=" + encodeURIComponent(cloud_url));
    } catch (e) {
        res.send(e);
    }
});




app.get("/mailrumultim3u8", async function(req, res) {
    try {
        var uri = req.query.url; // $_GET["id"]
        var data = await getHTML(uri);

        // res.send(data);

        // var n = uri.indexOf('/');
        // var re = uri.substr(0, n[-1]);

        var re = uri.substring(0, uri.nthLastIndexOf("/", 3));

        // data = data.split("\n");

        data = data.split("\n");
        var final = "";

        data.forEach((element) => {
            if (element[0] == "#") {
                final = final + element + "\n";
            } else if (element != "") {
                if (element.includes("http")) {
                    final = final + domain + "mailrusinglem3u8?url=" + encodeURIComponent(element) + "\n";
                } else {
                    final =
                        final + domain + "mailrusinglem3u8?url=" + re + "/" + encodeURIComponent(element) + "\n";
                }
            }
            // final = final + element;
        });

        //  res.send(final);

        // res.setHeader('Content-type','application/text')
        // res.setHeader('Content-Disposition','attachment; filename=index.m3u8')

        res.setHeader("Content-type", "application/x-mpegURL");
        res.send(final);
    } catch (e) {
        res.send(e);
    }
});

app.get("/mailrusinglem3u8", async function(req, res) {
    try {
        var uri = req.query.url; // $_GET["id"]
        var data = await getHTML(uri);

        // var n = uri.indexOf('/');
        // var re = uri.substr(0, n[-1]);
        var re = uri.substring(0, uri.nthLastIndexOf("/", 3));

        // data = data.split("\n");

        data = data.split("\n");
        var final = "";

        data.forEach((element) => {
            if (element[0] == "#" && !element.includes("EXT-X-KEY")) {
                final = final + element + "\n";
            } else if (element != "" && !element.includes("EXT-X-KEY")) {
                if (element.includes("http")) {
                    final = final + domain + "api?uri=" + encodeURIComponent(element) + "\n";
                } else {
                    final = final + domain + "api?uri=" + re + "/" + encodeURIComponent(element) + "\n";
                }
            } else if (element.includes("EXT-X-KEY")) {
                var nnn = element.replace(
                    "api-dev.penpencil.xyz/v1/videos/get-hls-key",
                    "phpstreamer.herokuapp.com/pw.php"
                );
                //  nnn = nnn.replace('&key=enc.key"','&key=enc.key"\n');
                // &key=enc.key"
                final = final + nnn + "\n";
            }
            // final = final + element;
        });

        // res.setHeader('Content-type: application/text')
        // res.setHeader('Content-Disposition: attachment; filename=index.m3u8')

        res.setHeader("Content-type", "application/x-mpegURL");
        res.send(final);
    } catch (e) {
        res.send(e);
    }
});




///n3u8
app.get('/multim3u8', async function(req, res) {
    try {
        var uri = req.query.url; // $_GET["id"]
        var data = await getHTML(uri);

        // res.send(data);

        // var n = uri.indexOf('/');
        // var re = uri.substr(0, n[-1]);
        var re = uri.substring(0, uri.lastIndexOf("/"));

        // data = data.split("\n");

        data = data.split('\n');
        var final = ''

        data.forEach(element => {
            if (element[0] == '#') {
                final = final + element + '\n';
            } else if (element != '') {
                if (element.includes('http')) {
                    final = final + domain + 'singlem3u8?url=' + encodeURIComponent(element) + '\n';
                } else {
                    final = final + domain + 'singlem3u8?url=' + re + '/' + encodeURIComponent(element) + '\n';
                }
            }
            // final = final + element;
        })

        //  res.send(final);

        // res.setHeader('Content-type','application/text')
        // res.setHeader('Content-Disposition','attachment; filename=index.m3u8')

        res.setHeader("Content-type", "application/x-mpegURL");
        res.send(final);
    } catch (e) {
        res.send(e);
    }
})

app.get('/singlem3u8', async function(req, res) {
    try {
        var uri = req.query.url; // $_GET["id"]
        var data = await getHTML(uri);

        // var n = uri.indexOf('/');
        // var re = uri.substr(0, n[-1]);
        var re = uri.substring(0, uri.lastIndexOf("/"));

        // data = data.split("\n");

        data = data.split('\n');
        var final = '';

        data.forEach(element => {
            if (element[0] == '#' && !element.includes('EXT-X-KEY')) {
                final = final + element + '\n';
            } else if (element != '' && !element.includes('EXT-X-KEY')) {
                if (element.includes('http')) {
                    final = final + domain + 'api?uri=' + encodeURIComponent(element) + '\n';
                } else {
                    final = final + domain + 'api?uri=' + re + '/' + encodeURIComponent(element) + '\n';
                }
            } else if (element.includes('EXT-X-KEY')) {
                var nnn = element.replace("api-dev.penpencil.xyz/v1/videos/get-hls-key", "phpstreamer.herokuapp.com/pw.php");
                //  nnn = nnn.replace('&key=enc.key"','&key=enc.key"\n');
                // &key=enc.key"
                final = final + nnn + '\n';
            }
            // final = final + element;
        })

        // res.setHeader('Content-type: application/text')
        // res.setHeader('Content-Disposition: attachment; filename=index.m3u8')

        res.setHeader("Content-type", "application/x-mpegURL");
        res.send(final);

    } catch (e) {
        res.send(e)
    }
})

let getHTML = async (url) => {

    var axios = require("axios");
    const response = await axios.get(url);
    // console.log(response.data);
    return response.data.toString();
    // return await request.get(url)
    //await seedr.deleteFile("file_id");
}


//n3u8




app.get('/encrypt', (req, res) => {
    try {
        var user = req.query.user // $_GET["id"]
        var pass = req.query.pass // $_GET["id"]
        // nested object:
        var obj = {
            user,
            pass
        }
        var objEnc = encryptor.encrypt(obj)

        res.send(objEnc)
        // var objDec = encryptor.decrypt(objEnc);
    } catch (e) {
        res.send(e)
    }
})




// app.get('/decrypt', (req, res) => {
//   try {
//     var hash = req.query.hash; // $_GET["id"]
//     var objDec = encryptor.decrypt(hash);
//     res.send(objDec);
//     // var objDec = encryptor.decrypt(objEnc);
//   } catch (e) {
//     res.send(e);
//   }
// });



app.get('/vidsrcstream', (req, res) => {
    var uri = req.query.id // $_GET["id"]
    var index = req.query.index
    try {
        request.post(
            'https://vidsrc.xyz/api/source/' + uri, {
                json: {
                    r: ''
                }
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    // body = JSON.parse(body);
                    // console.log(body);

                    body = body['data']
                    console.log(body)

                    var final = []
                    body.forEach(element => {
                        // request(element['file'], {method: 'HEAD'}, function (err, res, body){
                        //  final.push(element['file']);
                        // });

                        final.push(element['file'])
                    })

                    // res.send(final);
                    req.pipe(request.get(final[index])).pipe(res)
                    // got.stream(final[index]).pipe(res);
                }
            }
        )
    } catch (e) {
        res.send(e)
    }
})

app.get('/fembedstream', (req, res) => {
    var uri = req.query.id // $_GET["id"]
    var index = req.query.index
    try {
        request.post(
            'https://www.fembed.com/api/source/' + uri, {
                json: {
                    r: ''
                }
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    // body = JSON.parse(body);
                    // console.log(body);

                    body = body['data']
                    console.log(body)

                    var final = []
                    body.forEach(element => {
                        // request(element['file'], {method: 'HEAD'}, function (err, res, body){
                        //  final.push(element['file']);
                        // });

                        final.push(element['file'])
                    })

                    // res.send(final);
                    req.pipe(request.get(final[index])).pipe(res)
                    // got.stream(final[index]).pipe(res);
                }
            }
        )
    } catch (e) {
        res.send(e)
    }
})

app.get('/fembed', (req, res) => {
    var uri = req.query.id // $_GET["id"]
    try {
        request.post(
            'https://www.fembed.com/api/source/' + uri, {
                json: {
                    r: ''
                }
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    // body = JSON.parse(body);
                    //  console.log(body);
                    //  console.log(body);

                    body = body['data']

                    var final = []
                    body.forEach(element => {
                        var index = body.indexOf(element)
                        final.push([
                            element['label'],
                            domain + 'fembedstream?id=' + uri + '&index=' + index
                        ])
                    })

                    // res.send(final);
                    res.send(JSON.stringify(final))
                }
            }
        )
    } catch (e) {
        res.send(e)
    }
})

//seedr
// await seedr.login("mandalbis1729@gmail.com","Bm782403");

let getFile = async (user, pass) => {
    if (!user) {
        user = 'mandalbis1729@gmail.com'
    }

    if (!pass) {
        pass = 'Bm782403'
    }

    var seedr = require('./seedr')
    var seedr = new seedr()
    await seedr.login(user, pass)
    return await seedr.getVideos()
    //await seedr.deleteFile("file_id");
}

let init = async (user, pass, link) => {
    var seedr = require('./seedr');
    var seedr = new seedr();
    await seedr.login(user, pass);
    var all = await seedr.getAllFilesandFolders();
    // console.log(all);
    var finalall = [];

    all.forEach(each => {
        each.forEach(each => {
            if (!finalall.includes(each['fid'])) {
                // console.log(each);
                finalall.push(each['fid'])
            }
        })
    })

    // console.log(finalall);

    for (var each of finalall) {
        var lol = await seedr.deleteFolder(each);
        //  console.log(lol);
    }

      var token = await getToken(user, pass);
    var status = await axios("https://www.seedr.cc/api/folder?access_token=" + token);
  status = status.data.torrents;

      for (var each of status) {
        var d = await deleteTorrent(each["id"], token);
        //  console.log(lol);
    }
    //await seedr.deleteFile("file_id");
    var magnet = await seedr.addMagnet(link);


   status = await axios("https://www.seedr.cc/api/folder?access_token=" + token);
  status = status.data.torrents;

    var progress = status[0]["progress_url"];
    var tid = status[0]["id"];

    var n = true
    while (n == true) {
        var vids = await seedr.getVideos();

        var progdata = await axios(progress);

        progdata = `${progdata.data}`;
       progdata = progdata.substring(1);
       progdata = progdata.substring(1);
       progdata = progdata.slice(0, -1);
      progdata = JSON.parse(progdata);
      
        console.log(progdata);

      if (progdata.warnings && progdata.warnings != '[]' && vids.length === 0 ) {
            n = false;
            var d = await deleteTorrent(tid, token);
            console.log(d);
            return 'slowSeed';
        }
      
        if (vids.length === 0) {
            n = true
        }else {
            n = false;

            if( 0 in vids && 0 in vids[0] && 'id' in vids[0][0]){
            var url = await seedr.getFile(vids[0][0]['id']);
            url = url['url'];
            console.log("done: "+url);
            return url;
            }
          return "noVid";
        }
    }
}


let deleteTorrent = async (id, token) => {
    var data = new FormData();
    data.append('access_token', token);
    data.append('func', 'delete');
    data.append('delete_arr', JSON.stringify([{
        type: 'torrent',
        id: id
    }]));

    var res = await axios({
        method: 'post',
        url: 'https://www.seedr.cc/oauth_test/resource.php',
        headers: data.getHeaders(),
        data: data
    });
    return res.data;
}


let getall = async (user, pass) => {
    var seedr = require('./seedr')
    var seedr = new seedr()
    await seedr.login(user, pass)
    return await seedr.getAllFilesandFolders()
}

let download = async (id, user, pass) => {
    var seedr = require('./seedr')
    // console.log(user,pass);
    var seedr = new seedr()
    await seedr.login(user, pass)
    return await seedr.getFile(id)
    //
}

let play = async (id, user, pass) => {
    var seedr = require('./seedr')
    // console.log(user,pass);
    var seedr = new seedr()
    await seedr.login(user, pass)
    return await seedr.getVideo(id)
    //
}

let deleteFolder = async (fid, user, pass) => {

    var seedr = require('./seedr')
    var seedr = new seedr()
    await seedr.login(user, pass)
    return await seedr.deleteFolder(fid)
    //
}


let getToken = async (user, pass) => {
    var data = new FormData();
    data.append('grant_type', 'password');
    data.append('client_id', 'seedr_chrome');
    data.append('type', 'login');
    data.append('username', user);
    data.append('password', pass);
    var token = await axios({
        method: 'post',
        url: 'https://www.seedr.cc/oauth_test/token.php',
        headers: data.getHeaders(),
        data: data
    });
    return token.data["access_token"];
    //
}


let getCurrentStatus = async (user, pass) => {
    var token = await getToken(user, pass);
    var data = await axios("https://www.seedr.cc/api/folder?access_token=" + token);
    return data.data.torrents;
    //
}


let addMagnet = async (link, user, pass) => {
    if (!user) {
        user = 'mandalbis1729@gmail.com'
    }

    if (!pass) {
        pass = 'Bm782403'
    }
    var seedr = require('./seedr')
    var seedr = new seedr()
    await seedr.login(user, pass)
    return await seedr.addMagnet(link)
    //
}

app.get('/seedr/get', async function(req, res) {
    // const user = req.query.user
    // const pass = req.query.pass
    //s
    var hash = req.query.hash // $_GET["id"]
    if (!hash) {
        res.send('send hash lol')
    }
    if (hash.includes('/') || hash.includes('+')) {
        res.send('send proper hash lol')
    }
    var objDec = encryptor.decrypt(hash)
    if (objDec['user'] && objDec['pass']) {
        var user = objDec['user']
        var pass = objDec['pass']
    }

    var value = await getFile(user, pass)
    try {
        res.send(value)
    } catch (e) {
        res.send(e)
    }
})

app.get('/seedr/download', async function(req, res) {
    try {
        const id = req.query.id
        // const user = req.query.user
        // const pass = req.query.pass
        const embed = req.query.embed
        const pipe = req.query.pipe

        var hash = req.query.hash // $_GET["id"]
        if (!hash) {
            res.send('send hash lol')
        }
        //if (hash.includes('/') || hash.includes('+')) {\n     // res.send('send proper hash lol')\n   // }
        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        }

        try {
            var value = await download(id, user, pass)

            if (embed == 1) {
                var uri = value['url']
                var value1 = await play(id, user, pass)
                var eng = value1['subtitles']['English']
                var pre = value1['url_preroll']

                res.send(
                    `

<html>
<head>
 <meta name="viewport" content="width=device-width, initial-scale=1"> 
<style type="text/css">
body{
	padding: 0px;
	margin: 0px;
	background: black;
}

        .video {
          height: calc(100%);
          width: 100%;
          background: black;
          position: absolute;
      }
      


    </style> 
    <script src="https://cdn.plyr.io/3.6.8/plyr.js"></script>
    <link rel="stylesheet" href="https://cdn.plyr.io/3.6.8/plyr.css" />
    <link rel="stylesheet" href="https://cdn.plyr.io/3.6.8/demo.css" />
  </head>
<body>
  <div class='video'>
  <video id="player" playsinline controls data-poster="${pre}">
  <source src="${uri}"/>

  <!-- Captions are optional -->
  <track kind="captions" label="English captions" src="${domain +
    'api?uri=' +
    eng}" srclang="en" default />
</video>

          <script>
          const player = new Plyr('#player', {
            captions: {
              active: true,
              language: "en"
            }
          });</script>
  </div>
  </body>
</html>
`
                )
            } else {
                if (pipe == 1) {
                    var uri = value['url'];
    if (req.query.name) {
     console.log(req.query.name);
      res.header('Content-Disposition', `attachment; filename="${req.query.name}"`);
        }
            req.pipe(request.get(uri)).pipe(res);
                  
                } else {
                    var uri = value['url']
                    res.writeHead(302, {
                        Location: uri
                        //add other headers here...
                    })
                    res.end()
                }
            }

            // console.log(uri);
        } catch (e) {
            res.send(e)
        }
        // res.send(value);
    } catch (e) {
        res.send(e)
    }
})

app.get('/seedr/deletefolder', async function(req, res) {
    try {
        // const user = req.query.user
        // const pass = req.query.pass
        var hash = req.query.hash // $_GET["id"]
        const fid = req.query.fid

        if (!hash) {
            res.send('send hash lol')
        }

        //if (hash.includes('/') || hash.includes('+')) {\n     // res.send('send proper hash lol')\n   // }
        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        }

        try {
            var value = await deleteFolder(fid, user, pass)
            res.send(value)
        } catch (e) {
            res.send(e)
        }
    } catch (e) {
        res.send(e)
    }
})



app.get('/seedr/getToken', async function(req, res) {
    try {
        var hash = req.query.hash // $_GET["id"]
        const fid = req.query.fid

        if (!hash) {
            res.send('send hash lol')
        }

        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        }

        try {
            var value = await getToken(user, pass)
            res.send(value)
        } catch (e) {
            res.send(e)
        }
    } catch (e) {
        res.send(e)
    }
});

app.get('/seedr/getCurrentStatus', async function(req, res) {
    try {
        var hash = req.query.hash // $_GET["id"]
        const fid = req.query.fid

        if (!hash) {
            res.send('send hash lol')
        }

        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        }

        try {
            var value = await getCurrentStatus(user, pass);
            res.send(value)
        } catch (e) {
            res.send(e)
        }
    } catch (e) {
        res.send(e)
    }
});




app.get('/seedr/magnet', async function(req, res) {
    try {
        // const user = req.query.user
        // const pass = req.query.pass
        var hash = req.query.hash // $_GET["id"]
        if (!hash) {
            res.send('send hash lol')
        }
        //if (hash.includes('/') || hash.includes('+')) {\n     // res.send('send proper hash lol')\n   // }
        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        }
        const link = req.query.link
        try {
            var value = await addMagnet(link, user, pass)
            res.send(value)
        } catch (e) {
            res.send(e)
        }
    } catch (e) {
        res.send(e)
    }
})

app.get('/seedr/subtitles', async function(req, res) {
    try {
        // const user = req.query.user
        // const pass = req.query.pass
        var hash = req.query.hash // $_GET["id"]
        if (!hash) {
            res.send('send hash lol')
        }
        //if (hash.includes('/') || hash.includes('+')) {\n     // res.send('send proper hash lol')\n   // }
        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        }

        const link = req.query.id
        try {
            if (!user) {
                user = 'mandalbis1729@gmail.com'
            }

            if (!pass) {
                pass = 'Bm782403'
            }
            var seedr = require('./seedr')
            // console.log(user,pass);
            var seedr = new seedr()
            await seedr.login(user, pass)

            var value = await seedr.getVideo(link)
            var eng = value['subtitles']['English']

            req.pipe(request.get(eng)).pipe(res)
        } catch (e) {
            res.send(e)
        }
    } catch (e) {
        res.send(e)
    }
})

app.get('/seedr/seeAllCurrentFiles',async function(req, res) {
    try {
    var html= '';
      var cars = await getall('anandrambkn@gmail.com','@Anu2240013');
     for (let i = 0; i < cars.length; i++) {
       for (let j = 0; j < cars[i].length; j++) {
  var name = cars[i][j].name;
  var idi = cars[i][j].id;
         var hash = '558fa765f980b01f1c2e5e4ae37bfe3502ba33c1ec90cc5bb659dbb250bc6c813bde363a2055bf1ae8d9e0dd101d166fpu3d5hWgFdAHXzF0EumwUE1moKtyN8mjzesi2ym2mbwf4YGUAU3mX5CnWgu42pPwZCfQKQK9GDpAl%2BKm3XbW1A%3D%3D';

         
      html += `<tr>
<td>
${name}
</td>


<td>
<a class="waves-effect waves-light btn" href="/seedr/download?id=${idi}&hash=${hash}">Download</a>
</td>

<td>
<a class="waves-effect waves-light btn" href="/seedr/play?id=${idi}&hash=${hash}&embed=1">Play</a>
</td>

</tr>
`;

}
     }


      
res.send(
  `  <!DOCTYPE html>
  <html>
    <head>
      <!--Import Google Icon Font-->
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <!--Import materialize.css-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

      <!--Let browser know website is optimized for mobile-->
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>

    <body class="container">
<h4>All Files</h4><table>
${html}
</table>
<br>

<a class="waves-effect waves-light btn" href="https://torrent.tanishagoyal.repl.co/">Go Back</a>


      <!--JavaScript at end of body for optimized loading-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    </body>
  </html>`
);


      
    }
    
    catch(r){
      console.log(r);
      res.send(r)}

});

app.get('/seedr/stream', async function(req, res) {
    try {
        // const user = req.query.user
        // const pass = req.query.pass
        var hash = req.query.hash // $_GET["id"]
        if (!hash) {
            res.send('send hash lol')
        }
        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        }
        const link = req.query.link
        try {
            var value = await init(user, pass, link)
            // res.pipe(request.get(value)).pipe(res);
            // res.send(value);
            var uri = value;

            if (uri == 'slowSeed') {

                res.send(`
  <!DOCTYPE html>
  <html>
    <head>
      <!--Import Google Icon Font-->
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <!--Import materialize.css-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

      <!--Let browser know website is optimized for mobile-->
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>

    <body class="container">

<h3>Slow Torrent detected select another torrent with high no of seeds</h3>

<br>

<a class="waves-effect waves-light btn" href="https://torrent.tanishagoyal.repl.co/">Go Back</a>


      <!--JavaScript at end of body for optimized loading-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    </body>
  </html>
        

`);
            }
              else if (uri == 'noVid') {
         res.writeHead(302, {
              Location: "/seedr/seeAllCurrentFiles"
              //add other headers here...
            });

              }
            
            
            else {
                res.send(`

  <!DOCTYPE html>
  <html>
    <head>
      <!--Import Google Icon Font-->
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <!--Import materialize.css-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

      <!--Let browser know website is optimized for mobile-->
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>

    <body class="container">

<a href="${uri}" target="_blank">${uri}</a>
<br>

<h3>Links Generated (Valid For Next 24 Hours);</h3>
<a class="waves-effect waves-light btn" href="${uri}" target="_blank">Download</a>

<br>
<a class="waves-effect waves-light btn" href="https://www.hlsplayer.net/mp4-player#type=mp4&src=${encodeURIComponent(uri)}" target="_blank">Play online</a>
<br>

<a class="waves-effect waves-light btn" href="vlc://${encodeURIComponent(uri)}" target="_blank">Play In Vlc (android)</a>
<br>


<a class="waves-effect waves-light btn" href="intent:${encodeURIComponent(uri)}#Intent;package=com.mxtech.videoplayer.ad;S.title=Play;end" target="_blank">Play in Mx Player (android)</a>
<br>


<a class="waves-effect waves-light btn" href="https://chromecast.link/#title=Playing_Torrent&poster=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2Fo76ZDm8PS9791XiuieNB93UZcRV.jpg&content=${encodeURIComponent(uri)}">Cast To TV</a>
<br>

<a class="waves-effect waves-light btn" href="/seedr/seeAllCurrentFiles">See All files in torrent</a>
<br>
<br>

<a class="waves-effect waves-light btn" href="https://torrent.tanishagoyal.repl.co/">Go Back</a>



      <!--JavaScript at end of body for optimized loading-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    </body>
  </html>
        
            `);
            }
            // res.writeHead(302, {
            //   Location: uri
            //   //add other headers here...
            // });

            res.end()
        } catch (e) {
          console.log(e)
            res.send(e)
        }
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

app.get('/seedr/getall', async function(req, res) {
    try {
        // const user = req.query.user
        // const pass = req.query.pass
        var hash = req.query.hash // $_GET["id"]
        if (!hash) {
            res.send('send hash lol')
        }
        //if (hash.includes('/') || hash.includes('+')) {\n     // res.send('send proper hash lol')\n   // }
        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        }

        try {
            var value = await getall(user, pass)
            res.send(value)
        } catch (e) {
            res.send(e)
        }
    } catch (e) {
        res.send(e)
    }
})

let getsettings = async (user, pass) => {
    if (!user) {
        user = 'mandalbis1729@gmail.com'
    }

    if (!pass) {
        pass = 'Bm782403'
    }
    var seedr = require('./seedr')
    // console.log(user,pass);
    var seedr = new seedr()
    await seedr.login(user, pass)
    return await seedr.getSettings()
    //
}

app.get('/seedr/getsettings', async function(req, res) {
    try {
        // const user = req.query.user
        // const pass = req.query.pass
        var hash = req.query.hash // $_GET["id"]
        if (!hash) {
            res.send('send hash lol')
        }
        //if (hash.includes('/') || hash.includes('+')) {\n     // res.send('send proper hash lol')\n   // }
        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        }

        try {
            var value = await getsettings(user, pass)
            res.send(value)
        } catch (e) {
            res.send(e)
        }
    } catch (e) {
        res.send(e)
    }
})

app.get('/seedr/play', async function(req, res) {
    try {
        const id = req.query.id

        // const user = req.query.user
        // const pass = req.query.pass
        var hash = req.query.hash // $_GET["id"]
        if (!hash) {
            res.send('send hash lol')
        }
        //if (hash.includes('/') || hash.includes('+')) {\n     // res.send('send proper hash lol')\n   // }
        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        }

        const embed = req.query.embed
        try {
            var value = await play(id, user, pass)

            // res.send(value);
            if (embed == 1) {
                var uri = value['url_hls']
              console.log( value)
                var eng = value['subtitles']['English']
                var pre = value['url_preroll']

                res.send(
                    `

<html>
<head>
 <meta name="viewport" content="width=device-width, initial-scale=1"> 
<style type="text/css">
        html,
        body {
            width: 100%;
            height: 100%;
            background: #000;
            overflow: hidden;
            position: fixed;
            border: 0;
            margin: 0;
            padding: 0;
        }

        #player {
            position: absolute;
            min-width: 100%;
            min-height: 100%;
        }

        .video-js .vjs-volume-panel .vjs-volume-level:before {
            top: -0.60em !important;
        }

        .jw-logo-button {
            width: 80px !important;
        }
.jw-aspect {
    padding-top: 0 !important;
}
        .jw-logo-button>div {
            width: 100% !important;
        }

        @media  only screen and (max-width: 500px) {
            .jw-logo-button {
                width: 50px !important;
            }
        }

    </style> 
  <style>
        .icon {
            display: inline-block;
            width: 1em;
            height: 1em;
            stroke-width: 0;
            stroke: currentColor;
            fill: currentColor;
        }

    </style>
  </head>
<body>
  <div class='video'>
  <script src="https://use.fontawesome.com/20603b964f.js"></script>
<script type="text/javascript" src="https://cdn.jwplayer.com/libraries/ocNS2ThC.js"></script>
		<script type="text/javascript">jwplayer.key = 'ypdL3Acgwp4Uh2/LDE9dYh3W/EPwDMuA2yid4ytssfI=';</script><div id="player"></div><script type="text/javascript">
					    jwplayer("player").setup({
								image: "${pre}",
					   // 		aspectratio: "16:9",
								// width: '100%',
					    		autostart: false,
				file : '${uri}',
        tracks:[{"file":"${eng}","label":"English","kind":"captions","default":"true"}],
				abouttext: 'FLIXY',
				aboutlink: 'http://flixy.ga'
						    })
					</script>
  </div>
  </body>
</html>
`
                )
            } else {
                var uri = value['url_hls']
                res.writeHead(302, {
                    Location: uri
                    //add other headers here...
                })
                res.end()
            }
            // var uri = value['url'];
            // res.writeHead(302, {
            //   'Location': uri
            //   //add other headers here...
            // });
            // res.end();

            // console.log(uri);
        } catch (e) {
            res.send(e)
        }
        // res.send(value);
    } catch (e) {
        res.send(e)
    }
})

//seedr

//new seedr

app.get('/seedr/getfolders', async function(req, res) {
    try {
        // const user = req.query.user
        // const pass = req.query.pass
        var hash = req.query.hash // $_GET["id"]
        if (!hash) {
            res.send('send hash lol')
        }
        //if (hash.includes('/') || hash.includes('+')) {\n     // res.send('send proper hash lol')\n   // }
        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        } else {
            user = 'mandalbis1729@gmail.com'
            pass = 'Bm782403'
        }

        var seedr = require('./seedr')
        // console.log(user,pass);
        var seedr = new seedr()
        await seedr.login(user, pass)

        try {
            var value = await seedr.getFolders()
            res.send(value['folders'])
        } catch (e) {
            res.send(e)
        }
    } catch (e) {
        res.send(e)
    }
})

app.get('/seedr/getband', async function(req, res) {
    try {
        // const user = req.query.user
        // const pass = req.query.pass
        var hash = req.query.hash // $_GET["id"]
        if (!hash) {
            res.send('send hash lol')
        }
        //if (hash.includes('/') || hash.includes('+')) {\n     // res.send('send proper hash lol')\n   // }
        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        } else {
            user = 'mandalbis1729@gmail.com'
            pass = 'Bm782403'
        }

        var seedr = require('./seedr')
        // console.log(user,pass);
        var seedr = new seedr()
        await seedr.login(user, pass)

        try {
            var value = await seedr.getBandwidth()
            res.send(value)
        } catch (e) {
            res.send(e)
        }
    } catch (e) {
        res.send(e)
    }
})

app.get('/seedr/deletefile', async function(req, res) {
    try {
        // const user = req.query.user
        // const pass = req.query.pass
        var hash = req.query.hash // $_GET["id"]
        var id = req.query.id // $_GET["id"]
        if (!hash) {
            res.send('send hash lol')
        }
        //if (hash.includes('/') || hash.includes('+')) {\n     // res.send('send proper hash lol')\n   // }
        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        } else {
            user = 'mandalbis1729@gmail.com'
            pass = 'Bm782403'
        }

        var seedr = require('./seedr')
        // console.log(user,pass);
        var seedr = new seedr()
        await seedr.login(user, pass)

        try {
            var value = await seedr.deleteFile(id)
            res.send(value)
        } catch (e) {
            res.send(e)
        }
    } catch (e) {
        res.send(e)
    }
})

app.get('/seedr/search', async function(req, res) {
    try {
        // const user = req.query.user
        // const pass = req.query.pass
        var hash = req.query.hash // $_GET["id"]
        var query = req.query.query // $_GET["id"]
        if (!hash) {
            res.send('send hash lol')
        }
        //if (hash.includes('/') || hash.includes('+')) {\n     // res.send('send proper hash lol')\n   // }
        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        } else {
            user = 'mandalbis1729@gmail.com'
            pass = 'Bm782403'
        }

        var seedr = require('./seedr')
        // console.log(user,pass);
        var seedr = new seedr()
        await seedr.login(user, pass)

        try {
            var value = await seedr.search(query)
            res.send(value)
        } catch (e) {
            res.send(e)
        }
    } catch (e) {
        res.send(e)
    }
})

app.get('/seedr/getinside', async function(req, res) {
    try {
        // const user = req.query.user
        // const pass = req.query.pass
        var hash = req.query.hash // $_GET["id"]
        var id = req.query.id // $_GET["id"]
        if (!hash) {
            res.send('send hash lol')
        }
        //if (hash.includes('/') || hash.includes('+')) {\n     // res.send('send proper hash lol')\n   // }
        var objDec = encryptor.decrypt(hash)
        if (objDec['user'] && objDec['pass']) {
            var user = objDec['user']
            var pass = objDec['pass']
        } else {
            user = 'mandalbis1729@gmail.com'
            pass = 'Bm782403'
        }

        var seedr = require('./seedr')
        // console.log(user,pass);
        var seedr = new seedr()
        await seedr.login(user, pass)

        try {
            var value = await seedr.getFilesofFolders(id)
            res.send(value)
        } catch (e) {
            res.send(e)
        }
    } catch (e) {
        res.send(e)
    }
})

//new seedr

app.get('/video', function(req, res) {
    const path = 'assets/sample.mp4'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

        if (start >= fileSize) {
            res
                .status(416)
                .send('Requested range not satisfiable\n' + start + ' >= ' + fileSize)
            return
        }

        const chunksize = end - start + 1
        const file = fs.createReadStream(path, {
            start,
            end
        })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        }

        res.writeHead(206, head)
        file.pipe(res)
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
})




app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));



module.exports = app;
module.exports.handler = serverless(app);
