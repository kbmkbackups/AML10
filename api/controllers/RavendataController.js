
module.exports = {
    
		index: function(req,res,next){
		  	res.view();
		},

		new: function(req, res, next){
			
			un = req.param('username');
			up = req.param('userpass');

			var ravendataobj = {
				id: 12345,
				username: 'Ole',
				userpass: 'Paabas'
			}

			var ravendb = require('ravendb');

			var db = ravendb('http://localhost:8080','saxoaml');

			db.saveDocument('User', ravendataobj, function(err, result) {
			  if (err) console.error(err)
			  else console.log(result)
			});

			
			/*
			db.getDocument('users/tony', function(err, result) {
			  if (err) console.error(err)
			  else console.log(result)
			})

			var otherdb = ravendb('http://some-remote-url.com', 'OtherDatabase')
			otherdb.getDocument('things/foobar', function(err, result) {
			  if (err) console.error(err)
			  else console.log(result)
			})

			// Use NTLM security
			var work = ravendb('http://internal-machine.workdomain.ad')
			work.useNTLM('workdomain', 'tony', 'mypassword')
			work.find('Users', { lastName: 'Heupel' }, function(err, result) {
			  if (err) console.error(err)
			  else console.log(result.length) // Returns an array of matching results
			}

			// Use RavenHQ
			var hq = ravendb('https://1.ravenhq.com', 'tony-test')
			hq.useRavenHq('0f2bb123-b5ad-4e92-9ec5-7026bff5b933') // Set API KEY
			hq.getDocument('things/foobar', function(err, result) {
			  if (err) console.error(err)
			  else console.log(result)
			})

			*/

			res.view('RavenData/index');

		},

		newbyadapter: function(req,res,next){

			un = req.param('username');
			up = req.param('userpass');

			var ravendataobj = {
				id: 123467,
				username: 'Ole',
				userpass: 'Paabas'
			}	

			Ravendata.create(ravendataobj, function(err, newravenobj) {	

				console.log(err);
				console.log(newravenobj);


	  			newravenobj.save(function(err, cn) {
	  				console.log(err);
	        		if (err) return next(err);
	        		res.redirect('/RavenData/index');
	        	});
	  			
  			});


		},

        _config: {}

};
