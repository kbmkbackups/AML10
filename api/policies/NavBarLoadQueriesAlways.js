
module.exports = function (req, res, next) {
    
	CypherQuery.find(function foundQueries(err, queries) {
		res.locals.cypherqueries = queries;
		next();
	}); 


};

