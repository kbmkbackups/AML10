var rest = require('restler');

restler__Get = function(url, cb) {

	rest.get(url).on('complete', function(result) {
	  if (result instanceof Error) {
	    cb('Restler Error:' + result.message);
	  } else {
	  	cb(result);
	  }
	});

}


exports.getSettings = function(cb){

	var url = 'http://localhost:1337/Settings/data?id=6';

	restler__Get(url, function(res){
		cb(res.settings);
	});


}