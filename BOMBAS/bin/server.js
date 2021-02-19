var io = require('socket.io')();

var arrCanales = [
    {canal: 1, cantReq: null, status: 4, startTime: ''},
    {canal: 2, cantReq: null, status: 4, startTime: ''},
    {canal: 3, cantReq: null, status: 4, startTime: ''},
    {canal: 4, cantReq: null, status: 4, startTime: ''},
];

var channelDisplays = [
	{canal: 1, cantReq: null, enableCantReq: true},
    {canal: 2, cantReq: null, enableCantReq: true},
    {canal: 3, cantReq: null, enableCantReq: true},
    {canal: 4, cantReq: null, enableCantReq: true},
]

// Se traeran desde BD, por mientras son simples arrays
var arrReportes = [
	{canal: 1, fecha: '16/05/2020 00:45', requerido: '20.15', cargado: '10.15', estatus: 'finalizado', duracion: '00:01:15', pulsos: 200},
    {canal: 1, fecha: '11/01/2021 12:30', requerido: '30.15', cargado: '20.10', estatus: 'cancelado', duracion: '00:03:15', pulsos: 200},
	{canal: 1, fecha: '11/01/2021 12:30', requerido: '30.15', cargado: '20.10', estatus: 'cancelado', duracion: '00:03:15', pulsos: 200},
	{canal: 2, fecha: '21/01/2020 01:45', requerido: '41.02', cargado: '35.05', estatus: 'finalizado', duracion: '00:04:15', pulsos: 400},
    {canal: 3, fecha: '10/01/2021 03:10', requerido: '12.00', cargado: '10.15', estatus: 'cancelado', duracion: '00:10:15', pulsos: 150},
    {canal: 4, fecha: '16/12/2020 02:20', requerido: '10.08', cargado: '08.15', estatus: 'finalizado', duracion: '00:09:15', pulsos: 200}
]

	io.on('connection', function(socket){
		console.log("NUEVO CLIENTE CONECTADO CON EL SOCKET ID: " + socket.id);

		socket.emit('estado', arrCanales);
		socket.emit('cantidades', channelDisplays);
		//socket.emit('reportes', [reportesC1, reportesC2, reportesC3, reportesC4]);
		socket.emit('reportes', arrReportes);


		// CUANDO CAMBIE ESTADO DE ALGUN CANAL
		socket.on('estado', data => {
			console.log('servidor: cambio de estado', data);
			arrCanales = data;
			io.sockets.emit('estado', arrCanales);
		});

		socket.on('cantidades', data => {
			console.log('servidor: cantidades de canales', data);
			channelDisplays = data;
			io.sockets.emit('cantidades', channelDisplays);
		});

		// CUANDO RECIBA LOS REPORTES
		socket.on('reportes', data => {
			arrReportes = data;
			io.sockets.emit('reportes', arrReportes);
		});

	}); 

	
module.exports = io;