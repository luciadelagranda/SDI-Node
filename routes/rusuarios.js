module.exports = function(app, swig, gestorBD) {

	app.get("/registrarse", function(req, res) {
		var respuesta = swig.renderFile('views/bregistro.html', {emailSession : req.session.usuario});
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
																			req.session.usuario = usuario.email;
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
		var respuesta = swig.renderFile('views/bidentificacion.html', {
			emailSession : req.session.usuario
		});
		res.send(respuesta);
	});

	app.post("/identificarse", function(req, res) {
						var seguro = app.get("crypto").createHmac('sha256',
								app.get('clave')).update(req.body.password)
								.digest('hex');
						var criterio = {
							email : req.body.email,
							password : seguro
						}
						gestorBD.obtenerUsuarios(criterio,function(usuarios) {
								if (usuarios == null || usuarios.length == 0) {
										req.session.usuario = null;
										res.redirect("/identificarse?mensaje=Email o password incorrecto.");
								} else {
										req.session.usuario = usuarios[0].email;
										res.redirect("/listar");
								}
						});
	});
	
	app.get('/desconectarse', function(req, res) {
		req.session.usuario = null;
		res.redirect("/identificarse");
	})


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
				
				var criterio = { $or : [{
						emailPeticionador: req.session.usuario
				      },
				      { emailPeticionado : req.session.usuario}
						
				]};
				
				var peticiones = gestorBD.obtenerPeticiones(criterio,
			              function(peticiones) {

			                var pgUltima = total / 5;
			                if (total % 5 > 0) { // Sobran decimales
			                  pgUltima = pgUltima + 1;
			                }

			                var respuesta = swig.renderFile('views/busuarios.html', {
								usuarios : usuarios,
								pgActual : pg,
								pgUltima : pgUltima,
								emailSession : req.session.usuario,
								peticiones: peticiones
			                });
			                res.send(respuesta);
			              });
			}
				
		});
	});
	
	
	app.get('/enviarPeticion/:id', function(req, res) {
		var emailPeticionado = req.params.id;
		var peticion = {
			emailPeticionador: req.session.usuario,
			emailPeticionado : emailPeticionado,
			amigos: false
		}
		gestorBD.insertarPeticion(peticion, function(idPeticion) {
			if (idPeticion == null) {
				res.redirect("/listar?mensaje=No existe el usuario;");
			} else {
				res.redirect("/listar");
			}
		});
	})
	
	
	app.get("/listarPeticiones", function(req, res) {
		var criterio = {
				emailPeticionado: req.session.usuario
		      }

		var pg = parseInt(req.query.pg); // Es String !!!
		if (req.query.pg == null) { // Puede no venir el param
			pg = 1;
		}
		gestorBD.obtenerPeticionesPg(criterio, pg, function(peticiones, total) {
			if (peticiones == null) {
				res.send("Error al listar.");
			} else {

			                var pgUltima = total / 5;
			                if (total % 5 > 0) { // Sobran decimales
			                  pgUltima = pgUltima + 1;
			                }

			                var respuesta = swig.renderFile('views/bpeticiones.html', {
								pgActual : pg,
								pgUltima : pgUltima,
								emailSession : req.session.usuario,
								peticiones: peticiones
			                });
			                res.send(respuesta);
			   
			}
				
		});
	})
	
	app.get('/aceptarPeticion/:id', function(req, res) {
		var emailPeticionador = req.params.id;
		
		var peticion = {
			emailPeticionador : emailPeticionador,
			emailPeticionado: req.session.usuario,
			amigos: true
		}
		
		var criterio = {
				emailPeticionador : emailPeticionador,
				emailPeticionado: req.session.usuario,
		}
		
		gestorBD.modificarPeticion(criterio,peticion, function(emailPeticionado) {
			if (emailPeticionado == null) {
				res.redirect("/listarPeticiones?mensaje=No existe el usuario;");
			} else {
				res.redirect("/listarPeticiones");
			}
		});
	})

};