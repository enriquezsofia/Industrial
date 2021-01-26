var io = require('socket.io')();

var channelStatus = [
    {channel: 1, status: 4},
    {channel: 2, status: 4},
    {channel: 3, status: 4},
    {channel: 4, status: 4},
];

var channelDisplays = [
	{channel: 1, cantReq: null},
    {channel: 2, cantReq: null},
    {channel: 3, cantReq: null},
    {channel: 4, cantReq: null},
]

	io.on('connection', function(socket){
		console.log("NUEVO CLIENTE CONECTADO CON EL SOCKET ID: " + socket.id);

		socket.emit('estado', channelStatus);
		socket.emit('cantidades', channelDisplays);

		// CUANDO CAMBIE ESTADO DE ALGUN CANAL
		socket.on('estado', data => {
			console.log('servidor: cambio de estado', data);
			channelStatus = data;
			io.sockets.emit('estado', channelStatus);
		});

		socket.on('cantidades', data => {
			console.log('servidor: cantidades de canales', data);
			channelDisplays = data;
			io.sockets.emit('cantidades', channelDisplays);
		});

	}); 

	
module.exports = io;