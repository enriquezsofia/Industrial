var socket = io('http://localhost:3000');

window.onload = function() {

}


// *************** VARIABLES
// Ventana activa (Principal o reportes)
var viewPrincipal = true;
var viewReportes = false;

// Para Displays de Cantidad Requerida y Cargada
var cantRequerida = document.getElementById('cantRequerida');
var cantCargado = document.getElementById('cantCargado');
var cantidad = '';
var boolReq = false;
var boolCar = false;

// Para Estados (Inicio, Pausa y Cancelar)
var btnInicio = document.getElementById('btnInicio');
var btnPausa = document.getElementById('btnPausa');
var btnCancelar = document.getElementById('btnCancelar');
// Estados 
// 1 - Inicio
// 2 - Pausado
// 3 - Cancelado
// 4 - Sin estado
// Canales y su estado
var canal = 1;
var arrCanales;
// EJ
// var arrCanales = [
//     {channel: 1, status: 4, startTime: ''},
//     {channel: 2, status: 4, startTime: ''},
//     {channel: 3, status: 4, startTime: ''},
//     {channel: 4, status: 4, startTime: ''},

// ];

// Canales y su cantidad Requerida
var displays;
//EJ
// var displays = [
//     {channel: 1, cantReq: 0},
//     {channel: 2, cantReq: 0},
//     {channel: 3, cantReq: 0},
//     {channel: 4, cantReq: 0},
// ];

// Reportes
var arrReportes;
// *************** FIN DE VARIABLES

// *************** SOCKETS
socket.on('estado', data => {
    arrCanales = data;
    var obj = arrCanales.find(f => f.channel == canal);
    updateEstado(obj.status);
});

socket.on('cantidades', data => {
    displays = data;
    updateDisplay();

});

socket.on('reportes', data => {
    arrReportes = data;
    loadReportes();
});

// *************** FIN DE SOCKETS

// HORA
var clockElement = document.getElementById('txtDate');

// RELOJ DE VENTANA PRINCIPAL
function clock() {
    var today = new Date();

    var dateTime = formatDate(today);

    clockElement.textContent = dateTime.toString();
}
setInterval(clock, 1000);

// FORMATEO DE FECHAS
function formatDate(unformatDate) {
    //Mes
    var month = (unformatDate.getMonth()+1).toString();
    month = month.length==1 ? 0+month : month;

    //Fecha del dia
    var date = unformatDate.getDate()+'/'+month+'/'+unformatDate.getFullYear();

    //Minutos
    var minutes = unformatDate.getMinutes().toString();
    minutes = minutes.length==1 ? 0+minutes : minutes;

    //Segundos
    var seconds = unformatDate.getSeconds().toString();
    seconds = seconds.length==1 ? 0+seconds : seconds;

    //Hora
    var time = unformatDate.getHours() + ":" + minutes + ":" + seconds;
    return date+' '+time;
}

// CAMBIO DE PESTAÑA PRINCIPAL Y REPORTES
function cambioVentana(ventana) {
    switch(ventana) {
        case 'Principal':
            document.getElementById('principal').style.display = "flex";
            document.getElementById('reportes').style.display = "none";

            document.getElementById('btnPrincipal').classList.add('pestanaActiva');
            document.getElementById('btnReportes').classList.remove('pestanaActiva');

            viewPrincipal = true;
            viewReportes = false;
        break;
        case 'Reportes':
            document.getElementById('reportes').style.display = "flex";
            document.getElementById('principal').style.display = "none";

            document.getElementById('btnReportes').classList.add('pestanaActiva');
            document.getElementById('btnPrincipal').classList.remove('pestanaActiva');

            viewPrincipal = false;
            viewReportes = true;
        break;
    }
}

// CAMBIO DE CANALES
function cambioCanal(canal){
    for(var i=1; i<=4; i++) {
        var count = 'C'+i;
        if(count==canal) {
            document.getElementById(`btn${canal}`).classList.add('canalActivo');
            //Actualizar el canal actual
            this.canal = i;

            // PRINCIPAL
            if(viewPrincipal) {
                //Cambiar boton de estado segun el canal
                var res = arrCanales.find(f => f.channel == i);

                //Limpiar displays
                cantidad = '';
                cantRequerida.value = '';
                cantCargado.value = '';

                //Quitar focus de displays
                boolReq = false;
                boolCar = false;
                cantRequerida.classList.remove('display');
                cantCargado.classList.remove('display');

                //Cambiar contenido del canal
                updateEstado(res.status);    
                updateDisplay();        
            }

            if(viewReportes) {
               loadReportes();
            }
            
        }
        if(count!=canal) {
            document.getElementById(`btn${count}`).classList.remove('canalActivo');
        }
    }
}


