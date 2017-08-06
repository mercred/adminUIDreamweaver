// JavaScript Document
function getParameter(url,name){
		var pattern=  RegExp(name+'=([^&]+)', 'i')
		var captured = pattern.exec(url)[1];
    //var captured = /category=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
    var result = captured ? captured : 'notFound';
			return result;
			
		}
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
function loginAfterInit(){
			var email = "studymechanicsapp@gmail.com";
		  var password= "vUvUh6Ph8h+d";			
		  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  console.log(errorMessage);			  
			});	
	}