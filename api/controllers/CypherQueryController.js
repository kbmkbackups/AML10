module.exports = {
    

  	new: function(req, res, next) {
       res.view(); 
    },

    create: function(req, res, next) {

	   	var newQueryObj = {
	      name: req.param('name'),
	      cypherquery: req.param('cypherquery')
	    }

	    CypherQuery.create(newQueryObj, function(err, newquery) {

	    	newquery.save(function(err, newquery) {
		        if (err) return next(err);
				CypherQuery.publishCreate(newquery);
		        res.redirect('/');
		    });
	    
	    });

    },

    subscribe: function(req, res, next) {
 
	    CypherQuery.find(function(err, queries) {
	      if (err) return next(err);
	      CypherQuery.watch(req.socket);
	      res.send(200);
	    });

  	},


    _config: {}

  
};
