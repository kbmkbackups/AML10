

makeid = function() {  
	
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


savequery = function(panelid){

	var queryname = $('#name_' + panelid).val();
	var querycode = $('#cypherquery_' + panelid).val();

    var queryObj = {
      name: queryname,
      cypherquery: querycode
    }

    $.post(
            '/CypherQuery/create',
            queryObj,
            function () {
            	
            }
        ).fail(function(res){
            alert("Error: " + res.getResponseHeader("error"));
    });
        
}

getSettings = function(cb) {

    $.ajax({
          url: 'Settings/data?id=6',
          data: {},
          success: function(r){ 
               cb(r.settings);
          },
          dataType: 'json'
    });

}


