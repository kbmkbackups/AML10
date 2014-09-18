$(document).ready(function(){

	getSettings(function(settings){

		var label_url = 'db/data/labels';
		var rel_url = 'db/data/relationship/types';
		var pk_url = 'db/data/propertykeys';

		var server = settings.neoserver;

		getNeoMeta = function(url, tag, tableclass){

		    $.ajax({
			      url: server + url,
			      data: {},
			      success: function(r){ 
			      		_.each(r, function(rr){
			      			$(tableclass).append("<a class='list-group-item'>" + rr + "</a>");	
			      		});
			      },
			      dataType: 'json'
			});

		}

		getNeoMeta(label_url, 'label', '.label-t');
		getNeoMeta(rel_url, 'relationship', '.relationship-t');
		getNeoMeta(pk_url, 'propertykey', '.propertykey-t');


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
			      			var appendcontrol = "<div class='list-group-item'><input type='checkbox' id='cb_" + rr.column_id + "' class='csel-cb' name2='" + rr.name + "' id2='" + rr.column_id + "'>";
			      			appendcontrol = appendcontrol + " <a class='csel-a' href='#' name2='" + rr.name + "' id2='" + rr.column_id + "'>" + rr.name + "</a></div>";

			      			$('.ajax-list').append(appendcontrol);
			      		});
			      },
			      dataType: 'json'
			});  
		});


		$("div").on("click", ".csel-cb", function(evt) {

			if ($(this).prop('checked')){
				var tablerow = "<tr class='addcolstable-field' name2='" + $(this).attr("name2") + "' id='tr_" + $(this).attr("id2") + "'><td>" +  $(this).attr("name2") + "</td><td><input type='text' id='tb_" + $(this).attr("id2") + "'></td></tr>";
				$('.addcolstable').append(tablerow);
			}
			else {
				$('.addcolsdiv').find("#tr_" + $(this).attr("id2")).remove();
			}

		  	evt.stopPropagation();
	 
		});


		$("div").on("click", ".csel-a", function(evt) {

			var id = $(this).attr("id2");

			if ($("#cb_" + id).prop('checked')){
				$("#cb_" + id).prop('checked',false);
				$('.addcolsdiv').find("#tr_" + id).remove();
			}
			else {
				$("#cb_" + id).prop("checked",true);
				var tablerow = "<tr class='addcolstable-field' name2='" + $(this).attr("name2") + "' id='tr_" + id + "'><td>" +  $(this).attr("name2") + "</td><td><input type='text' id='tb_" + $(this).attr("id2") + "'></td></tr>";
				$('.addcolstable').append(tablerow);
			}

		  	evt.stopPropagation();
	 
		});



		replaceAll = function (find, replace, str) {

		  return str.replace(new RegExp(find, 'g'), replace);

		}


		createSQL = function(cb){

			
			var tablename = $('#newnodessourcetable').val();
			var sql = "select ";

			$('.addcolstable .addcolstable-field').each(function(index, element){
				sql = sql  + $(element).attr("name2").replace(/ *\([^)]*\) */g, "") + "," ; /* remove parantheses and everything inbetween */
			});

			sql = sql.substring(0,sql.length-1) + " from " + tablename;

			console.log(sql);

			cb(sql);
		}


		createPowershellScript = function(){

			createSQL(function(sql){

				var tablename = $('#newnodessourcetable').val() + '.csv';
				var psfilename = $('#newnodessourcetable').val() + '.ps1';

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

				$('.status').append('<div class="spinner"><img src="/images/ajax-loader.gif"</div>');

				$.ajax({
			      url: 'DataIntegration/savepowershellfile',
			      data: {
			      		psfiledata:ps, 
			      		psfilename: full_ps_filepath
			      },
			      statusCode: {
				    200: function() {
				    	$('.status').append('<div>created powershell file ' + full_ps_filepath + '</div>');
				    	$('.status').append('<div>initated execution of powershell file ' + full_ps_filepath + '</div>');
					      $.ajax({
						      url: 'DataIntegration/runpowershellfile',
						      data: {psfilename: full_ps_filepath},
						      statusCode: {
							    200: function() {
							    	$('.status').append('<div>executed powershell file ' + full_ps_filepath + '</div>');
							    	$('.spinner').remove();
							    }
							  },
						      dataType: 'json'
							});

				    }
				  },

			      dataType: 'json'
				});


			});	


		}

		$('.create-node-but').click(function(){
			createPowershellScript();
		});

		$('.create-rel-but').click(function(){
			alert('rel');
		});

		$('.create-prop-but').click(function(){
			alert('prop');
		});



	});

});