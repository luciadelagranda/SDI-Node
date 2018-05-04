module.exports = function(app, gestorBD) {

	app.post("/api/autenticar/", function(req, res) {
		var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
				.update(req.body.password).digest('hex');
		var criterio = {
			email : req.body.email,
			password : seguro
		}

		gestorBD.obtenerUsuarios(criterio, function(usuarios) {
			if (usuarios == null || usuarios.length == 0) {
				res.status(401);
				res.json({
					autenticado : false
				})
			} else {
				var token = app.get('jwt').sign({
					usuario : criterio.email,
					tiempo : Date.now() / 1000
				}, "secreto");
				res.status(200);
				res.json({
					autenticado : true,
					token : token
				});
			}

		});
	});
	
	app.get("/api/usuarios", function(req, res) {
		var criterio = { $and: [ { "amigos" : true} , {$or: [ {"emailPeticionado": res.usuario}, {"emailPeticionador": res.usuario} ]}]};
        gestorBD.obtenerPeticiones(criterio, function(peticiones) {
            if (peticiones == null) {
                res.status(500);
                res.json({})
            } else {
                res.status(200);
                res.send(JSON.stringify(peticiones));
            }
        });
    });

}