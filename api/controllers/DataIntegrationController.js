module.exports = {
    

  	index: function(req, res, next){

        settingsservice.getSettings(function(settings){
            mssqlservice.SQL_GetTablesOfDatabase(function(sql){
          		mssqlservice.getMSSQLRecordset(sql, settings, function(rs){
          			res.view({
          				tablelistitem: rs,
          				columnlistitem: {}
          			});
          		});
            });
        });

  	},


  	tablecolumns : function(req, res, next){

  		tableid = req.param('sqlt');

      settingsservice.getSettings(function(settings){
          mssqlservice.SQL_GetColumnsOfTable(tableid, function(sql){
              mssqlservice.getMSSQLRecordset(sql, settings, function(rsc){
                   res.json({data: rsc});
              });
          });
      });

   	},


    savepowershellfile2 : function(req, res, next){

        var tablename = req.param('tablename');
        var psfilename = req.param('psfilename');
        var sql = req.param('sql');

        settingsservice.getSettings(function(settings){
          powershellservice.create_powershell_export_script(settings, tablename, psfilename, sql, function(scriptcode, savefilefullpath){
            fileservice.writefile(savefilefullpath, scriptcode, function(){
              powershellservice.runpowershell(savefilefullpath,function(){
                res.send(200);
              });
            });
          });
        });

    },


    processcsvfile : function(req, res, next){

      savefile = req.param('psfilename');
      mapid = req.param('mapid');

      Importmap.find(mapid).populate('fieldlist').exec(function(err,map){
        settingsservice.getSettings(function(settings){
          neoservice.csvtocypher(savefile, settings, map, function(){
            res.send(200);
          });
        });
      });

    },


    create_import_map: function(req,res,next){

        var label = req.param('label');
        var fields = req.param('fields'); 
        var newfieldrecord = {};

        var mapobj = {
            label: label,
            fieldlist: []
        }

        Importmap.create(mapobj, function(err, newmap){

            _.each(fields,function(field){

                newfieldrecord = {
                      sqlfield: field.sqlfield,
                      neofield: field.neofield,
                      converttoint: field.converttoint,
                      map: newmap.id
                }

                Importfield.create(newfieldrecord, function(err, nf) {  
                  nf.save(function(err, cn) {
                      if (err) return next(err);
                  });
                });

            });

            res.send(200,{id:newmap.id});

        });

    },

    _config: {}

  
};
