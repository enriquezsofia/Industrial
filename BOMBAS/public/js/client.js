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
// 5 - Finalizado
// Variable de array de canales y su estado
var canal = 1;
var arrCanales;

// Variable de array de canales y su cantidad Requerida
var arrdisplays;

// Variable de array Reportes
var arrReportes;
// *************** FIN DE VARIABLES

// *************** SOCKETS
socket.on('estado', data => {
    arrCanales = data;
    var obj = getArrayCanal(canal);
    updateEstado_design(obj.status);
});

socket.on('cantidades', data => {
    arrdisplays = data;
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

// METODO PARA OBTENER DISPLAYS DEPENDIENDO DEL CANAL ACTUAL
function getArrayDisplays(canal) {
    return arrdisplays.find(f => f.canal == canal);
}

// METODO PARA OBTENER DATOS DEL CANAL DEPENDIENDO DEL CANAL ACTUAL
function getArrayCanal(canal) {
    return arrCanales.find(f => f.canal == canal);
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

            // Cambio de elementos de canal
            cambioCanal(`C${this.canal}`);
        break;
        case 'Reportes':
            document.getElementById('reportes').style.display = "flex";
            document.getElementById('principal').style.display = "none";

            document.getElementById('btnReportes').classList.add('pestanaActiva');
            document.getElementById('btnPrincipal').classList.remove('pestanaActiva');

            viewPrincipal = false;
            viewReportes = true;

            // Cambio de elementos de canal
            cambioCanal(`C${this.canal}`);
        break;
    }
}

// CAMBIO DE CANALES
function cambioCanal(canal) {
    for(var i=1; i<=4; i++) {
        var count = 'C'+i;
        if(count==canal) {
            document.getElementById(`btn${canal}`).classList.add('canalActivo');
            //Actualizar el canal actual
            this.canal = i;

            // PRINCIPAL
            if(viewPrincipal) {
                //Cambiar boton de estado segun el canal
                var res = getArrayCanal(this.canal);

                // Note: creo que puede borrarse esto
                //Limpiar displays
                //cantidad = '';
                //cantRequerida.value = '';
                //cantCargado.value = '';

                //Quitar focus de displays
                boolReq = false;
                boolCar = false;
                cantRequerida.classList.remove('display');
                cantCargado.classList.remove('display');

                //Cambiar contenido del canal
                updateDisplay();    
                updateEstado_design(res.status);    
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
// CALCULO DE CANTIDAD TOTAL QUE APARECE EN PANTALLA PRINCIPAL
function calcularTotal() {
    
}

// FOCUS DE REQUERIDA Y CARGADO
function focusChanged(display) {
    var currentChannel = getArrayDisplays(canal);

    if (currentChannel.enableCantReq) {
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
}

// METODO DE NUMERO PRESIONADO (DESDE LOS BOTONES DE PANTALLA)
function numeroPressed(num) {
    var currentChannel = getArrayDisplays(canal);

    if(currentChannel.enableCantReq) {
        if(num!='clear') {    
            // Se cambia la variable cantidad
            cambiarCantidad(num);
        } else {
            cantidad = '';
        }
        writeCantidad();
    }
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
    var currentChannel = getArrayDisplays(canal);

    if(currentChannel.enableCantReq) {
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
}

// METODO PARA ADMITIR SOLO CIFRAS NUMERICAS DESDE TECLADO
function onlyNumberKey(evt) { 
    
    var currentChannel = getArrayDisplays(canal);

    if (currentChannel.enableCantReq) {
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
    var currentChannel = getArrayDisplays(canal);
    if(currentChannel){
        currentChannel.cantReq = cantRequerida.value;
        socket.emit('cantidades', arrdisplays);
        
    }
}

// ACTUALIZAR DISPLAYS MEDIANTE SOCKETS
function updateDisplay() {
    var currentChannel = getArrayCanal(canal);
    var currentChannel_display = getArrayDisplays(canal);

    if(currentChannel_display){
        cantRequerida.value = currentChannel_display.cantReq;
        
        // Si el estado del canal esta en Inicio o Pausa, el input Cantidad Requerida es ReadOnly
        if(currentChannel.status == 1 || currentChannel.status == 2) {
            cantRequerida.classList.remove('display');
            cantRequerida.readOnly = true;
        }
        else {
            cantRequerida.readOnly = false;
        }
    }
}

// METODO PARA CAMBIAR ESTADO
// MANDA A LLAMAR AL METODO DE SOCKETS Y EL CANAL ACTUAL (CUANDO NO ESTA EN STATUS 5)
function updateEstado(status) {
    var currentChannel = canal;
    updateEstado_socket(status, currentChannel);

}
// FOCUS PARA ESTADO ACTUAL (INICIO, PAUSADO O CANCELADO)
function updateEstado_design(status) {
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
        break;
        case 4:
            btnInicio.classList.remove('btn-OnInicio');
            btnPausa.classList.remove('btn-OnPausa');
            btnCancelar.classList.remove('btn-OnCancelar');  

            //Cuando se encuentre sin estado, solo podra darle a Inicio, por lo que se desactiva el de Pausa y Cancelar
            btnInicio.disabled = false;
            btnPausa.disabled = true;
            btnCancelar.disabled = true;

            // Metodo de Activar/Desactivar boton de inicio si el campo de Cantidad Requerida tiene texto o no
            disableStartButton();
        break;
        case 5:
            //Se habilitan todos los botones
            btnInicio.disabled = false;
            btnPausa.disabled = false;
            btnCancelar.disabled = false;
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

// METODO PARA ACTIVAR/DESACTIVAR EL BOTON DE ESTADO INICIO SI EL CAMPO DE CANTIDAD REQUERIDA TIENE TEXTO O NO
function disableStartButton() {
    cantRequerida.value.length > 0 ? btnInicio.disabled = false : btnInicio.disabled = true;
}

// METODO PARA CAMBIAR EL ESTADO SEGUN EL CANAL ACTUAL
// SE ACTUALIZAN LOS DATOS POR CANAL
// Note: actualizar hora de inicio cuando ha sido pausado, para reiniciar la duracion.
// Note: al recargar la pagina, que cambien los botones (habilitados/deshabilitados) dependiendo de si hay texto en input
function updateEstado_socket(status, channel) {
    var currentChannel = getArrayCanal(channel);
    var currentChannel_display = getArrayDisplays(channel);

    if(currentChannel){
        currentChannel.status = status;
        if(status == 1){
            currentChannel.startTime = new Date();
            currentChannel.cantReq = cantRequerida.value;

            // Se cambia a false el bool para no permitir cambios en el input Cantidad Requerida
            currentChannel_display.enableCantReq = false;

            // Se actualizan los display para que el input Cantidad Requerida solo sea ReadOnly
            updateDisplay();

            // Note: AQUI esta la prueba de cambiar cantida cargada
            pruebaCantCargada();
        }
        if(status == 2) {
            // Reporte con estado Pausado y su duracion
            newReporte(currentChannel, setCountTime(currentChannel.startTime));
        }

        //Note: probando con estado Finalizado, si no sale, lo borro
        if(status == 3 || status == 5) {
            // Reporte con estado Cancelado y su duracion
            newReporte(currentChannel, setCountTime(currentChannel.startTime));

            // Despues de generar reporte, se regresa a Sin Estado (4) y se limpia la cantidad requerida
            updateEstado_design(status);
            currentChannel.status = 4;
            currentChannel.cantReq = null;

            // Se limpia el tiempo de inicio y la duracion
            currentChannel.startTime = '';
            currentChannel.duration = '';

            // Se limpian los campos de Cantidad Requerida y Cargada
            cantRequerida.value = '';
            cantCargado.value = '';

            // El array que guarda las cantidades tambien se limpia y actualiza
            // Se cambia a true el bool para permitir cambios en el input Cantidad Requerida
            currentChannel_display.cantReq = null;
            currentChannel_display.enableCantReq = true;
            socket.emit('cantidades', arrdisplays); 

            // Se actualizan los display para remover el ReadOnly del input Cantidad Requerida
            updateDisplay();

        }
        updateEstado_design(status);
    }

    socket.emit('estado', arrCanales);    
} 

// CONTADOR DE TIEMPO DESDE QUE ESTADO CAMBIA
var totalSeconds = 0;

function setCountTime(countFrom) {
    var now = new Date(), 
        countFrom = new Date(countFrom), 
        timeDifference = (now - countFrom);

    var secondsInADay = 60 * 60 * 1000 * 24,
        secondsInAnHour = 60 * 60 * 1000;
    
    var hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAnHour) * 1).toString();
    var mins = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAnHour)) / (60 * 1000) * 1).toString();
    var secs = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAnHour)) % (60 * 1000)) / 1000 * 1).toString();

    //poner doble cifra
    hours = hours.length==1 ? 0+hours : hours;
    mins = mins.length==1 ? 0+mins : mins;
    secs = secs.length==1 ? 0+secs : secs;

    var duration = `${hours}:${mins}:${secs}`;
    return duration;
}


