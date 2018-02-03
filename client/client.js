const socket = io();

socket.on('helloworld', (data)=>loadshit(data));

function loadshit(data){
	let p = document.createElement("p");
	document.body.appendChild(p);
	p.innerHTML = `${data}`;
}