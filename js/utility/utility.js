// JavaScript Document

function showPopup() {
    $("#mask").fadeTo(500, 0.25);
    $("#popup").show();
}
function hidePopup(){
	$("#popup").hide();
    $("#mask").hide();
	
}
function getParameter(url,name){
		var pattern=  RegExp(name+'=([^&]+)', 'i')
		var captured = pattern.exec(url)[1];
    //var captured = /category=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
    var result = captured ? captured : 'notFound';
			return result;
			
		}
function cleanElement(elementID){
	var result_list = document.getElementById(elementID);
    while (result_list.firstChild) {
      result_list.removeChild(result_list.firstChild);
 }	
	
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
firebase.storage().ref().constructor.prototype.putFiles = function(files,reference) 
		{ 
		  var ref = this;
		  const filesArr = [...files];
		  return Promise.all(filesArr.map(function(file) {
			var id=uniqueID();	
			  //remove all whitespaces
			  var solidName=file.name.replace(/\s+/, "");
			initialName=solidName.substring(0, solidName.length - 4);

			var name=returnImageName(Object.keys(images),initialName);		
			firebase.database().ref(reference).child(name).set(id);	 
			return ref.child(id).put(file);
		  }));
}	
