// JavaScript Document
	
var config = {
      apiKey: "AIzaSyCwYIYau4w3LKZ4EuKZPdBIfbdmg1JsWvQ", 	   
      databaseURL: "https://studymechanics.firebaseio.com",
	storageBucket: "studymechanics.appspot.com"
  };



firebase.initializeApp(config);
firebase.storage().ref().constructor.prototype.putFiles = function(files,reference) 
		{ 
		  var ref = this;
		  const filesArr = [...files];
		  return Promise.all(filesArr.map(function(file) {
			var id=uniqueID();	
			initialName=file.name.substring(0, file.name.length - 4);

			var name=returnImageName(Object.keys(bgImageList),initialName);		
			firebase.database().ref(reference).child(name).set(id);	 
			return ref.child(id).put(file);
		  }));
}	 
  




var categoriesList;
var currentCategory,currentCategoryBGText;
var bgImageList;


	
function showPopup() {
    $("#mask").fadeTo(500, 0.25);
    $("#popup").show();
}
function hidePopup(){
	$("#popup").hide();
    $("#mask").hide();
	
}
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
function loadCategories(){  
  categoriesList=[];
  var result_list = document.getElementById("categories_list");
  while (result_list.firstChild) {
      result_list.removeChild(result_list.firstChild);
 }		
  document.getElementById("mainContainer").style.visibility="hidden";	
  document.getElementById("imagesContainer").style.visibility="hidden";
  var queryCategories =  firebase.database().ref("Categories").orderByKey();   
  queryCategories.once("value").then(
    function(snapshot) {	    
    	snapshot.forEach(function(childSnapshot) {		      
          var key = childSnapshot.key;
		  categoriesList.push(key);
		  addCategoryToList(key);		 
        });	 
	    
    });
}	
function addCategoryToList(categoryName){
	var entry = document.createElement('li');	
	//entry.setAttribute("id",key+inner_key);
	entry.addEventListener('click', (function(category) {
			return function() {
					getCategoryData(category);
				}
		})(categoryName));						

	var a = document.createElement('a');  						 
	a.appendChild(document.createTextNode(categoryName));	
	a.href = "javascript:;";							
	entry.appendChild(a);	
	document.getElementById("categories_list").appendChild(entry);	
}
function createEmptyCategory(){
  var categoryName = document.getElementById("categoryName").value;
  document.getElementById("categoryName").value=null;
  if(categoriesList.contains(categoryName)){
  	alert("Category with this name already exists!");  
  }else{
  		if(categoryName==null|| categoryName==""){
		alert("You must assign a name");		
		}
		else{
  	  createEmptyCategoryDB(categoryName);
	  loadCategories();
	   }  	    	  
  }
}
function createEmptyCategoryDB(categoryName) {
  firebase.database().ref('Categories').child(categoryName).set(0);
  firebase.database().ref('questions').child(categoryName).set({
  material:"Empty",
  questions:"Empty"  
  });
}
function deleteCurrentCategory(){
 
  firebase.database().ref('Categories').child(currentCategory).set(null);
  firebase.database().ref('questions').child(currentCategory).set(null);
  currentCategory=null;
  loadCategories();
}
function getCategoryData(category){
	currentCategory= category;
	document.getElementById('name').innerHTML=currentCategory;
	getCategoryNQuestions();
	getCategoryBackgroundMaterialDB();		
	getListOfBGImagesAndDisplayDB(); 
	document.getElementById("mainContainer").style.visibility="visible";	
    document.getElementById("imagesContainer").style.visibility="visible";
	document.getElementById("bgImageId").src="images/ImgResponsive_Placeholder.png";
 
}
	
