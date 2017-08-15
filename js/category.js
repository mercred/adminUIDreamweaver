// JavaScript Document

var categories,images;
var currentCategory,currentCategoryBGText,currentImageID;


//____________________________________DISPLAY LIST OF CATEGORIES_______________________
function loadCategories(){  
	var elemTopCoord =  document.getElementById("textarea").getBoundingClientRect().top;	
	var totalOffset=parent.maxIFrameHeight-elemTopCoord-50;
	$('#textarea').css('max-height',totalOffset);
  categories=[];
  cleanElement("categories_list");  	
  document.getElementById("mainContainer").style.visibility="hidden";	
  document.getElementById("imagesContainer").style.visibility="hidden";
  var queryCategories =  firebase.database().ref("Categories"+parent.languageRef).orderByKey();   
  queryCategories.once("value").then(
    function(snapshot) {	    
    	snapshot.forEach(function(childSnapshot) {		      
          var key = childSnapshot.key;
		  categories.push(key);
		  addCategoryToList(key);
        });	 
		
		
		var listTopCoord =  document.getElementById("categories_list").getBoundingClientRect().top;				
		var totalOffset=parent.maxIFrameHeight-listTopCoord;
		$('#categories_list').css('max-height',totalOffset);		
	   
    });
	
	
	
}	
function addCategoryToList(categoryName){
	var entry = document.createElement('li');		
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
//________________________________________END OF DISPLAY LIST OF CATEGORIES_____________


//____________________________________OPERATIONS ON CATEGORY___________________________
function createEmptyCategory(){
  var categoryName = document.getElementById("categoryName").value;
  document.getElementById("categoryName").value=null;
  if(categories.contains(categoryName)){
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
  firebase.database().ref('Categories'+parent.languageRef).child(categoryName).set(0);
  firebase.database().ref('questions'+parent.languageRef).child(categoryName).set({
  material:"Empty",
  questions:"Empty"  
  });
}
function deleteCurrentCategory(){
 var getCategory =  firebase.database().ref("questions"+parent.languageRef).child(currentCategory).orderByKey();   
  getCategory.once("value").then(
    function(snapshot) {	
		//we have questions
		var listOfImagesToDelete=[];
		if(snapshot.hasChild("questions")){
			var questions=snapshot.val().questions;			
			for (var question in questions) {
			  if (questions.hasOwnProperty(question)) {				  
				//delete question images
				
				if(questions[question].hasOwnProperty('img')&&questions[question].img!=""){
					listOfImagesToDelete.push(questions[question].img);
				}
				//delete answer option images
				if(questions[question].hasOwnProperty('answers')&&questions[question].answers!=""&&questions[question].answers!=undefined&&questions[question].answers!=null){
					var qAnswers=questions[question].answers;					
					
					for (var key in qAnswers) {
						if (qAnswers.hasOwnProperty(key)&&qAnswers[key].hasOwnProperty('img')&&qAnswers[key].img!="") {					
							
							listOfImagesToDelete.push(qAnswers[key].img);
						}						
					}
				}	
			  }
			}
		}
		
		for (var i=0;i<listOfImagesToDelete.length;i++) {			
			firebase.storage().ref(listOfImagesToDelete[i]).delete();			
	   }
		//delete images of bgMaterial
	  if (typeof images != "undefined")
	 {
	   for (var key in images) {
			if (images.hasOwnProperty(key)) {
				 firebase.storage().ref(images[key]).delete();
			}
	   }
	 }
	//delete images of all questions/answerOptions
	//delete category at last
	firebase.database().ref('Categories'+parent.languageRef).child(currentCategory).set(null);
  firebase.database().ref('questions'+parent.languageRef).child(currentCategory).set(null);
  currentCategory=null;
	
  loadCategories();
		
		
		
		
		
		
		
		
		
    });
	
}
function getCategoryData(category){
	currentCategory= category;
	
	document.getElementById("displayQuestionsButton").addEventListener('click', (function(category) {
							 	return function() {									window.parent.document.getElementById('contentIframeID').src="categoryQuestions.html#category="+category; 
										
									}
						 	})(category));	
	document.getElementById('name').innerHTML=currentCategory;
	getCategoryNQuestions();
	getCategoryBackgroundMaterialDB();	
	getListOfBGImagesAndDisplayDB();	
	document.getElementById("mainContainer").style.visibility="visible";	
    document.getElementById("imagesContainer").style.visibility="visible";
	document.getElementById("bgImageId").src="images/ImgResponsive_Placeholder.png";
 
}
//________________________________________END OF OPERATIONS ON CATEGORY___________________

//display number of questions	
function getCategoryNQuestions(){
	var getCategoryQuestionCount=firebase.database().ref('Categories'+parent.languageRef).child(currentCategory);
	getCategoryQuestionCount.on("value", function(snapshot) {		 
  		 document.getElementById("nQuestions").innerHTML="Number of questions: "+snapshot.val();
      });
	
}	

//_______________________________________BACKGROUND MATERIAL TEXT__________________________
function getCategoryBackgroundMaterialDB(){
  
  var getCategoryBackgroundMaterial =  firebase.database().ref("questions"+parent.languageRef+'/'+currentCategory+"/material/text");  
    getCategoryBackgroundMaterial.on("value",function(snapshot) {  	    
  	     currentCategoryBGText = snapshot.val();			  
  		 document.getElementById("textarea").value=currentCategoryBGText;	
		autosize(document.getElementById("textarea"));
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
  firebase.database().ref('questions'+parent.languageRef).child(categoryName).child('material').child('text').set(material);  
}		
//____________________________________________________END OF BACKGROUND MATERIAL TEXT______

//_______________________________________OPERATIONS WITH IMAGES__________________________
function getListOfBGImagesAndDisplayDB(){
var allImagesQuery= firebase.database().ref("questions"+parent.languageRef+'/'+currentCategory+"/material/imgs");
allImagesQuery.once("value").then(
      function(snapshot) {
	  currentImageID=null;
		  var html_list=document.getElementById("bg_images_list");
	  cleanElement("bg_images_list");
	  html_list.src="images/ImgResponsive_Placeholder.png";	  
      images={};
      snapshot.forEach(function(childSnapshot) {  
		  var valueBGImage=childSnapshot.val();
          images[childSnapshot.key]=valueBGImage;
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
function uploadImagesBG(files){

 for(var i=0; i<files.length;i++){
  		  var file = files[i];
	 console.log(file);
		  if(file.type!="image/png"){
    		  alert("File "+ file +" is not png!");
    		  return;
		  }  
  }    
  uploadFilesDB(files,"questions"+parent.languageRef+'/'+currentCategory+"/material/imgs");
}
function uploadFilesDB(files,reference){
		
	 showPopup();
	 firebase.storage().ref().putFiles(files,reference).then(function(metadatas) { 
		  getListOfBGImagesAndDisplayDB();	
	  }).catch(function(error) {
		// If any task fails, handle this
	  });
}
function deleteCurrentImageBG(){
  if(currentImageID==null||currentImageID==''){alert("Please select image from the list below.");return;}
  var desertRef = firebase.storage().ref(images[currentImageID]);

      // Delete the file
      desertRef.delete().then(function() {
        firebase.database().ref('questions'+parent.languageRef).child(currentCategory).child("material").child("imgs").child(currentImageID).set(null);
		document.getElementById("bgImageId").src="images/ImgResponsive_Placeholder.png";
		getListOfBGImagesAndDisplayDB();		
      }).catch(function(error) {
        alert("Error occured during file deletion: "+ error);
      });  
}
//____________________________________________________OPERATIONS WITH IMAGES_END______________

//____________________________________________________PREVIEW WINDOW__________________________
function showPreview(){	
	
	var contentElem=window.parent.document.getElementById('modalContent');	
	while (contentElem.firstChild) {
      contentElem.removeChild(contentElem.firstChild);
    }	
	parseComplexText(currentCategoryBGText);
	console.log(window.parent.document.getElementById('modalContent'));
	window.parent.$('#modalButton').click();	
}	  
function parseComplexText(text){
	    if(text==null) return;
		var res;
		var pattern =new RegExp("img\\d+.*");
		var mainString="";
	    var splitString=text.split(" ");
		for (i = 0; i < splitString.length; i++) {
			res=pattern.exec(splitString[i]);
			if(res!=null&&res!=undefined){
				//add div with current text
				if(mainString!=""&&mainString!=null){
					insertText(mainString);					
					mainString="";
				}
				//insert image	
				var imgName=images[splitString[i]];				
				//get URL from name				
				insertImage(imgName );
				}else{
					mainString+=" "+splitString[i];
				}		
		}
		if(mainString!=""&&mainString!=null){
			
			insertText(mainString);
		}
	renderMathInElement(
          window.parent.document.getElementById('modalContent'),
          {
              delimiters: [
                  {left: "$$", right: "$$", display: true}, 
                  {left: "\\(", right: "\\)", display: false}
              ]
          }
      );
				
	}
function insertText(text){
		var rowDiv = document.createElement("div");
		rowDiv.className="row";
		var colDiv=document.createElement("div");
		colDiv.className="col-lg-12";
		colDiv.innerHTML=text;		
		rowDiv.appendChild(colDiv);	
	    var contentElem=window.parent.document.getElementById('modalContent');
		contentElem.appendChild(rowDiv);		
	}
function insertImage(imageURL){
		var rowDiv = document.createElement("div");
		rowDiv.className="row";
		var colDiv=document.createElement("div");
		rowDiv.className="col-lg-12";
		
		var image = document.createElement("img");
		image.id=imageURL+"render";
		image.className="img-responsive";
		image.alt="Placeholder image";		
		colDiv.appendChild(image);	
		rowDiv.appendChild(colDiv);	
	    var contentElem=window.parent.document.getElementById('modalContent');
		contentElem.appendChild(rowDiv);
		downloadAndDisplayImageModal(imageURL,image.id)
		
	}
function downloadAndDisplayImageModal(ImageName,ImageHTML){	
	     
	     if(typeof ImageName=='undefined'||ImageName==""){
			 //no such file exists
			 return;
		 }	
	 
	firebase.storage().ref(ImageName).getDownloadURL().then(function(url) {         
    		 window.parent.document.getElementById(ImageHTML).src = url;
		  		 
  		 }).catch(function(error) {
			 console.log(error);
             
           });
}
//end of preview window
