

module.exports = {
	
	index: function(req, res, next){

		var mapid = req.param('mapid');
		
		Importmap.find(mapid).populate('fieldlist').exec(function(err,map){
			res.json(map);
		});

	}
	
};

