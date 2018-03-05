var express = require('express');
var morgan = require('morgan');
var app = express();
var Pool = require('pg').Pool;
var path = require('path');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');

let ACCESS_TOKEN = "//FACEBOOK_ACCESS_TOKEN///";
let FACEBOOK_SEND_MESSAGE_URL = "https://graph.facebook.com/v2.6/me/messages?access_token=" + ACCESS_TOKEN;

var config = {
  user: '',
  database: '',
  host: '',
  port: '',
  password: ''
};

app.use(session({
  secret: 'someRandomSecretValue',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30
  }
}));
/*secret: 'secretRandom',
name: 'dbcookie', // connect-mongo session store
proxy: true,
resave: true,
saveUninitialized: true*/

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());

var pool = new Pool(config);
app.get('/dbtest', function(req, res) {
  pool.query('SELECT * FROM test', function(err, result) {
    if (err) {
      res.status(500).send(err.toString());

    } else {
      res.send(result.rows);
    }
  });
});

app.get('/dbarticle', function(req, res) {
  pool.query('SELECT * FROM article', function(err, result) {
    if (err) {
      res.status(500).send(err.toString());

    } else {
      res.send(result.rows);
    }
  });
});

app.get('/dbcomments', function(req, res) {
  pool.query('SELECT * FROM comments', function(err, result) {
    if (err) {
      res.status(500).send(err.toString());

    } else {
      res.send(result.rows);
    }
  });
});

app.get('/dbsubscriber', function(req, res) {
  pool.query('SELECT * FROM subscribe', function(err, result) {
    if (err) {
      res.status(500).send(err.toString());

    } else {
      res.send(result.rows);
    }
  });
});

//Comments system not completed yet//
/*function fetchComments(articleId){
  var thisstring = 'this is string';
  pool.query('SELECT username, comment FROM comments where articleid = $1',[articleId],function(err,result){
    var thisstring1 = 'this is other aring';
    console.log('this is comments '+JSON.stringify(result.rows));
    console.log('this is comments '+result.rows);
    console.log('this is comments '+toString(result.rows));
    console.log('this is comments '+JSON.stringify(result.rows[0]));
    var comments = JSON.stringify(result.rows[0]);
    var commentsList = JSON.parse(comments);
    console.log('this is comments '+commentsList);
    console.log('this is comments buddy '+commentsList.username);
      if(err){


      }else{
          for(var i=0; i<result.rows.length;i++){
            console.log('this is comments '+commentsList.username);
            console.log('this is comments '+commentsList.comment);
          }
      }
      thisstring = 'this is another another string';
  });

}*/

app.post('/comments', function(req, res) {
  var articleId = req.body.articleId;
  pool.query('SELECT username, comment FROM comments where articleid = $1 ', [articleId], function(err, result) {
    if (err) {
      res.status(500).send(err.toString());
    } else {
      if (result.rows.length === 0) {
        res.status(404).send('comment not found');
      } else {
        res.status(200).send(JSON.stringify(result.rows));
      }
    }
  });

});

var articleTemplate = function(data, articleId) {
  var title = data.title;
  var heading = data.heading;
  var content = data.content;
  var template = `<head>
        <title>
            ${title}
        </title>
        <meta name="viewport" content="width=device-width , initial-scale=1">
        <link rel="stylesheet" type="text/css" href="../articles.css"/>
        <link rel="stylesheet" type="text/css" href="../footer.css"/>
    </head>
    <body>
    <div id="topBar"><ul class=topBarUl>
  <li style="list-style:none;">
  <a href="../index.html"><img src="../address.png"/></a>
  </li>

<li style="list-style:none;">
  <a href="../blogpage"><img src="../4618-200.png"/></a>
  </li>


  </ul>
   <!--this is for search button-->
   <div id="search"><a href="/loginpage">LOGIN | REGISTER</a></div>

  </div>
        <div id=container>
            <h2 id=articleHeading>${heading}</h2>
            ${content}
        </div>
        <script type="text/javascript" src="../main1.js"></script>
    </body>`;
  return template;
};


var articleone = {
  title: 'article-one',
  heading: 'articleone',
  content: 'this is article one buddy'
}

app.get('/blogpage', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'blog', 'blog.html'));
});

app.get('/aboutpage', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'about', 'about.html'));
});

app.get('/contactpage', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'contact', 'contact.html'));
});

app.get('/loginpage', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'login', 'login.html'));
});

app.get('/createnewarticle', function(req, res) {
  if (req.session && req.session.auth && req.session.auth.userId) {
    // Load the user object
    pool.query('SELECT * FROM "test" WHERE id = $1', [req.session.auth.userId], function(err, result) {
      if (err) {
        res.status(500).send(err.toString());
      } else {
        res.sendFile(path.join(__dirname, 'views', 'pages', 'blog', 'createArt.html'));
      }
    });
  } else {
    res.status(400).send('You are not logged in');
  }
});