// *************** VENTANA PRINCIPAL
// FOCUS DE REQUERIDA Y CARGADO
function focusChanged(display) {
    if(display == 'requerido') {
        boolReq = true;
        boolCar = false;
        cantRequerida.classList.add('display');
        cantCargado.classList.remove('display');
        cantidad = cantRequerida.value;
    }
    if(display == 'cargado') {
        boolReq = false;
        boolCar = true;
        cantRequerida.classList.remove('display');
        cantCargado.classList.add('display');
        cantidad = cantCargado.value;
    }
}

// METODO DE NUMERO PRESIONADO (DESDE LOS BOTONES DE PANTALLA)
function numeroPressed(num) {
    if(num!='clear') {    
        // Se cambia la variable cantidad
        cambiarCantidad(num);
    } else {
        cantidad = '';
    }
    writeCantidad();
}

// METODO PARA RECIBIR NUMERO (DESDE TECLADO Y DESDE BOTONES)
function cambiarCantidad(num) {
    if(num != '.') {
        cantidad == '0' ? cantidad = num : cantidad += num;
    }
    if(num == '.' && !cantidad.includes('.')) {
        cantidad == '' ? cantidad += '0.' : cantidad += '.';
    }
}

function backspaceEvent(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if(charCode == 8) {
        // Borrar ultimo digito
        cantidad = cantRequerida.value.slice(0, -1);
        writeCantidad();
        return true;
    }
    else
        return false;
}

// METODO PARA ADMITIR SOLO CIFRAS NUMERICAS DESDE TECLADO
function onlyNumberKey(evt) { 
         
    // Only ASCII charactar in that range allowed 
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (charCode != 46 && charCode > 31 
    && (charCode < 48 || charCode > 57))
        return false;
    else {
        // La variable Cantidad se modifica cuando se introducen numeros desde teclado
        if(boolReq) {
            cantidad = cantRequerida.value;
        }
        if(boolCar) {
            cantidad = cantCargado.value;
        }

        cambiarCantidad(String.fromCharCode(charCode));
        writeCantidad();
        return false; //falso para que no se ponga varias veces el numero
    }
}

// CANTIDAD MOSTRADA EN INPUT DISPLAY
function writeCantidad() {
    if(boolReq) {
        cantRequerida.value = cantidad;
    }
    if(boolCar) {
        cantCargado.value = cantidad;
    }
    writeCantidad_socket();
}

// GUARDAR CANTIDADES EN ARREGLO Y PASARLAS MEDIANTE SOCKETS
function writeCantidad_socket() {
    var currentChannel = displays.find(f => f.channel == canal);
    if(currentChannel){
        currentChannel.cantReq = cantRequerida.value;
        socket.emit('cantidades', displays);
        
    }
}

// ACTUALIZAR DISPLAYS MEDIANTE SOCKETS
function updateDisplay() {
    var currentChannel = displays.find(f => f.channel == canal);
    if(currentChannel){
        cantRequerida.value = currentChannel.cantReq;
    }
}

// FOCUS PARA ESTADO ACTUAL (INICIO, PAUSADO O CANCELADO)
function updateEstado(status) {
    switch(status) {
        case 1: 
            onInicio();

            // Se habilitan botones de Pausa y cancelar
            btnPausa.disabled = false;
            btnCancelar.disabled = false;

            // Se deshabilita boton de inicio
            btnInicio.disabled = true;
        break;
        case 2:
            onPausa();

            //Se deshabilita boton de inicio
            btnInicio.disabled = true;
            btnPausa.disabled = false;
            btnCancelar.disabled = false;
        break;
        case 3:
            onCancelar();

            //Se habilitan todos los botones
            btnInicio.disabled = false;
            btnPausa.disabled = false;
            btnCancelar.disabled = false;

            setTimeout(() => {updateEstado(4);}, 1000);
        break;
        case 4:
            btnInicio.classList.remove('btn-OnInicio');
            btnPausa.classList.remove('btn-OnPausa');
            btnCancelar.classList.remove('btn-OnCancelar');  

            //Cuando se encuentre sin estado, solo podra darle a Inicio, por lo que se desactiva el de Pausa y Cancelar
            btnInicio.disabled = false;
            btnPausa.disabled = true;
            btnCancelar.disabled = true;
        break;
    }

}
function onInicio() {
    btnInicio.classList.add('btn-OnInicio');
    btnPausa.classList.remove('btn-OnPausa');
    btnCancelar.classList.remove('btn-OnCancelar');  
}

