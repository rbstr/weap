function validate(){

var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
if ( username == "filip.rubes" && password == "WEAPisthebest"){
alert ("Login successfully");
window.location = "index2.html";
return false;
  }
}
