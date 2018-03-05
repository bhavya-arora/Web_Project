var pwShown = 0;

console.log('this is hid show button');

document.getElementById("hideShowButton").addEventListener("click", function() {
  if (pwShown == 0) {
    pwShown = 1;
    show();
  } else {
    pwShown = 0;
    hide();
  }
}, false);

var hideShowImage = document.getElementById('hideShowButton');

function show() {
  var p = document.getElementById('password');
  p.setAttribute('type', 'text');
  hideShowButton.innerHTML = '<img id="hideShowImage" style="height:30px; width:40px; margin-left:-5px;" src="show_hide_password-10-256.png" alt="eye"/>';
}

function hide() {
  var p = document.getElementById('password');
  p.setAttribute('type', 'password');
  hideShowButton.innerHTML = '<img id="hideShowImage" style="height:30px; width:40px; margin-left:-5px;" src="show_hide_password-07-256.png" alt="eye"/>';
}
