var firebaseRef;	
var languageRef;
var maxIFrameHeight;

function initializeApp(){
	
		languageRef="";
	var name="Login";
	
	
	
	
	
	
	    document.getElementById("selectId").onchange = function() {
			
			if(this.value=="English") {
			   languageRef="";
				document.getElementById("contentIframeID").src="";
			   }
			   else{
			   	languageRef="-de";
				   document.getElementById("contentIframeID").src="";
			   }
			console.log(languageRef);
			
		};
		iFrameResize({log:false});
			var config = {
			  apiKey: "AIzaSyCwYIYau4w3LKZ4EuKZPdBIfbdmg1JsWvQ", 	   
			  databaseURL: "https://studymechanics.firebaseio.com",
			  storageBucket: "studymechanics.appspot.com",
			  authDomain: "studymechanics.firebaseapp.com",
		  };
		  firebaseRef=firebase.initializeApp(config);				
		  
			//changes when we either logIn or logOut
		  firebase.auth().onAuthStateChanged(function(user) {
			  if(user==null){
				  //we have been signed out				  
				  document.getElementById("loginMenuID").style.display="initial";
				  document.getElementById("loginMenuID").style.visibility="visible";//change both visibility and display because otherwise we can see login menu for a split second after change.
				   document.getElementById("mainMenuID").style.visibility="hidden";
				  parentHeight=0;
				  		
			  }
			  else{
				  
				  document.getElementById("userPassword").value="";
		           document.getElementById("userEmail").value="";				   
		           window.user = user;
				  languageRef="";
				  $("#selectId").val("English");
				   $("#currentUser").html("User: "+user.email);
				  document.getElementById("loginMenuID").style.display="none";				  
				  document.getElementById("mainMenuID").style.visibility="hidden";
				 document.getElementById("mainMenuID").style.visibility="visible";	
				   document.getElementById("contentIframeID").src="about:blank";
				 
				  
			  }
			 
		  });	
		}
		function Logout(){
			firebase.auth().signOut()
			 .catch(function (err) {
			   // Handle errors
			 });			

		}
	  function Login(){ 
		   $('#inputErrors').html("");
		  var password=document.getElementById("userPassword").value;		  
		  var email= document.getElementById("userEmail").value;
		  
		  var passwordValidation = validate.single(password, {presence: true});
		  
		  var emailValidation = validate.single(email, {presence: true, email: true});
		 if(emailValidation!=undefined){			
			  $('#inputErrors').html("Email "+emailValidation[0]);
			   return;
		  }  
		  if(passwordValidation!=undefined){
			  $('#inputErrors').html("Password "+passwordValidation[0]);
			  password="";
			  return;
		  }
		  
		  
		  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {			  
			    $('#inputErrors').html(error.message);			  
			});		  
	  }
	  function onCategoryClick(){
		   document.getElementById("contentIframeID").src="category.html";	
		   document.getElementById("contentIframeID").style.display="block";
		  getMaxHeight();
		  
	  }
	  function onQuestionClick(){
		  
		   document.getElementById("contentIframeID").src="questionSearch.html";
		  document.getElementById("contentIframeID").style.display="block";
		  getMaxHeight();
		  
		  
	  }	
function getMaxHeight(){
	var  viewportHeight= Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	var elemCoord =  document.getElementById("contentIframeID").getBoundingClientRect().top;	
	maxIFrameHeight=viewportHeight-elemCoord-10;		
}