function getCategoryNQuestions(){
	//display number of questions
	var getCategoryQuestionCount=firebase.database().ref('Categories').child(currentCategory);
	getCategoryQuestionCount.once("value").then(
      function(snapshot) {
  		 document.getElementById("nQuestions").value=snapshot.val();
      });
	
}	
function getCategoryBackgroundMaterialDB(){
  
  var getCategoryBackgroundMaterial =  firebase.database().ref("questions/"+currentCategory+"/material/text");  
    getCategoryBackgroundMaterial.once("value").then(
      function(snapshot) {  	    
  	     currentCategoryBGText = snapshot.val();			  
  		 document.getElementById("textarea").value=currentCategoryBGText;		 
      });	  		 
}	 

function saveBMChanges(){
 var bmText = document.getElementById("textarea").value;
 updateCategoryMaterialDB(currentCategory,bmText);
 currentCategoryBGText=bmText; 
}
function discardBMChanges(){
document.getElementById("textarea").value=currentCategoryBGText;
}
function updateCategoryMaterialDB(categoryName,material){
  firebase.database().ref('questions').child(categoryName).child('material').child('text').set(material);  
}		
var currentImageKey;
function getListOfBGImagesAndDisplayDB(){
var allImagesQuery= firebase.database().ref("questions/"+currentCategory+"/material/imgs");
allImagesQuery.once("value").then(
      function(snapshot) {
	  currentImageKey=null;
	  var html_list = document.getElementById("bg_images_list");
      while (html_list.firstChild) {
        html_list.removeChild(html_list.firstChild);
      }	
	  html_list.src="images/ImgResponsive_Placeholder.png";	  
      bgImageList={};
      snapshot.forEach(function(childSnapshot) {  
		  var valueBGImage=childSnapshot.val();
          bgImageList[childSnapshot.key]=valueBGImage;
		  var entry = document.createElement('li');		
	entry.addEventListener('click', (function(imageVal) {
			return function() {
					displayImageBG(imageVal);
				}
		})(childSnapshot.key));
	var a = document.createElement('a');  						 
	a.appendChild(document.createTextNode(childSnapshot.key));	
	a.href = "javascript:;";							
	entry.appendChild(a);	
	html_list.appendChild(entry);
		  });
	hidePopup();
       }
  ).catch(function(error) {
   alert("Request to image list for background material failed with following error: "+error);
});  	
}		
function displayImageBG(imageVal){		
	downloadAndDisplayImage(imageVal,"bgImageId");		
}	

	var uploadLock=false;
//downloads image with name ImageStorageName and loads into img with id ImageHTML
function downloadAndDisplayImage(ImageName,ImageHTML){
	
	     var ImageStorageName=bgImageList[ImageName];
		 var imageRef = firebase.storage().ref(ImageStorageName).getDownloadURL().then(function(url) {         
    		 // url is the download URL for our image
		   var img = document.getElementById(ImageHTML);
           img.src = url;
		   currentImageKey=ImageName;
			 
  		 }).catch(function(error) {
              alert("During downloading of background material images following error occured: "+error);
           });
}
function uploadImagesBG(files){

 for(var i=0; i<files.length;i++){
  		  var file = files[i];		  
		  if(file.type!="image/png"){
    		  alert("File "+ file +" is not png!");
    		  return;
		  }  
  }    
  uploadFilesDB(files,"questions/"+currentCategory+"/material/imgs");
}
function uploadFilesDB(files,reference){
	
	
 showPopup();

 firebase.storage().ref().putFiles(files,reference).then(function(metadatas) { 
 	  	
      getListOfBGImagesAndDisplayDB();	
  }).catch(function(error) {
    // If any task fails, handle this
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

	
function deleteCurrentImageBG(){
  if(currentImageKey==null||currentImageKey==''){alert("Please select image from the list below.");return;}
  var desertRef = firebase.storage().ref(bgImageList[currentImageKey]);

      // Delete the file
      desertRef.delete().then(function() {
        firebase.database().ref('questions').child(currentCategory).child("material").child("imgs").child(currentImageKey).set(null);
		document.getElementById("bgImageId").src="images/ImgResponsive_Placeholder.png";
		currentImageKey=null;
		getListOfBGImagesAndDisplayDB();		
      }).catch(function(error) {
        alert("Error occured during file deletion: "+ error);
      });  
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
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

