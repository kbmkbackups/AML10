/* DataIntegrationController.js */

module.exports = {
    

  	index: function(req, res, next){

  		var sql = 'select t.object_id, s.name + \'.\' + t.name name from sys.tables t join sys.schemas s on s.schema_id = t.schema_id order by s.name';

  		mssqlservice.getMSSQLRecordset(sql, function(rs){
			res.view({
				tablelistitem: rs,
				columnlistitem: {}
			});
  		});

  	},

  	table : function(req, res, next){

  		tableid = req.param('sqlt');
  		
  		var sql_t = 'select t.object_id, s.name + \'.\' + t.name name from sys.tables t join sys.schemas s on s.schema_id = t.schema_id order by s.name';

  		var sql_c = "select c.column_id, c.name + ' ( ' + t.name + ' )' name"; 
		sql_c =	sql_c + " from sys.columns c";
		sql_c =	sql_c + " join sys.types t on c.system_type_id = t.system_type_id";
		sql_c =	sql_c + " where object_id = " + tableid	

  		mssqlservice.getMSSQLRecordset(sql_t, function(rst){
	  		mssqlservice.getMSSQLRecordset(sql_c, function(rsc){
				res.view('DataIntegration/index', {
					tablelistitem: rst,
					columnlistitem: rsc
				});
	  		});
	  	});
  	},

  	tablecolumns : function(req, res, next){

  		tableid = req.param('sqlt');

  		var sql_c = "select c.column_id, c.name + ' ( ' + t.name + ' )' name"; 
			sql_c =	sql_c + " from sys.columns c";
			sql_c =	sql_c + " join sys.types t on c.user_type_id = t.user_type_id";
			sql_c =	sql_c + " where object_id = " + tableid	

		mssqlservice.getMSSQLRecordset(sql_c, function(rsc){
			res.json({data: rsc});
  		});


  	},

  	savepowershellfile : function(req, res, next){

  		savefiledata = req.param('psfiledata');
  		savefile = req.param('psfilename');

  		fileservice.writefile(savefile, savefiledata, function(){
  			res.send(200);
  		});

  	},


  	runpowershellfile : function(req, res, next){

  		savefile = req.param('psfilename');

  		fileservice.runpowershell(savefile,function(){
  			res.send(200);
  		});

  	},


    _config: {}

  
};
