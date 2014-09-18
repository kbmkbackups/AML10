
closepanel = function(panelid){

	$("#" + panelid).animate(
		{ height: '50px', opacity:0.3 }, {
			duration: 'slow',
			easing: 'easeOutCubic',
			complete: function(){ $("#" + panelid).remove() }

	});

}

insertPanel = function(uid, contents, height, callback){

	$('.flowpanelcontainer').prepend(contents);

	$("#" + uid).animate(
		{ 'min-height': height, opacity:1 }, {
			duration: 'slow',
			easing: 'easeInCubic'
	}); 

	callback();
} 

createCodeEditor = function (uid) {

	var a =  CodeMirror.fromTextArea(document.getElementById('cypher_query_' + uid), {
	  parserfile: ["codemirror-cypher.js"],
	  path: "/js/",
	  stylesheet: "/styles/codemirror-neo.css",
	  autoMatchParens: true,
	  lineNumbers: true,
	  enterMode: "keep",
	  value: "some value" 
	});

	return a;
} 

endisable = function(a,b,savepanel,uid){

	if (a> 0 && b > 0){

		$(savepanel).find('#save_query_' + uid).addClass('success').removeClass('disabled');
		$(savepanel).find('#save_query_' + uid).attr("onclick","savequery('" + uid + "')");
	}
	else
	{
		$(savepanel).find('#save_query_' + uid).removeClass('success').addClass('disabled');;
		$(savepanel).find('#save_query_' + uid).click(function(e){ e.preventDefault();	});
	}
}

createGraphCanvasPanel = function (){

	var uid = makeid();
	var html = new EJS({url: '/templates/ui-panel-graphcanvas.ejs'}); 
	var canvaspanel = $(html.text).find('.uidpanel').attr("id",uid);

	$(canvaspanel).find('#graph_canvas').attr("id","graph_canvas_" + uid);
	$(canvaspanel).find('#cancel_query').attr("onclick","closepanel('" + uid + "')");
	$(canvaspanel).find('#cancel_query').attr("id","cancel_query_" + uid);

	$(canvaspanel).find('#cyphercode').attr("id","cyphercode_" + uid);

	insertPanel(uid,canvaspanel,'425px', function(){
		
	}); 

	return uid;
}


createSaveQueryPanel = function (uidOfEditor){

	var uid = makeid();
	var html = new EJS({url: '/templates/ui-panel-save-cypherquery.ejs'}); 
	var querycode;

	if (uidOfEditor != '') {
		var editor = $('#' + uidOfEditor).data('CodeMirrorInstance');
		querycode = editor.getValue();

	} else
	{
		querycode = "";
	}

	var savepanel = $(html.text).find('.uidpanel').attr("id",uid);

	$(savepanel).find('#save_query').click(function(e){ e.preventDefault();	});
	$(savepanel).find('#save_query').removeClass('success').addClass('disabled');

	$(savepanel).find('#save_query').attr("id","save_query_" + uid);

	$(savepanel).find('#cancel_query').attr("onclick","closepanel('" + uid + "')");
	$(savepanel).find('#cancel_query').attr("id","cancel_query_" + uid);

	$(savepanel).find('#name').keyup(function(){
		var l = $(this).val().length;
		var l2 = $('textarea#cypherquery_' + uid).val().length;
		endisable(l,l2,savepanel,uid);
	}); 
	$(savepanel).find('#name').attr("id","name_" + uid);

	$(savepanel).find('textarea#cypherquery').keyup(function(){
		var l = $(this).val().length;
		var l2 = $('#name_' + uid).val().length;
		endisable(l,l2,savepanel,uid);
	}); 
	$(savepanel).find('textarea#cypherquery').val(querycode);
	$(savepanel).find('textarea#cypherquery').attr("id","cypherquery_" + uid);


	insertPanel(uid, savepanel,'215px', function(){

	});

}


createEditorPanel = function (cypherquerycode){

	var uid = makeid();
	var html = new EJS({url: '/templates/ui-panel-cypherquery-editor.ejs'}); 

	var editorpanel = $(html.text).find('.uidpanel').attr("id",uid);

	$(editorpanel).find('textarea#cypher_query').html(cypherquerycode);
	
	$(editorpanel).find('#cypher_query').attr("onkeydown","alert('hest')");
	$(editorpanel).find('#cypher_query').attr("id","cypher_query_" + uid);

	$(editorpanel).find('#execute_query').attr("onclick","loadGraphToCanvas('" + uid + "')");
	$(editorpanel).find('#execute_query').attr("id","execute_query_" + uid);

	$(editorpanel).find('#save_query').attr("onclick","createSaveQueryPanel('" + uid + "')");
	$(editorpanel).find('#save_query').attr("id","save_query_" + uid);

	$(editorpanel).find('#cancel_query').attr("onclick","closepanel('" + uid + "')");
	$(editorpanel).find('#cancel_query').attr("id","cancel_query_" + uid);

	$(editorpanel).find('#graph_canvas').attr("id","graph_canvas_" + uid);

	insertPanel(uid,editorpanel,'280px', function(){
		var editor = createCodeEditor(uid); 
		$(editorpanel).data('CodeMirrorInstance', editor);
		return uid;
	}); 

	
}


loadGraphToCanvas = function (uid){
	
	var neoUrl = 'http://localhost:7474';
	
	var editor = $('#' + uid).data('CodeMirrorInstance');
	var querycode = editor.getValue();

	try {
		var uuid = createGraphCanvasPanel();
		config.nodeTypes = { type : ["Party","Account"]}
		config.nodeCaption = function(n) {return n.partyname || n.accountno;};
		config.edgeCaption = {"caption":["OWNS","TRANSFERRED"]};
		config.nodeMouseOver = function(n) {return n.id + "<br/>"+n.partyname || n.accountno;};

		config.divSelector="#graph_canvas_" + uuid;
		config.dataSource={nodes:[],edges:[]};
		config.forceLocked = false;
		config.alpha = 0.8;
		config.edgeTypes = "caption";

		alchemy.begin(config)
		var neo = new Neo(neoUrl);

		neo.executeQuery(querycode,{},function(err,res) {
			res = res || {}
			var graph=res.graph;
			var labels = res.labels;
			config.nodeTypes = {type: labels};
			if (err) {
				alchemy.conf.warningMessage=JSON.stringify(err);
				alchemy.startGraph(null)
			} else {
				alchemy.startGraph(graph);
				$('#cyphercode_' + uuid).html(querycode);
			} 

		});
	} catch(e) {
		console.log(e);
	}

	return false; 
}

