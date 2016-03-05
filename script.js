//teh scripts
var MOUSE_POS;
var SIZE = 9; 

var canvas = document.getElementById('draw_space');
var context = canvas.getContext('2d');

var connections = [];

//set up default peer with generated ID
var peer = new Peer({key: APIkey});
peer.on('connection', function(conn) {
  handleConnection(conn);
});

function handleConnection(conn)
{
    connections.push(conn);
    conn.on('data', data => conn.data = data); 
}

function step(timestamp) {
    //make the canvas the right size
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    
    //clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //draw something here using talent and great skill!
    if (MOUSE_POS !== undefined)
    {
	var half_size = SIZE / 2;
	context.fillRect(MOUSE_POS.x - half_size, MOUSE_POS.y - half_size, SIZE, SIZE);
    }

    //draw squares of the connectededs
    connections.forEach(conn => {
	conn.send(MOUSE_POS);
	
	if (conn.data !== undefined)
	    context.fillRect(conn.data.x - half_size,
			     conn.data.y - half_size,
			     SIZE, SIZE);
    });

    //get the next frame
    window.requestAnimationFrame(step);
}

//where is the mouse on the canvas?
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function connectToPeer() {
    var peerID = document.getElementById('peerID').value;
    var conn = peer.connect(peerID);
    handleConnection(conn);
    
}

function saveID() {
    var myID = document.getElementById('myID').value;    
    peer = new Peer(myID, {key:APIkey});
    peer.on('connection', function(conn) {
	handleConnection(conn);
    });
}

document.getElementById('connect').addEventListener('click', connectToPeer);
document.getElementById('save').addEventListener('click', saveID);

//MOUSE_POS changes whenever the mouse moves
window.addEventListener('mousemove', e => { MOUSE_POS = getMousePos(canvas, e);});

//get the first frame
window.requestAnimationFrame(step);
