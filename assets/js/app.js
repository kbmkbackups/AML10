
(function (io) {

  var socket = io.connect();

  socket.on('connect', function socketConnected() {
    socket.on('message', messageReceivedFromServer);
    socket.get('/CypherQuery/subscribe');
  });

  window.socket = socket;

})(window.io);


function css2json(css) {
    var s = {};
    if (!css) return s;
    if (css instanceof CSSStyleDeclaration) {
        for (var i in css) {
            if ((css[i]).toLowerCase) {
                s[(css[i]).toLowerCase()] = (css[css[i]]);
            }
        }
    } else if (typeof css == "string") {
        css = css.split("; ");
        for (var i in css) {
            var l = css[i].split(": ");
            s[l[0].toLowerCase()] = (l[1]);
        }
    }
    return s;
}

function csss(a) {
    var sheets = document.styleSheets, o = {};
    for (var i in sheets) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var r in rules) {
            if (a.is(rules[r].selectorText)) {
                o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
            }
        }
    }
    return o;
}


function messageReceivedFromServer(message) {

  if (message.model === 'cypherquery')   {
    
      var name = message.data.name;
      var cypherquery = message.data.cypherquery;

      var oc = 'createEditorPanel("' + cypherquery + '")';

      var newli = "<li onclick='" + oc + "'><a href='#'>" + name + "</a></li>";

      $('.saved-queries-dropdown').append(newli);

      $('.color-toggle').animate(
        { 'color': 'red'}, {
          duration: 'fast',
          easing: 'easeOutCubic'
        } 
      ).animate(
        { 'color': 'black'}, {
          duration: 1500,
          easing: 'easeInCubic'
          }
      );
  }
  else {
      if (message.model === 'poweshell_execution_message'){

          $('.status').append('<br>Powershell execution completed');
      }

  }
      
}

