var rest = require('restler');

exports.get = function(url, cb) {

	rest.get(url).on('complete', function(result) {
	  if (result instanceof Error) {
	    cb('Restler get Error:' + result.message);
	  } else {
	  	cb(result);
	  }
	});

}

exports.postJson = function(url, data, cb) {

	rest.post(url, data).on('complete', function(result) {
	  if (result instanceof Error) {
	    cb('Restler postJson Error:' + result.message);
	  } else {
	  	cb(result);
	  }
	});

}