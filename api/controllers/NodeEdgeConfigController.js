
module.exports = {
    
  nodesedges : function(req, res, next){
  	res.view({
		view: 'Configuration/NodesEdges'
  	});
  },

  properties : function(req, res, next){
    res.view({
    view: 'Configuration/Properties'
    });

  },

  systemsettings : function(req, res, next){
  	res.view({
		view: 'Configuration/SystemSettings'
  	});

  },



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to NodeEdgeConfigController)
   */
  _config: {}

  
};
