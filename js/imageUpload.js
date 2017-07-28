// JavaScript Document

//downloads image with name ImageStorageName and loads into img with id ImageHTML
function downloadAndDisplayImage(ImageName,ImageHTML){
	
	     var ImageStorageName=bgImageList[ImageName];
		 var imageRef = firebase.storage().ref(ImageStorageName).getDownloadURL().then(function(url) {         
    		 // url is the download URL for our image
		   var img = document.getElementById(ImageHTML);
           img.src = url;
		   currentImageKey=ImageName;
			 
  		 }).catch(function(error) {
              alert("During downloading images following error occured: "+error);
           });
}
function downloadAndDisplayImageDirectly(ImageName,ImageHTML){
	
	     var ImageStorageName=ImageName;
	     if(typeof ImageStorageName=='undefined'){
			 //no such file exists
			 return;			 
		 }	
		 firebase.storage().ref(ImageStorageName).getDownloadURL().then(function(url) {         
    		 // url is the download URL for our image
		   var img = document.getElementById(ImageHTML);
           img.src = url;
		   //currentImageKey=ImageName;
			 
  		 }).catch(function(error) {
              alert("During downloading images following error occured: "+error);
           });
}


function returnImageName(existingArray,name){
   var currentName;
   var counter=0;		 
   while(true){
       currentName="img"+counter+name;
       if(existingArray.contains(currentName)==false){
	   	    return currentName;       
       }
	   counter=counter+1; 
   }
}

function uniqueID(){
  function chr4(){
    return Math.random().toString(16).slice(-4);
  }
  return chr4() + chr4() +
    '-' + chr4() +
    '-' + chr4() +
    '-' + chr4() +
    '-' + chr4() + chr4() + chr4();
}