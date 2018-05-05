module.exports = {

	mongo : null,
	app : null,

	init : function(app, mongo) {
		this.mongo = mongo;
		this.app = app;
	},
	
	obtenerUsuarios : function(criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.find(criterio).toArray(function(err, usuarios) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(usuarios);
					}
					db.close();
				});
			}
		});
	},
	
	insertarUsuario : function(usuario, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.insert(usuario, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},

	usuarioRepetido : function(criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.find(criterio).toArray(
							function(err, usuarios) {
								if (err) {
									funcionCallback(null);
								} else {
									funcionCallback(usuarios);
								}
								db.close();
							});
			}
		});
	},
	
	obtenerUsuariosPg : function(criterio, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.count(function(err, count) {
                    collection.find(criterio).skip((pg - 1) * 5).limit(5)
                            .toArray(function(err, usuarios) {
                                if (err) {
                                    funcionCallback(null);
                                } else {
                                    funcionCallback(usuarios, count);
                                }
                                db.close();
                            });
                });
            }
        });
    },
    obtenerPeticionesPg: function(criterio,pg, funcionCallback) {
	    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
	      if (err) {
	        funcionCallback(null);
	      } else {
	        var collection = db.collection('peticiones');
	        collection.count(function(err, count) {
	        	collection.find(criterio).skip((pg - 1) * 5).limit(5).toArray(function(err, peticiones) {
	          if (err) {
	            funcionCallback(null);
	          } else {
	            funcionCallback(peticiones, count);
	          }
	          db.close();
	        });
	        });
	      }

	    });
	  },
    insertarPeticion : function(idPeticion, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('peticiones');
				collection.insert(idPeticion, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},
	 obtenerPeticiones: function(criterio, funcionCallback) {
		    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
		      if (err) {
		        funcionCallback(null);
		      } else {
		        var collection = db.collection('peticiones');
		        collection.find(criterio).toArray(function(err, peticiones) {
		          if (err) {
		            funcionCallback(null);
		          } else {
		            funcionCallback(peticiones);
		          }
		          db.close();
		        });
		      }

		    });
		  },
		  modificarPeticion : function(criterio, peticion, funcionCallback) {
				this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
					if (err) {
						funcionCallback(null);
					} else {
						var collection = db.collection('peticiones');
						collection.update(criterio, {
							$set : peticion
						}, function(err, result) {
							if (err) {
								funcionCallback(null);
							} else {
								funcionCallback(result);
							}
							db.close();
						});
					}
				});
			},
			insertarMensaje : function(mensaje, funcionCallback) {
				this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
					if (err) {
						funcionCallback(null);
					} else {
						var collection = db.collection('mensajes');
						collection.insert(mensaje, function(err, result) {
							if (err) {
								funcionCallback(null);
							} else {
								funcionCallback(result.ops[0]._id);
							}
							db.close();
						});
					}
				});
			}, obtenerMensajes: function(criterio, funcionCallback) {
			    this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
				      if (err) {
				        funcionCallback(null);
				      } else {
				        var collection = db.collection('mensajes');
				        collection.find(criterio).toArray(function(err, mensajes) {
				          if (err) {
				            funcionCallback(null);
				          } else {
				            funcionCallback(mensajes);
				          }
				          db.close();
				        });
				      }

				    });
				  },
			

};