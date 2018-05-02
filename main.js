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

//no uso public aun, por tanto no se declara (img, audios...)

//Variables
app.set('port', 8081);
app.set('db','mongodb://admin:admin@ds111370.mlab.com:11370/belunco');
app.set('clave','abcdefg');
app.set('crypto',crypto);

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD); 

// lanzar el servidor
app.listen(app.get('port'), function() {
	console.log("Servidor activo");
});
