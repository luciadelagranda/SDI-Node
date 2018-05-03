// Módulos
var express = require('express');
var app = express();

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

// routerUsuarioSession
var routerUsuarioSession = express.Router();
	routerUsuarioSession.use(function(req, res, next) {
	console.log("routerUsuarioSession");
	 if ( req.session.usuario ) {
	 // dejamos correr la petición
	 next();
	 } else {
	 console.log("va a : "+req.session.destino)
	 res.redirect("/identificarse");
	 }
});

// Aplicar routerUsuarioSession
app.use("/listar",routerUsuarioSession);


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

// lanzar el servidor
app.listen(app.get('port'), function() {
	console.log("Servidor activo");
});
