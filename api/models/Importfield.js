

module.exports = {

	schema: true, 

	connection: 'mongolocal',

  	attributes: {

  		sqlfield: 'string',
  		neofield: 'string',
  		converttoint: 'int',
  		map: { 
  			model: 'Importmap' 
  		}

  	}
};