// *************** FIN DE VENTANA PRINCIPAL


// *************** VENTANA DE REPORTES
// CARGAR LOS REPORTES EN HTML POR CANAL
function loadReportes() {
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
function newReporte(channel, duration) {
    // Estado en Texto
    var estado = '';
    if(channel.status == 2)
        estado = 'Pausado';
    if(channel.status == 3)
        estado = 'Cancelado';
    if(channel.status == 5)
        estado = 'Finalizado';

    // Formateo de fecha
    var startTime = new Date(channel.startTime);
    startTime = formatDate(startTime);

    // Guardar el reporte en el arreglo
    arrReportes.push({canal:channel.canal, fecha: startTime, requerido: channel.cantReq, cargado: '-', estatus: estado, duracion: duration, pulsos: '-'});

    //actualizar reportes en socket
    socket.emit('reportes', arrReportes);
}

// *************** FIN DE VENTANA DE REPORTES

// metodo temporal para provar el input de Cantidad Cargada y que reportes se generen al igualar cantidad Cargada = Requerida
// con estado de Finalizado
// note: LOS INTERVALOS SON PRUEBAS COMO SI ESTUVIERA RECIBIENDO DATOS

// IDs para Intervalos por Canal
var intC1, intC2, intC3, intC4;
// IDs para counts de Cantidad Cargada por Canal
var countCarC1, countCarC2, countCarC3, countCarC4;

function pruebaCantCargada() {
    //var countCargado = cantCargado.value;
    countCargado = 0;
    console.log('comienzo de Cant cargada');
    aumentar();
}

var activeTimers = 0;
function aumentar() {
    // Se crea un nombre de variable para el Intervalo segun el canal en el que se haya iniciado el proceso
    var idInterval = `intC${this.canal}`;
    var countCargado = `countCarC${this.canal}`;
    activeTimers++;

    window[idInterval] = setInterval(function() {
    window[countCargado]++;
    cantCargado.value = window[countCargado];

    console.log('active timers',activeTimers);

    // Validar si Cantidad Cargada es igual a Cantidad Requerida
    // note: que lo valide desde los campos en el ARREGLO por CANAL
    if(cantCargado.value == cantRequerida.value) {
        //Note: que se cambie de estado a FINALIZADO y luego a SIN ESTADO
        console.log('es igual');
        clearInterval(window[idInterval]);
        window[countCargado] = 0;

        //Generar reporte 
        //Se omite el metodo para obtener el canal actual, ya que podría ser de otro canal donde ya se hayan igualado las cantidades
        //Se toma el numero del Canal a partir de la variable idInterval
        var canal = idInterval.substring(4);
        updateEstado_socket(5, canal);
         
        activeTimers--;
        console.log('active timers',activeTimers);
    }
   }, 500);
}