var contactButton = document.getElementById('contactButton');
contactButton.onclick = function() {
  console.log("Contact button clicked");
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        contactButton.value = "THANKS";
        document.getElementById('contactName').value = '';
        document.getElementById('contactContact').value = '';
        document.getElementById('contactMessage').value = '';
      } else {

      }

    }

  };
  var name = document.getElementById('contactName').value;
  var contact = document.getElementById('contactContact').value;
  var message = document.getElementById('contactMessage').value;
  if (name.length === 0) {
    document.getElementById('contactButton').value = 'Error';
    document.getElementById('contactName').value = 'Can\'t be Empty';
    throw new Error("Something went badly wrong!");
  } else {
    if (contact.length === 0) {
      document.getElementById('contactButton').value = 'Error';
      document.getElementById('contactContact').value = 'Can\'t be Empty';
      throw new Error("Something went badly wrong!");
    } else {
      if (message.length === 0) {
        document.getElementById('contactButton').value = 'Error';
        document.getElementById('contactMessage').value = 'Can\'t be Empty';
        throw new Error("Something went badly wrong!");
      } else {
        var name = document.getElementById('contactName').value;
        var contact = document.getElementById('contactContact').value;
        var message = document.getElementById('contactMessage').value;
      }
    }
  }
  request.open('POST', 'https://morning-meadow-19117.herokuapp.com/sendMessage', true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify({
    name: name,
    contact: contact,
    message: message
  }));

};

var vella = document.getElementById('vella');
vella.onclick = function() {
  var txt;
  var person = prompt("Please enter your Email Id", "yourEmail@you.com");
  if (person == null || person == "") {
    txt = "User cancelled the prompt.";
  } else {
    txt = "Hello " + person + "! How are you today?";
    subscribeList(person);
  }
}

function subscribeList(person) {
  var person = person;
  console.log('under subscriber lst');
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        alert('Subscriber ' + person + ' Added');
      }
    }
  };
  request.open('POST', 'https://morning-meadow-19117.herokuapp.com/subscribe', true);
  request.setRequestHeader('Content-Type', 'application/json');
  console.log('after post');
  request.send(JSON.stringify({
    subscriber: person
  }));

}
