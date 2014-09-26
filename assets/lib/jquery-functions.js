

$(document).ready(function(){

	$.fn.outerHTML = function() {
	    return jQuery('<div />').append(this.eq(0).clone()).html();
	};

	$("body").delegate(".taa", "keydown", function(e){
        alert("Test");
        //code logic goes here
        //if(e.which == 13){
        //Enter key down    
	});

});
