var sql = require('mssql'); 

exports.SQL_GetColumnsOfTable = function(tableid, cb){

    var sql_c = "select c.column_id, c.name + ' (' + t.name + ')' namefull, c.name nameshort"; 
        sql_c = sql_c + " from sys.columns c";
        sql_c = sql_c + " join sys.types t on c.user_type_id = t.user_type_id";
        sql_c = sql_c + " where object_id = " + tableid 

    cb(sql_c);
}

exports.SQL_GetTablesOfDatabase = function(cb){
    var sql_c = 'select t.object_id, s.name + \'.\' + t.name name from sys.tables t join sys.schemas s on s.schema_id = t.schema_id order by s.name';
    cb(sql_c);  
}


exports.getMSSQLRecordset = function(query, settings, cb){

    var config = {
        
        user: settings.sqlaccount,
        password: settings.sqlpass,
        server: settings.sqlinstance,
        database: settings.sqldb,

        options: {
            encrypt: false
        }
    }


    var connection = new sql.Connection(config, function(err) {

        var request = new sql.Request(connection); 
        request.query(query, function(err, recordset) {
            
            cb(recordset);
        });

    });
    
}