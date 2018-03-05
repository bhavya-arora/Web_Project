console.log(location.pathname);

setInterval(moveRight, 5000);
var picarray = ['night_programmer_4am.jpg', '70d6b3aaf2857dce05601505b8ca7db0.jpg', 'WLSrYmy.jpg', 'html-programming.jpg', 'learn-to-code-what-is-programming-1.jpg'];
var counter = 0;

function moveRight() {
  var pic = document.getElementById('pic');
  pic.setAttribute("style", "display:block; position:absolute; background: url(" + picarray[counter] + ") no-repeat center center fixed; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover; width:1350px; ");
  counter++;
  if (counter == 5) {
    counter = 0;
  }
}

checklogin = function() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      console.log('under Done');
      if (request.status === 200) {
        console.log('success');
        dologout(request.responseText);
        document.getElementById('firstlogin').innerHTML = '';

      } else if (request.status === 400) {
        var search = document.getElementById('search');
        search.innerHTML = '<a href="/loginpage">LOGIN | REGISTER</a>';
        hidearticlebutton();
        document.getElementById('firstlogin').innerHTML = 'Login First to Write Article';
      } else {
        console.log('under else main1.js');
        hidearticlebutton();
      }
    }

  };
  request.open('GET', 'https://morning-meadow-19117.herokuapp.com/check-login', true);
  request.send(null);

};

checklogin();
articleInfo();

function hidearticlebutton() {
  var creatediv = document.getElementById('creatediv');
  creatediv.innerHTML = 'LOGIN FIRRST';
}


var submitBtnArticle = document.getElementById('submitBtnArticle');
submitBtnArticle.onclick = function() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      console.log('under Done');
      if (request.status === 200) {
        submitBtnArticle.value = 'CREATED';
        document.getElementById('createarticleresponse').innerHTML = 'ARTICLE CREATED';
      } else if (request.status === 400) {
        document.getElementById('createarticleresponse').innerHTML = 'Article Created';
      } else {
        document.getElementById('createarticleresponse').innerHTML = 'Something Wrong';
      }
    }

  };
  var username = document.getElementById('articleusername').value;
  var title = document.getElementById('articletitle').value;
  var heading = document.getElementById('articleheading').value;
  var content = document.getElementById('articlecontent').value;
  if (username.length <= 4) {
    document.getElementById('createarticleresponse').innerHTML = 'Username should greater than 5';
    throw new Error("Something went badly wrong!");
  } else {
    if (title.length <= 4) {
      document.getElementById('createarticleresponse').innerHTML = 'Title should greater than 5';
      throw new Error("Something went badly wrong!");
    } else {
      if (heading.length <= 4) {
        document.getElementById('createarticleresponse').innerHTML = 'heading should greater than 5';
        throw new Error("Something went badly wrong!");
      } else {
        if (content.length <= 30) {
          document.getElementById('createarticleresponse').innerHTML = 'Content should greater than 30';
          throw new Error("Something went badly wrong!");
        } else {
          document.getElementById('createarticleresponse').innerHTML = '';
          username = document.getElementById('articleusername').value;
          title = document.getElementById('articletitle').value;
          heading = document.getElementById('articleheading').value;
          content = document.getElementById('articlecontent').value;
        }
      }
    }
  }

  request.open('POST', 'https://morning-meadow-19117.herokuapp.com/createarticle', true);
  request.setRequestHeader('Content-Type', 'application/json');
  console.log('after post');
  request.send(JSON.stringify({
    username: username,
    title: title,
    heading: heading,
    content: content
  }));
}

function hello(articleId) {
  var articleId = articleId;
  console.log('Under hello function');
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        var comments = request.responseText;
        console.log('JSON TEST COMMENTS ' + comments);
      }
    }
  };
  request.open('POST', 'https://morning-meadow-19117.herokuapp.com/comments', true);
  request.setRequestHeader('Content-Type', 'application/json');
  console.log('after post');
  request.send(JSON.stringify({
    articleId: articleId
  }));
}



function articleInfo() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        var names = request.responseText;
        console.log('JSON TEST ' + names);
        blog(names);
      }
    }
  };
  request.open('GET', 'https://morning-meadow-19117.herokuapp.com/articleInfo', true);
  request.send(null);
};

function blog(names) {
  console.log(names);
  console.log(names.length);
  var list = '';
  ////Response text is now JSON string

  names = JSON.parse(names);
  console.log(names.length);
  console.log(names);
  console.log(JSON.stringify(names[0]));
  var i = names.length - 1;
  for (i; i >= 0; i--) {
    list += '<a href= /articles/' + names[i].id + ' onclick = hello(' + names[i].id + ') ' + '>' + '<li class= "w3-panel w3-round-xxlarge w3-teal" style="padding-top:25px; padding-left:30px; ">' + names[i].heading + '&nbsp &nbsp &nbsp &nbsp &nbsp ' + '~~by ' + names[i].username + '</li>' + '</a>';
  }
  var ul = document.getElementById('blogList');
  ul.innerHTML = list;
  ul.onclick = function(event) {
    var target = getEventTarget(event);
    var heading = extractList(target.innerHTML);
    fetchArticle(heading);
  };
}



/*function extractList(target){
var heading = target.split('&');
 heading = heading[0];
return heading;
}

function getEventTarget(e) {
        e = e || window.event;
        return e.target || e.srcElement;
    }

function fetchArticle(heading){
  var request =new XMLHttpRequest();
	request.onreadystatechange=function(){
		if(request.readyState===XMLHttpRequest.DONE){
			if(request.status===200){
				send('<html><body>hello</body></html>');
			}
		}
	};
	request.open('GET','https://morning-meadow-19117.herokuapp.com/articles/'+heading,true);
	request.send(null);
}*/


function dologout(responseText) {
  var search = document.getElementById('search');
  search.innerHTML = 'Hello ' + responseText + '<input type="submit" value="Logout" id="logout" style= "width: 60px; height: 30px; background-color: #303030; margin-bottom 10px; color: white; padding: 0;"/>';
  var logout = document.getElementById('logout');
  logout.onclick = function() {
    checklogout();
  }
};


function checklogout() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        checklogin();
      }
    }
  };
  request.open('GET', 'https://morning-meadow-19117.herokuapp.com/logout', true);
  request.send(null);
};


/*function loadPage(href)
            {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", href, false);
                xmlhttp.send();
                return xmlhttp.responseText;
            }*/
