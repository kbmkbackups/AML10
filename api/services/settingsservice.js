exports.getSettings = function(cb){

	var url = 'http://localhost:1337/Settings/data?id=6';

	sails.services.restlerservice.get(url, function(res){
		cb(res.settings);
	});


}