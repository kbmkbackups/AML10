
fixresult = function(data, cb){
	var keys = [];
	for (i = 0; i < data.length; i++) { 
    	keys.push({key: data[i]});
	}
	cb(keys);
}


getmetadata = function(server, url, cb){
	sails.services.restlerservice.get(server + url, function(res){
		fixresult(res, function(fixedres){
			cb(fixedres);
		});

	});
}

exports.getjson = function(server, url, query, cb){

	var data = JSON.stringify({
		statements: [{
			statement: query,
			parameters: {},
			resultDataContents: ["row", "graph"]
		}]
	});

	console.log(data);
	
	sails.services.restlerservice.postJson(server + url, data, function(res){
		console.log(res);
		cb(res);
	});

}

exports.neo_meta_relations = function(server, cb) {

	getmetadata(server, 'db/data/relationship/types', cb);

}


exports.neo_meta_labels = function(server, cb) {

	getmetadata(server, 'db/data/labels', cb);

}


exports.neo_meta_propertykeys = function(server, cb) {

	getmetadata(server, 'db/data/propertykeys', cb);
	
}


createCreateline = function(map){
	
	var label = map[0].label;
	var crstring = 'CREATE ( n:' + label + ' {';
	var c=1;

	_.each(map[0].fieldlist, function(r){
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

exports.csvtocypher = function(csvfile, settings, map, cb){

	var csvfolder = settings.csvfolder;

	var source = settings.csvfolder + '\\' + csvfile;
	var target = settings.csvfolder + '\\' + csvfile + '.cypher';

	crstring = createCreateline(map);
	
	var r=fopen(source,"r");

	if(r===false)
	{
	   console.log("Error, can't open ", source);
	   process.exit(1);
	} 

	var w = fs.openSync(target,"w");
	var header = fgets(r);

	while (!eof(r))
	{
	   var line=fgets(r);
	   var linefields= line.replace('\r','').split(';');
	   var cr = crstring; 

	   var c=1;
	  _.each(linefields, function(){
	  		cr = cr.replace('%' + c, '\"' + linefields[c-1] + '\"') + '\r\n';
	  		c++;

	  });

	  fs.writeSync(w, cr, null, 'utf8');
	} 
	
	fclose(r)
	fs.closeSync(w)
	
	cb();

}

