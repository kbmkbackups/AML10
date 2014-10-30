$(document).ready(function(){


	socket.get('/NeoProxy/getneometa', { type: 'relationships' }, function(r){
		_.each(r, function(rr){
  			$('.relationship-t').append("<a class='list-group-item'>" + rr.key + "</a>");	
  		});
	});

	socket.get('/NeoProxy/getneometa', { type: 'labels' }, function(r){
		_.each(r, function(rr){
  			$('.label-t').append("<a class='list-group-item'>" + rr.key + "</a>");	
  		});
	});

	socket.get('/NeoProxy/getneometa', { type: 'propertykeys' }, function(r){
		_.each(r, function(rr){
  			$('.propertykey-t').append("<a class='list-group-item'>" + rr.key + "</a>");	
  		});
	});


	tablerow_f = function(name, name2, id2){
		var tablerow =  	"<tr class='addcolstable-field' name='" + name + "' name2='" + name2 + "' id='tr_" + id2 + "'>"
					  	  + "<td id2='" + id2 + "' name='" + name + "' name2='" + name2 + "'>" + name2 + "</td>"
					  	  + "<td><input type='text' id='tb_" + id2 + "'></td><td><input type='checkbox' id='convcb_" + name + "'></td></tr>";
		return tablerow;
	}

	columnsrow_f = function(column_id, namefull, nameshort){
		var crdiv =         "<div class='list-group-item'>"
						  + "  <input class='csel-cb' type='checkbox' id='cb_" + column_id + "'  id2='" + column_id + "' name='" + nameshort + "' name2='" + namefull + "'>"
                          + "  &nbsp;<a class='csel-a' href='#' name='" + nameshort + "' + name2='" + namefull + "' id2='" + column_id + "'>" + namefull	+ "</a>"
                          + "</div>";	
        return crdiv;
	}

	createSQL = function(cb){

		var tablename = $('#newnodessourcetable').val();
		var sql = "select top(100) ";

		$('.addcolstable .addcolstable-field').each(function(index, element){
			sql = sql  + $(element).attr("name") + "," ; 
		});

		sql = sql.substring(0,sql.length-1) + " from " + tablename;

		cb(sql);

	}



	createPowershellScriptFile = function(){

		createSQL(function(sql){

			var tablename = $('#newnodessourcetable').val() + '.csv';
			var psfilename = $('#newnodessourcetable').val() + '.ps1';

			var ps_engine_obj = {
				tablename: tablename,	
				psfilename: psfilename,
				sql: sql
			}

			$.ajax({
		      url: 'DataIntegration/savepowershellfile2',
		      data: ps_engine_obj,
		      statusCode: {
			    200: function(e,d) {
			    	console.log('File created');
			    }
			  },

		      dataType: 'json'
			});

		
		});	

	}

	createCypherFromCSV = function(){

		var pfile = $('#newnodessourcetable').val() + '.csv';
		var mapid = $('#fieldmapid').val();

		$.ajax({
		      url: 'DataIntegration/processcsvfile',
		      data: {
		      	psfilename: pfile,
		      	mapid: mapid
		      },
		      statusCode: {
			    200: function() {
			    	console.log('back from csv processing');	

				}
			  }
		});

	}

	generateImportMap = function(){

		var label =  $('#newnodeslabel').val();

		var fields = [];
		var sqlfield = "";
		var neofield = "";
		var converttoint = "";
		var convertchecked;

		$('.addcolstable > tbody > tr').each(function(a,b){
			if (a>0){
				
				sqlfield = $(b.cells[0]).attr('name'); 
				id2 = $(b.cells[0]).attr('id2'); 

				convertchecked = $('#' + $($(b.cells[2]).html()).attr('id')).is(':checked');

				if(convertchecked) 
					converttoint = "1"
				else
					converttoint = "0"

				neofield = $('#tb_' + id2).val();
				fields.push({sqlfield: sqlfield, neofield: neofield, converttoint: converttoint});
			}
		});

		socket.post('/DataIntegration/create_import_map', {label:label, fields:fields}, function(res){
			$('#fieldmapid').val(res.id);
		});	

	}


	/* Click events ------------------------------------------------------------------------------------------------------------ */


	/* We clicked on one of the tables in the initial list - add the columns of the table  */
	$('.tablelistitem').click(function(){

		var tableid = $(this).attr("id");
		var tablename = $(this).attr("name");

		$('#newnodessourcetable').val(tablename);

	    $.ajax({
		      url: '/DataIntegration/tablecolumns?sqlt=' + tableid,
		      data: {},
		      success: function(r){ 
		      		$('.ajax-list').empty();
		      		$('.addcolstable-field').remove();
		      		_.each(r.data, function(rr){
		      			var ac = columnsrow_f(rr.column_id, rr.namefull, rr.nameshort);
		      			$('.ajax-list').append(ac);
		      		});
		      },
		      dataType: 'json'
		});  
	
	});

	/* We clicked one of the checkboxes in the list of available columns - add it to the active columns list */
	$("div").on("click", ".csel-cb", function(evt) {

		var id2 = $(this).attr("id2");
		var name = $(this).attr("name");
		var name2 = $(this).attr("name2");
		
		if ($(this).prop('checked')){
			$('.addcolstable').append(tablerow_f(name, name2, id2));
		}
		else {
			$('.addcolsdiv').find("#tr_" + $(this).attr("id2")).remove();
		}

	  	evt.stopPropagation();	 
	
	});

	/* We clicked one of the HREFS in the list of available columns - add it to the active columns list  */
	$("div").on("click", ".csel-a", function(evt) {

		var id2 = $(this).attr("id2");
		var name = $(this).attr("name");
		var name2 = $(this).attr("name2");

		if ($("#cb_" + id2).prop('checked')){
			$("#cb_" + id2).prop('checked',false);
			$('.addcolsdiv').find("#tr_" + id2).remove();
		}
		else {
			$("#cb_" + id2).prop("checked",true);
			$('.addcolstable').append(tablerow_f(name, name2, id2));
		}

	  	evt.stopPropagation();
	
	});

	$('.create-node-but').click(function(){
		createPowershellScriptFile();
	});

	$('.process-file-but').click(function(){
		createCypherFromCSV();
	});

	$('.create-map-but').click(function(){
		generateImportMap();
	});

	$('.create-rel-but').click(function(){
		alert('rel');
	});

	$('.create-prop-but').click(function(){
		alert('prop');
	});


});