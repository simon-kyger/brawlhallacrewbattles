//onload
document.addEventListener('DOMContentLoaded', rendermain);

function rendermain(){
	document.body.style.margin = 0;
	let div = document.createElement("div");
	document.body.appendChild(div);
	div.id = 'main';
	renderlogin();
}

function renderlogin(){
	let div = document.getElementById('main');
	div.innerHTML = '';
	div.style.width = `100%`;
	div.style.height = `100%`;
	div.innerHTML = `
		<div id='outer'>
			<div id='welcome'>Welcome to the Robs Brawlhalla Page</div>
			<form id='login'>
				<div>Username: </div>
				<input id='username'></input>
				<div>Password: </div>
				<input id='password'></input>
			</form>
			<div id='registerlink'>Register</div>
		</div>
	`;
	document.getElementById('login').style.margin = 0;
	document.getElementById('outer').style.position = 'relative';
	document.getElementById('outer').style.top = `40%`;
	document.getElementById('outer').style.left = `40%`;
	document.getElementById('registerlink').addEventListener('click', ()=>{
		renderregister();
	})
}

function renderregister(){
	let div = document.getElementById('main');
	div.innerHTML = '';
	div.style.width = `100%`;
	div.style.height = `100%`;
	div.innerHTML = `
		<div id='outer'>
			<div> Register </div>
			<form id='register'>
				<div>Username: </div>
				<input id='regusername'></input>
				<div>Password: </div>
				<input id='regpassword'></input>
			</form>
			<div id='loginlink'>Login</div>
		</div>
	`;
	document.getElementById('register').style.margin = 0;
	document.getElementById('outer').style.position = 'relative';
	document.getElementById('outer').style.top = `40%`;
	document.getElementById('outer').style.left = `40%`;
	document.getElementById('loginlink').addEventListener('click', ()=>{
		renderlogin();
	})
}

//events
const socket = io();
socket.on('helloworld', (data)=>helloworld(data));

function helloworld(data){
	document.getElementById('welcome').innerHTML = data;
}