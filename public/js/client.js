var socket = io('http://localhost:3000');

window.onload = function() {
    // document.getElementById('reportes').style.display = "none"; 
}

// SOCKETS
socket.on('estado', data => {
    estados = data;
    var obj = estados.find(f => f.channel == canal);
    updateEstado(obj.status);
});


// HORA
var clockElement = document.getElementById('txtDate');

function clock() {
    var today = new Date();

    //Mes
    var month = (today.getMonth()+1).toString();
    month = month.length==1 ? 0+month : month;

    //Fecha del dia en curso
    var date = today.getDate()+'/'+month+'/'+today.getFullYear();

    //Minutos
    var minutes = today.getMinutes().toString();
    minutes = minutes.length==1 ? 0+minutes : minutes;

    //Segundos
    var seconds = today.getSeconds().toString();
    seconds = seconds.length==1 ? 0+seconds : seconds;

    //Hora
    var time = today.getHours() + ":" + minutes + ":" + seconds;
    var dateTime = date+' '+time;

    clockElement.textContent = dateTime.toString();
}
setInterval(clock, 1000);

// CAMBIO DE PESTAÑA PRINCIPAL Y REPORTES
function cambioVentana(ventana) {
    switch(ventana) {
        case 'Principal':
            document.getElementById('principal').style.display = "flex";
            document.getElementById('reportes').style.display = "none";

            document.getElementById('btnPrincipal').classList.add('pestanaActiva');
            document.getElementById('btnReportes').classList.remove('pestanaActiva');
        break;
        case 'Reportes':
            document.getElementById('reportes').style.display = "flex";
            document.getElementById('principal').style.display = "none";

            document.getElementById('btnReportes').classList.add('pestanaActiva');
            document.getElementById('btnPrincipal').classList.remove('pestanaActiva');
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
            //Cambiar boton de estado segun el canal
            var res = estados.find(f => f.channel == i);
            updateEstado(res.status);
            
        }
        if(count!=canal) {
            document.getElementById(`btn${count}`).classList.remove('canalActivo');
        }
    }
}

// FOCUS DE REQUERIDA Y CARGADO
function focusChanged(display) {
    if(display == 'requerido') {
        boolReq = true;
        boolCar = false;
        cantRequerida.classList.add('display');
        cantCargado.classList.remove('display');
    }
    if(display == 'cargado') {
        boolReq = false;
        boolCar = true;
        cantRequerida.classList.remove('display');
        cantCargado.classList.add('display');
    }
}

// NUMERO EN DISPLAY
var cantRequerida = document.getElementById('cantRequerida');
var cantCargado = document.getElementById('cantCargado');
var cantidad = '';
var boolReq = false;
var boolCar = false;
function numeroPressed(num) {
    if(num!='clear') {    
        cambiarCantidad(num);
    } else {
        cantidad = '';
    }
    writeCantidad();
}

function cambiarCantidad(num) {
    // Si se borra alguna cifra con backspace se actualiza Cantidad
    if(boolReq) {
        cantidad = cantRequerida.value;
    }
    if(boolCar) {
        cantidad = cantCargado.value;
    }

    if(num != '.') {
        cantidad == '0' ? cantidad = num : cantidad += num;
    }
    if(num == '.' && !cantidad.includes('.')) {
        cantidad == '' ? cantidad += '0.' : cantidad += '.';
    }
}

// METODO PARA ADMITIR SOLO CIFRAS NUMERICAS DESDE TECLADO
function onlyNumberKey(evt) { 
         
    // Only ASCII charactar in that range allowed 
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 
    && (charCode < 48 || charCode > 57))
        return false;
    else {
        cambiarCantidad(String.fromCharCode(charCode));
        writeCantidad();
        return false; //falso para que no se ponga varias veces el numero
    }
}

// CANTIDAD EN INPUT
function writeCantidad() {
    if(boolReq) {
        cantRequerida.value = cantidad;
    }
    if(boolCar) {
        cantCargado.value = cantidad;
    }
}

// FOCUS PARA ESTADO ACTUAL (INICIO, PAUSADO O CANCELADO)
var btnInicio = document.getElementById('btnInicio');
var btnPausa = document.getElementById('btnPausa');
var btnCancelar = document.getElementById('btnCancelar');
// Estado 
// 1 - Inicio
// 2 - Pausado
// 3 - Cancelado
// 4 - Sin estado
// Canales y su estado
var canal = 1;
var estados = [
    {channel: 1, status: 4},
    {channel: 2, status: 4},
    {channel: 3, status: 4},
    {channel: 4, status: 4},

];

function updateEstado(status) {
    switch(status) {
        case 1: 
            onInicio();
        break;
        case 2:
            onPausa();
        break;
        case 3:
            onCancelar();
        break;
        case 4:
            btnInicio.classList.remove('btn-OnInicio');
            btnPausa.classList.remove('btn-OnPausa');
            btnCancelar.classList.remove('btn-OnCancelar');  
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
function updateEstado_socket(status) {
    var currentChannel = estados.find(f => f.channel == canal);
    if(currentChannel){
        currentChannel.status = status;
        updateEstado(status);
    }

    socket.emit('estado', estados);    
} 