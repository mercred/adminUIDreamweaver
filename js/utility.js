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