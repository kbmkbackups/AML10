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

	},


	getneojson : function(req, res, next){

		var url = '/db/data/transaction/commit';
		var query = 'match (a)-[:TRANSFERRED]->(b) return a,b limit 20;';


		settingsservice.getSettings(function(settings){

			neoservice.getjson(settings.neoserver, url, query, function(rr){
					console.log(rr);
					res.json(rr);
			});

		});


	}


}