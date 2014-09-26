

module.exports = {

  schema: true, 

  connection: 'mongolocal',

  attributes: {

  		label : 'string',

  		fieldlist: {
  			collection: 'Importfield',
  			via: 'map'
  		}
  }

};

