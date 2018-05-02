module.exports = function(app, swig, gestorBD) {

	app.get("/registrarse", function(req, res) {
		var respuesta = swig.renderFile('views/bregistro.html', {});
		res.send(respuesta);
	});

	app
			.post(
					'/usuario',
					function(req, res) {
						if (req.body.password == req.body.confirmPassword) {
							var seguro = app.get("crypto").createHmac('sha256',
									app.get('clave')).update(req.body.password)
									.digest('hex');

							var criterio = {
								email : req.body.email
							};

							gestorBD
									.usuarioRepetido(
											criterio,
											function(usuarios) {
												if (usuarios.length > 0) {
													res
															.redirect("/registrarse?mensaje=El email ya existe");
												} else {

													var usuario = {
														email : req.body.email,
														name : req.body.nombre,
														password : seguro
													};

													gestorBD
															.insertarUsuario(
																	usuario,
																	function(id) {
																		if (id == null) {
																			res
																					.send("No se ha podido registrar el usuario");
																		} else {
																			res
																					.redirect("/listar");
																		}
																	});
												}
											});
						} else {
							res
									.redirect("/registrarse?mensaje=Las contraseñas deben coincidir.");
						}
					})

	app.get("/identificarse", function(req, res) {
		var respuesta = swig.renderFile('views/bidentificacion.html', {});
		res.send(respuesta);
	});

	app
			.post(
					"/identificarse",
					function(req, res) {
						var seguro = app.get("crypto").createHmac('sha256',
								app.get('clave')).update(req.body.password)
								.digest('hex');
						var criterio = {
							email : req.body.email,
							password : seguro
						}
						gestorBD
								.obtenerUsuarios(
										criterio,
										function(usuarios) {
											if (usuarios == null
													|| usuarios.length == 0) {
												req.session.usuario = null;
												res
														.redirect("/identificarse?mensaje=Email o password incorrecto.");
											} else {
												req.session.usuario = usuarios[0].email;
												res.redirect("/listar");
											}
										});
					});

	app.get("/listar", function(req, res) {
		var criterio = {};

		if (req.query.busqueda != null) {
			criterio =  { $or : [
				{"name" : {
					$regex : ".*" + req.query.busqueda + ".*"
				}},
				{"email": {
					$regex : ".*" + req.query.busqueda + ".*"
				}}
			]
			}
		}
		;

		var pg = parseInt(req.query.pg); // Es String !!!
		if (req.query.pg == null) { // Puede no venir el param
			pg = 1;
		}
		gestorBD.obtenerUsuariosPg(criterio, pg, function(usuarios, total) {
			if (usuarios == null) {
				res.send("Error al listar.");
			} else {

				var pgUltima = total / 4;
				if (total % 4 > 0) { // Sobran decimales
					pgUltima = pgUltima + 1;
				}

				var respuesta = swig.renderFile('views/busuarios.html', {
					usuarios : usuarios,
					pgActual : pg,
					pgUltima : pgUltima
				});
				res.send(respuesta);
			}
		});
	});

};