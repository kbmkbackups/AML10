
var fs = require('fs');

var filePtr = {}
var fileBuffer = {}
var buffer = new Buffer(4096)

eof = function(handle) {
  return (handle in filePtr) == false && (fileBuffer[handle].length == 0);
}

fopen = function(path, mode) {
  var handle = fs.openSync(path, mode)
  filePtr[handle] = 0
  fileBuffer[handle]= []
  return handle

}

fclose = function(handle) {
  fs.closeSync(handle)
  if (handle in filePtr) {
    delete filePtr[handle]
    delete fileBuffer[handle]
  } 
  return

}

fgets = function(handle) { 
  if(fileBuffer[handle].length == 0)
  {
    var pos = filePtr[handle]
    var br = fs.readSync(handle, buffer, 0, 4096, pos)
    if(br < 4096) {
      delete filePtr[handle]
      if(br == 0)  return ""
    }
    var lst = buffer.slice(0, br).toString().split("\n")
    var minus = 0
    if(lst.length > 1) {
      var x = lst.pop()
      minus = x.length
    } 
    fileBuffer[handle] = lst 
    filePtr[handle] = pos + br - minus
  }
  return fileBuffer[handle].shift()

}

createCreateline = function(map){
	
	var label = map[0].label;

	var crstring = 'CREATE ( n:' + label + ' {';
	var c=1;

	_.each(map[0].fieldlist, function(r){
		console.log(r);
		if (r.converttoint === "1"){
			crstring += r.neofield + ": toInt(%" + c + "), ";	
		} else {
			crstring += r.neofield + ": %" + c + " , ";
		}

		c++;
	});

	crstring = crstring.substring(0,crstring.length-2)  + ' });';

	return crstring;

}

exports.writefile = function(filename, filecontents, callback){

	fs.writeFile(filename, filecontents, function(err) {
	    if(err) { 
	        callback(err);
	    } else {
	        callback("The file was saved!");
	    }
	}); 	

}				

exports.processcsv = function(csvfile, SETTINGS, map, cb){

	var csvfolder = SETTINGS.csvfolder;

	var source = SETTINGS.csvfolder + '\\' + csvfile;
	var target = SETTINGS.csvfolder + '\\' + csvfile + '.cypher';

	crstring = createCreateline(map);
	
	var r=fopen(source,"r")
	if(r===false)
	{
	   console.log("Error, can't open ", source)
	   process.exit(1)
	} 

	var w = fs.openSync(target,"w")
	var header = fgets(r);

	while (!eof(r))
	{
	   var line=fgets(r);
	   var linefields= line.replace('\r','').split(';');
	   var cr = crstring; 

	   var c=1;
	  _.each(linefields, function(){
	  		cr = cr.replace('%' + c, "\"" + linefields[c-1] + "\"");
	  		c++;

	  });

	  console.log(cr);
	  fs.writeSync(w, cr, null, 'utf8');

	} 
	
	fclose(r)
	fs.closeSync(w)
	
	cb();

}



