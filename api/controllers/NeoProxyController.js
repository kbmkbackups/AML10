module.exports = {

	getneometa : function(req, res, next){

		settingsservice.getSettings(function(settings){

			var type = req.param('type');
			var f;

			if(type == 'relationships'){
				f = neoservice.neo_meta_relations;
			} else if (type == 'labels'){
				f = neoservice.neo_meta_labels;
			} else if (type == 'propertykeys'){
				f = neoservice.neo_meta_propertykeys;
			}

			f(settings.neoserver, function(r){
				res.json(r);	
			});

		});

	}

}