
exports.writefile = function(filename, filecontents, callback){

		var fs = require('fs');

		fs.writeFile(filename, filecontents, function(err) {
		    if(err) { 
		        callback(err);
		    } else {
		        callback("The file was saved!");
		    }
		}); 
		
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

