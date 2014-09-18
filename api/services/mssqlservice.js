var sql = require('mssql'); 

var config = {
    user: 'sa',
    password: 'sa',
    server: 'localhost\\ENTERPRISE', // You can use 'localhost\\instance' to connect to named instance
    database: 'SaxoAML',

    options: {
        encrypt: false // Use this if you're on Windows Azure
    }
}



exports.getMSSQLRecordset = function(query, cb){

    var connection = new sql.Connection(config, function(err) {

        var request = new sql.Request(connection); 
        request.query(query, function(err, recordset) {
            
            cb(recordset);
        });

    });
    

/*
    sql.connect(config, function(err) {
    // ... error checks

    // Query

    var request = new sql.Request();
    request.query('SELECT [AccountTypeID] ,[AccountTypeDesc] FROM [SaxoAML].[baseenum].[AccountTypes]', function(err, recordset) {
        // ... error checks

        cb(err);
    });



    });
*/

}