app.post('/createarticle', function(req, res) {
  var username = req.body.username;
  var title = req.body.title;
  var heading = req.body.heading;
  var content = req.body.content;
  pool.query('INSERT INTO article ("username","title","content","heading") VALUES ($1,$2,$3,$4)', [username, title, content, heading], function(err, result) {
    if (err) {
      res.status(500).send(err.toString());

    } else {

      res.status(200).send('Successfully created');

    }
  });
});

app.get('/articles/:articleName', function(req, res) {
  pool.query('SELECT * FROM article WHERE id = $1', [req.params.articleName], function(err, result) {
    var articleName = req.params.articleName;
    if (err) {
      res.status(500).send(err.toString());

    } else {
      if (result.rows.length === 0) {
        res.status(404).send('Article not found');
      } else {
        var articleData = result.rows[0];
        res.send(articleTemplate(articleData, articleName));
      }
    }
  });
});

app.get('/articleInfo', function(req, res) {
  pool.query('SELECT username, heading, id FROM "article" ', function(err, result) {
    if (err) {
      res.status(500).send(err.toString());
    } else {
      if (result.rows.length === 0) {
        res.status(404).send('Article not found');
      } else {
        res.send(JSON.stringify(result.rows));
      }
    }
  });
});

app.get('/get-articles', function(req, res) {
  // make a select request
  // return a response with the results
  pool.query('SELECT * FROM article ORDER BY id DESC', function(err, result) {
    if (err) {
      res.status(500).send(err.toString());
    } else {
      res.send(JSON.stringify(result.rows));
    }
  });
});

app.get('/articlePage', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'blog', 'article.html'));
});

app.post('/sendMessage', function(req, res) {
  var message = req.body.message;
  var name = req.body.name;
  var contact = req.body.contact;

  request({
    url: FACEBOOK_SEND_MESSAGE_URL,
    method: 'POST',
    json: {
      "recipient": {
        "id": '//fILl_IT//'
      },
      "message": {
        "text": "Hello, here \"" + name + "\" \r\n \r\n Message: \"" + message + "\" \r\n \r\n Contact: " + contact
      }
    }

  }, function(error, response, body) {
    if (error) {
      console.log('Error sending UIMESSAGE to User ' + JSON.stringify(error));
    } else if (response.body.error) {
      console.log('Error sending UImessage' + JSON.stringify(response.body.error));
    }
  });
  res.status(200).send();
});

app.post('/subscribe', function(req, res) {
  var subscriber = req.body.subscriber;
  console.log('this is subscriber ' + subscriber);
  pool.query('INSERT INTO subscribe ("subscriber") VALUES($1)', [subscriber], function(err, result) {
    if (err) {
      res.status(500).send(err.toString());
    } else {
      res.status(200).send("Subscriber created");
    }
  });
});

app.get('/check-login', function(req, res) {
  if (req.session && req.session.auth && req.session.auth.userId) {
    // Load the user object
    pool.query('SELECT * FROM "test" WHERE id = $1', [req.session.auth.userId], function(err, result) {
      if (err) {
        res.status(500).send(err.toString());
      } else {
        res.send(result.rows[0].username);
      }
    });
  } else {
    res.status(400).send('You are not logged in');
  }
});

app.get('/logout', function(req, res) {
  delete req.session.auth;
  res.send('You are logged out');
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'pages', 'index.html'));
});

app.get('/:fileName', function(req, res) {
  var fileName = req.params.fileName;
  res.sendFile(path.join(__dirname, 'views', 'pages', fileName));
});

function hash(input, salt) {
  var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
  return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');

}

///Sample example of hash function
app.get('/hash/:input', function(req, res) {
  var hashedString = hash(req.params.input, 'this-is-random-string');
  res.send(hashedString);
});

app.post('/create-user', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var salt = crypto.randomBytes(128).toString('hex');
  var dbString = hash(password, salt);
  console.log(req.body);
  pool.query('INSERT INTO "test" (username,password) VALUES ($1,$2)', [username, dbString], function(err, result) {
    if (err) {
      res.status(500).send(JSON.stringify({
        "error": "error"
      }));
    } else {
      res.status(200).send(JSON.stringify({
        "message": "User Created"
      }));
    }
  });
});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  pool.query('SELECT * FROM "test" WHERE username = $1', [username], function(err, result) {
    if (err) {
      res.status(500).send(JSON.stringify({
        "error": toString(err)
      }));
    } else {
      if (result.rows.length === 0) {
        res.status(403).send(JSON.stringify({
          "error": "Username/password invalid"
        }));
        console.log("Rows length is 0");
      } else {
        // Match the password
        var dbString = result.rows[0].password;
        var salt = dbString.split('$')[2];
        var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
        if (hashedPassword === dbString) {

          // Set the session
          // set cookie with a session id
          // internally, on the server side, it maps the session id to an object
          // { auth: {userId }}
          req.session.auth = {
            userId: result.rows[0].id
          };
          res.status(200).send(JSON.stringify({
            "message": "Credentials Correct"
          }));

        } else {
          res.status(403).send({
            "error": "Username/password invalid"
          });
        }
      }
    }
  });
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