function onPausa() {
    btnInicio.classList.remove('btn-OnInicio');
    btnPausa.classList.add('btn-OnPausa');
    btnCancelar.classList.remove('btn-OnCancelar');
}

function onCancelar() {
    btnInicio.classList.remove('btn-OnInicio');
    btnPausa.classList.remove('btn-OnPausa');
    btnCancelar.classList.add('btn-OnCancelar');
}

// METODO PARA CAMBIAR EL ESTADO SEGUN EL CANAL ACTUAL
// SE ACTUALIZAN LOS DATOS POR CANAL

// Note: actualizar hora de inicio cuando ha sido pausado, para reiniciar la duracion.
// Note: cuando esta en una ventana (principal) y se cambia entre canales y luego va a reportes, no se actualizan los reportes del
// canal al que se habia cambiado previamente. Y viceversa
function updateEstado_socket(status) {
    var currentChannel = arrCanales.find(f => f.channel == canal);
    if(currentChannel){
        currentChannel.status = status;
        if(status == 1){
            currentChannel.startTime = new Date();
            currentChannel.cantReq = cantRequerida.value;
        }
        if(status == 2) {
            // Reporte con estado Pausado y su duracion
            newReporte(currentChannel, setCountTime(currentChannel.startTime));
        }
        if(status == 3) {
            // Reporte con estado Cancelado y su duracion
            newReporte(currentChannel, setCountTime(currentChannel.startTime));

            // Despues de generar reporte, se regresa a sin estado y se borran los campos de cantidad
            // Note: falta borrar los campos
            updateEstado(status);
            currentChannel.status = 4;
        }
        if(status == 4){
            currentChannel.startTime = '';
            currentChannel.duration = '';
        }
        updateEstado(status);
    }

    socket.emit('estado', arrCanales);    
} 

// CONTADOR DE TIEMPO DESDE QUE ESTADO CAMBIA
var totalSeconds = 0;

function setCountTime(countFrom) {
    //countFrom = new Date(countFrom).getTime();
    var now = new Date(), 
        countFrom = new Date(countFrom), 
        timeDifference = (now - countFrom);

    var secondsInADay = 60 * 60 * 1000 * 24,
        secondsInAnHour = 60 * 60 * 1000;
    
    var hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAnHour) * 1);
    var mins = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAnHour)) / (60 * 1000) * 1);
    var secs = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAnHour)) % (60 * 1000)) / 1000 * 1);

    var duration = `${hours}:${mins}:${secs}`;
    return duration;
}


// *************** FIN DE VENTANA PRINCIPAL


// *************** VENTANA DE REPORTES
// CARGAR LOS REPORTES EN HTML POR CANAL
function loadReportes() {
    //var reportes = `reportesC${this.canal}`;
    var htmlTable = '';
    arrReportes.forEach(e => {
        if(e.canal == this.canal) {
            htmlTable += 
            `<tr>
                <th scope="row">${e.fecha}</th>
                <td>${e.requerido}</td>
                <td>${e.cargado}</td>
                <td>${e.estatus}</td>
                <td>${e.duracion}</td>
                <td>${e.pulsos}</td>
            </tr>`;
        }
    });
    document.getElementById('bodyReportes').innerHTML = htmlTable;
}

// GUARDAR NUEVO REPORTE POR CANAL
// Note: Aun no hay reportes con estado Finalizado ya que es cuando la cantidad Cargada alcance la Requerida
// Note: cambiar Cantidad Requerida a Read Only cuando el estado sea Inicio o Pausa
// Note: no iniciar si no hay una cantidad en Requerida
function newReporte(channel, duration) {
    //var reportes = `reportesC${this.canal}`;

    // Estado en Texto
    var estado = '';
    if(channel.status == 2)
        estado = 'Pausado';
    if(channel.status == 3)
        estado = 'Cancelado';
    if(channel.status == 4)
        estado = 'Finalizado';

    // Formateo de fecha
    var startTime = new Date(channel.startTime);
    startTime = formatDate(startTime);

    // Guardar el reporte en el arreglo
    arrReportes.push({canal:channel.channel, fecha: startTime, requerido: channel.cantReq, cargado: '-', estatus: estado, duracion: duration, pulsos: '-'});

    //actualizar reportes en socket
    socket.emit('reportes', arrReportes);
}

// *************** FIN DE VENTANA DE REPORTES