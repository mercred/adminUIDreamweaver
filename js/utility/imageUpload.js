// JavaScript Document

//downloads image with name ImageStorageName and loads into img with id ImageHTML
function downloadAndDisplayImage(ImageName,ImageHTML){
		if(typeof ImageName=='undefined'||ImageName==""){
			 //no such file exists
			 return;
		 }
	
	     var ImageStorageName=images[ImageName];
	
		 firebase.storage().ref(ImageStorageName).getDownloadURL().then(function(url) {         
    		 // url is the download URL for our image
		   var img = document.getElementById(ImageHTML);
           img.src = url;
		   currentImageID=ImageName;
			 
  		 }).catch(function(error) {
               console.log(error);
           });
}
function downloadAndDisplayImageDirectly(ImageName,ImageHTML){
	
	     
	     if(typeof ImageName=='undefined'||ImageName==""){
			 //no such file exists
			 return;
		 }	
	 
		 firebase.storage().ref(ImageName).getDownloadURL().then(function(url) {         
    		 document.getElementById(ImageHTML).src = url;
		  		 
  		 }).catch(function(error) {
			 console.log(error);
             
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

