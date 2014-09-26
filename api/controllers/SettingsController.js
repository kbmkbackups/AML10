

module.exports = {
    
  	index: function(req, res, next){

	    Settings.findOne(6,function(error, ss) {
			res.view('Settings/index', {settings: ss});
	    }); 

  	},

  	data: function(req, res, next){
  		confkey = req.param('id');
  		Settings.findOne(confkey,function(error, settings){
  			res.json({settings:settings});
  		});
  	},

  	data2: function(req, res, next){
  		Settings.find(function(error, ss){
  			res.json({settings:ss});
  		});
  	},

  	create: function(req, res, next){
  		
  		var settings = {
			neoserver: 'http://server:7474',
			sqlinstance: 'localhost',
			sqldb: 'default',
			sqlaccount: 'default',
			sqlpass: 'default',
			mongoserver: 'default',
			mongodb: 'default',
			csvfolder: 'c:\\default\\',
			csvsep: 'c:\\default\\',
			csvqualifier: 'c:\\default\\',
			psfolder: 'c:\\default\\'
	    }

		Settings.create(settings, function(err, cns) {	
  			cns.save(function(err, cn) {
        		if (err) return next(err);
        		res.redirect('/Settings/index');

        	});
  		});

  	},

  	save: function(req,res,next){

		var settings = {
			neoserver: req.param('neo_server'),
			sqlinstance: req.param('sql_instance'),
			sqldb: req.param('sql_db'),
			sqlaccount: req.param('sql_account'),
			sqlpass: req.param('sql_pass'),
			mongoserver: req.param('mongodb_server'),
			mongodb: req.param('mongodb_db'),
			csvfolder: req.param('csv_folder'),
			csvsep: req.param('csv_sep'),
			csvqualifier: req.param('csv_qualifier'),
			psfolder: req.param('ps_folder')
	    }

        Settings.update(6, settings, function(err) {
        		res.redirect('/Settings/index');
		});

	},

  _config: {}

  
};
