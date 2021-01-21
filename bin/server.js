var io = require('socket.io')();

var channelStatus = [
    {channel: 1, status: 4},
    {channel: 2, status: 4},
    {channel: 3, status: 4},
    {channel: 4, status: 4},
];

	io.on('connection', function(socket){
		console.log("NUEVO CLIENTE CONECTADO CON EL SOCKET ID: " + socket.id);

		socket.emit('estado', channelStatus);

		// CUANDO CAMBIE ESTADO DE ALGUN CANAL
		socket.on('estado', data => {
			console.log('servidor: cambio de estado', data);
			channelStatus = data;
			io.sockets.emit('estado', channelStatus);

			// YA MUESTRA ESTADO ACTUAL AL RECARGAR LA PAGINA, PERO NO AL MOMENTO
		});
		
		// socket.on('disconnect', function () {
		// 	console.log('A user disconnected');
		//  });
	}); 

	
module.exports = io;