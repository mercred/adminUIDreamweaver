// JavaScript Document
var selectedCategory, selectedQuestion;
function getQueryResults(){
			var dict = {};
			document.getElementById("result_text_div").style.visibility="hidden";
			var queryText = document.getElementById("search").value;
			if(queryText==null || queryText==""){
				alert("Enter search text!");
				return;
			}
			
			cleanElement("questions_list");
			var result_list = document.getElementById("questions_list");			
							
			var queryCategories =firebase.database().ref("questions").orderByKey();		
		    queryCategories.once("value").then(
			function(snapshot) {	
				console.log(snapshot.key);
				snapshot.forEach(function(childSnapshot) {		      
				 var questions_text={}
				 var key = childSnapshot.key;					
				 var value=childSnapshot.val().questions;				 
				 for (var inner_key in value){	
					 text=value[inner_key].text; 
					if( text&&text.indexOf(queryText) !== -1)
					{
						questions_text[inner_key]=text;
						var entry = document.createElement('li');	
						entry.setAttribute("id",key+inner_key);
						entry.addEventListener('click', (function(kkey, iinner_key,ttext) {
							 	return function() {
										displayQuestionText(kkey,iinner_key, ttext);
									}
						 	})(key,inner_key,text));						
						
						var a = document.createElement('a');  						 
						a.appendChild(document.createTextNode("Category:"+key+", question:"+inner_key));	
						a.href = "javascript:;";							
						entry.appendChild(a);	
						result_list.appendChild(entry);			
					
					}
				 }
					if(!isEmpty(questions_text)){
						dict[key]=questions_text;
						
					}					
				});	 				
				
			  //no match
			if(isEmpty(dict)){
				var entry = document.createElement('li');
				entry.appendChild(document.createTextNode("No match."));
				entry.setAttribute("id","noMatchNode");
				result_list.appendChild(entry);
			}	
			var mainList=document.getElementById("questions_list").style.visibility="visible";			
			});		//listener end					
		}//function getQueryResults() end 
	
		function displayQuestionText(category,question,text){
			
			document.getElementById("result_text_div").style.visibility="visible";			
			document.getElementById("result_text").innerHTML=text;
			var textHref="questionSearchResult.html#category="+category+"&question="+question;
			document.getElementById("displayQuestionButton").href=textHref;		
		}
	  
	  
	