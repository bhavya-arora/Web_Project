checklogin = function() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      console.log('under Done');
      if (request.status === 200) {
        console.log('success');
        dologout(request.responseText);
        loggedin(request.responseText);
      } else if (request.status === 400) {
        var search = document.getElementById('search');
        search.innerHTML = '<a href="/loginpage">LOGIN | REGISTER</a>';

      } else {
        console.log('Under else');
      }
    }

  };
  request.open('GET', 'https://morning-meadow-19117.herokuapp.com/check-login', true);
  request.send(null);

};



checklogin();

function htmlTemplate() {
  var loginForm = document.getElementById('loginForm');
  loginForm.innerHTML = `<input class = "inputBox" type="text" placeholder="username" id="username"/><br>
               <input class = "inputBox" type="password" id="password" placeholder="password"/><br>
               <input class = "loginBox" type="submit" value="Login" id="submit_btn" />
               <input class = "loginBox" type="submit" value="Register" id="submit_btnRe" />`;
};

function checklogout() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        htmlTemplate();
        checklogin();
      }
    }
  };
  request.open('GET', 'https://morning-meadow-19117.herokuapp.com/logout', true);
  request.send(null);
};

var registerButton = document.getElementById('submit_btnRe');
console.log(' register');
registerButton.onclick = function() {
  console.log('under blog');
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      console.log('under Done');
      if (request.status === 200) {
        console.log('success');
        registerButton.value = 'Registered';
      }
    }

  };
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var loginMessage = document.getElementById('loginmessage');
  loginMessage.innerHTML = '';
  if (username.length <= 4) {
    loginMessage.innerHTML = 'username should be greater than 5';
    throw new Error("Something went badly wrong!");
  } else {
    if (password.length <= 4) {
      loginMessage.innerHTML = 'Password should be greater than 5';
      throw new Error("Something went badly wrong!");
    } else {
      loginMessage.innerHTML = '';
      username = document.getElementById('username').value;
      console.log(username);
      password = document.getElementById('password').value;
      console.log(password);
    }
  }
  request.open('POST', 'https://morning-meadow-19117.herokuapp.com/create-user', true);
  request.setRequestHeader('Content-Type', 'application/json');
  console.log('after post');
  request.send(JSON.stringify({
    username: username,
    password: password
  }));

};


var loginButton = document.getElementById('submit_btn');
console.log(' login');
loginButton.onclick = function() {
  console.log('under login');
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      console.log('under Done');
      if (request.status === 200) {
        console.log('success');
        checklogin();

      } else {
        loginButton.value = 'Try Again';
      }

    }

  };
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  request.open('POST', 'https://morning-meadow-19117.herokuapp.com/login', true);
  request.setRequestHeader('Content-Type', 'application/json');
  console.log('after post');
  request.send(JSON.stringify({
    username: username,
    password: password
  }));

};





function dologout(responseText) {
  var search = document.getElementById('search');
  search.innerHTML = 'Hello ' + responseText + '<input type="submit" value="Logout" id="logout" style= "width: 60px; height: 30px; background-color: #303030; margin-bottom 10px; color: white; padding: 0;"/>';
  var logout = document.getElementById('logout');
  logout.onclick = function() {
    checklogout();
  }
}

function loggedin(responseText) {
  var loginForm = document.getElementById('loginForm');
  loginForm.innerHTML = `<div style="margin-top:130px; margin-left:130px; font-family: 'Oswald', sans-serif;
	font-weight:bold; ">You are Logged in as ${responseText}</div>`;
}
