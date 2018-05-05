// Módulos
var express = require('express');
var app = express();

var jwt = require('jsonwebtoken');
app.set('jwt',jwt);

var expressSession = require('express-session');
app.use(expressSession({
 secret: 'abcdefg',
 resave: true,
 saveUninitialized: true
}));

var crypto = require('crypto');

var mongo = require('mongodb');
var swig = require('swig');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

// routerUsuarioToken
var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function(req, res, next) {
	 // obtener el token, puede ser un parámetro GET , POST o HEADER
	 var token = req.body.token || req.query.token || req.headers['token'];
	 if (token != null) {
		 // verificar el token
		 jwt.verify(token, 'secreto', function(err, infoToken) {
			 if (err || (Date.now()/1000 - infoToken.tiempo) > 240 ){
				 res.status(403); // Forbidden
				 res.json({
					 acceso : false,
					 error: 'Token invalido o caducado'
				 });
				 // También podríamos comprobar que intoToken.usuario existe
				 return;
		
			 } else {
				 // dejamos correr la petición
				 res.usuario = infoToken.usuario;
				 next();
			 }
		 });
	 } else {
		 res.status(403); // Forbidden
		 res.json({
		 acceso : false,
		 mensaje: 'No hay Token'
		 });
	 }
});
// Aplicar routerUsuarioToken
app.use('/api/usuarios', routerUsuarioToken);
app.use('/api/mensajes', routerUsuarioToken);


// routerUsuarioSession
var routerUsuarioSession = express.Router();
	routerUsuarioSession.use(function(req, res, next) {
	console.log("routerUsuarioSession");
	 if ( req.session.usuario ) {
	 // dejamos correr la petición
	 next();
	 } else {
	 console.log("va a : "+req.session.usuario)
	 res.redirect("/identificarse");
	 }
});

// Aplicar routerUsuarioSession
app.use("/listar",routerUsuarioSession);
app.use("/listarPeticiones",routerUsuarioSession);
app.use("/amigos",routerUsuarioSession);

app.use(express.static('public'));

app.get('/', function (req, res) {
	res.redirect('/identificarse');
	})

// Variables
app.set('port', 8081);
app.set('db','mongodb://admin:admin@ds111370.mlab.com:11370/belunco');
app.set('clave','abcdefg');
app.set('crypto',crypto);

// Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD);
require("./routes/rapiusuarios.js")(app, gestorBD);

app.use( function (err, req, res, next ) {
	 console.log("Error producido: " + err); // we log the error in our db
	 if (! res.headersSent) {
	 res.status(400);
	 res.send("Recurso no disponible");
	 }
	});

// lanzar el servidor
app.listen(app.get('port'), function() {
	console.log("Servidor activo");
});
