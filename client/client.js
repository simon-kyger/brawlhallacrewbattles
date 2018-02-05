//onload
const socket = io();

const rendermain = () => {
	document.body.style.margin = 0;
	document.body.style.background = `black`;
	let div = document.createElement(`div`);
	document.body.appendChild(div);
	div.id = `main`;
	renderlogin();
}

document.addEventListener('DOMContentLoaded', rendermain);

const renderlogin = (arg) => {
	let div = document.getElementById('main');
	div.innerHTML = '';
	div.style.width = `100%`;
	div.style.height = `100%`;
	div.innerHTML = `
		<div id='outer' style='position: relative; top: 20%; left: 40%; font-family: junction;'>
			<img id='logo' src='img/blogotop.png'>
			<div id='loginheader' style='color: orange; width: 400; text-align: center; font-size: 40; padding-bottom: 20;'>CREWS</div>
			<div id='inner' style='background: orange; width: 400; height: 200; text-align: center;'>
				<div id='success'></div>
				<form id='login' style='margin: 0; padding-top: 24'>
					<div>Username: </div>
					<input id='username'></input>
					<div style='padding-top:10;'>Password: </div>
					<input id='password'></input>
				</form>
				<div style='padding-top: 30; padding-left: 100; text-align: left; width: 50%;'>
					<a id='loginlink' href='#'>Login</a>
					<a id='registerlink' href='#' style='float: right;'>Register</a>
				</div>
			</div>
		</div>
	`;
	document.getElementById('loginlink').addEventListener('click', e=>{
		e.preventDefault();
		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;
		login({
			username: username,
			password: password
		});
	})
	document.getElementById('registerlink').addEventListener('click', e=>{
		e.preventDefault();
		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;
		register({
			username: username,
			password: password
		});
	})
}

//client events
const login = data => {
	socket.emit('login', {
		username: data.username,
		password: data.password
	});
}

const register = data => {
	socket.emit('register', {
		username: data.username,
		password: data.password
	});
}

//post server events
socket.on('welcomeheader', data => welcomeheader(data));
socket.on('loginfailure', data => {
	document.getElementById('success').innerHTML = data.msg;
});
socket.on('usercreated', data => {
	document.getElementById('success').innerHTML = data.msg;
});
socket.on('loginsuccess', data => gamespage(data));

const welcomeheader = data => {
	document.getElementById('loginheader').innerHTML = data.msg;
}

const loginfailure = data => {
	document.getElementById('loginheader').innerHTML = data.msg;
}

const gamespage = data => {
	let div = document.getElementById('main');
	div.innerHTML = '';
	div.style.width = `100%`;
	div.style.height = `100%`;
	div.innerHTML = `
		<div id='outer' style='position: relative; top: 20%; left: 40%; font-family: junction;'>
			<img id='logo' src='img/blogotop.png'>
			<div id='loginheader' style='color: orange; width: 400; text-align: center; font-size: 40; padding-bottom: 20;'>CREWS</div>
			<div id='inner' style='background: orange; width: 400; height: 200; text-align: center;'>
				Successfully logged in as: ${data.username}
			</div>
		</div>
	`;
}