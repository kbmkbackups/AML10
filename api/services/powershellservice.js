
replaceAll = function (find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}


exports.create_powershell_export_script = function(settings, tablename, psfilename, sql, cb){

	var db = settings.sqldb;
	var instance = settings.sqlinstance;
	var delimiter = settings.csvsep;
	var full_csv_filepath = settings.csvfolder + '\\' + tablename;
	var full_ps_filepath = settings.psfolder + '\\' + psfilename;

	var ps = 'write-host -ForegroundColor Green "Creating File %1" \r\n ' 
	+ ' invoke-sqlcmd -query "%2" -database "%3" -serverinstance "%4" | export-csv -delimiter "%5" -path %6 -NoTypeInformation \r\n'
	+ ' (gc %6) | % {$_ -replace \'"\', ""} | out-file %6 -Fo -En ascii \r\n'

	ps = replaceAll('%1', tablename, ps);
	ps = replaceAll('%2', sql, ps);
	ps = replaceAll('%3', db, ps);
	ps = replaceAll('%4', instance, ps);
	ps = replaceAll('%5', delimiter, ps);
	ps = replaceAll('%6', full_csv_filepath, ps);

	cb(ps,full_ps_filepath);

}


exports.runpowershell = function(psfile,callback){

	var spawn = require("child_process").spawn;
	var child = spawn("powershell.exe",[psfile]);

	child.on("exit", callback);

	child.stdout.on("data",function(data){
	    console.log("Powershell Data: " + data);
	});

	child.stderr.on("data",function(data){
	    console.log("Powershell Errors: " + data);
	});

    child.stdin.end();

}

