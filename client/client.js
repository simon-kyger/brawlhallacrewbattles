//events
const socket = io();
socket.on('helloworld', (data)=>helloworld(data));

function helloworld(data){
	document.getElementById('Main').innerHTML = data;
}

//onload
document.addEventListener('DOMContentLoaded', rendermain);

function rendermain(){
	let div = document.createElement("div");
	document.body.appendChild(div);
	div.id = 'Main';
}