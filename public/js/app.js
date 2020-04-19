// props
// -------------
var socket;

// functions
// -------------
function initSocket() {
    this.socket = io();
    this.socket.on('update', function(data) {
        updateCount(data);
    });
}

function updateCount(data) {
    document.getElementById("lblQuedateEnCasa").innerText = data.quedateEnCasa;
    document.getElementById("lblEncuentrosCodear").innerText = data.encuentrosCodear;
}


// start
// -------------
(function() {

    initSocket();

})();