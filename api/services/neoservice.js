var rest = require('restler');

var rel_url = 'db/data/relationship/types';
var pk_url = 'db/data/propertykeys';
var label_url = 'db/data/labels';


fixresult = function(data, cb){

	var keys = [];
	for (i = 0; i < data.length; i++) { 
    	keys.push({key: data[i]});
	}
	cb(keys);
}

restler_get = function(server, url, cb) {

	rest.get(server + url).on('complete', function(result) {
	  if (result instanceof Error) {
	    cb('Error:', result.message);
	    this.retry(5000); // try again after 5 sec
	  } else {
	  	fixresult(result, function(fixedres){
			cb(fixedres);
	  	});
	  }
	});

}


exports.neo_meta_relations = function(server, cb) {

	restler_get(server, rel_url, cb);

}


exports.neo_meta_labels = function(server, cb) {

	restler_get(server, label_url, cb);

}


exports.neo_meta_propertykeys = function(server, cb) {

	restler_get(server, pk_url, cb);
	

}
