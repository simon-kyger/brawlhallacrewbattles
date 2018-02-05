//onload
const socket = io();

const rendermain = () => {
	document.body.style.margin = 0;
	document.body.style.background = `black`;
	document.body.style.color = `white`;
	document.body.style.fontSize = `40`;
	document.body.style.overflow = `hidden`;
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
		<div id='outer' class='container' align='center'>
			<img src='img/blogotop.png' style='padding-top: 50'>
			<div id='loginheader' class='list-group' style='color: orange; width: 400; text-align: center; padding-bottom: 100;'>CREWS</div>
			<div id='inner' style='font-size: 20; width: 400; height: 200; text-align: center;'>
				<div id='success'></div>
				<form id='login' style='margin: 0; padding-top: 24'>
					<div>Username: </div>
					<input id='username' style='color: black;'></input>
					<div style='padding-top:10;'>Password: </div>
					<input id='password' type='password' style='color: black;'></input>
				</form>
				<div style='text-align: left;'>
					<a id='loginlink' href='#' style='margin-left: 80;'>Login</a>
					<a id='registerlink' href='#' style='margin-left: 124;'>Register</a>
				</div>
			</div>
		</div>
		<div id='footer' style='position: fixed; width: 100%; bottom: 0; font-size:12; color:gray;'>
			<div>
				Powered with:
				<a href='https://nodejs.org/en/' target='_blank'><img src='img/node.png' width='40' height='20'></a>
				<a href='https://www.mongodb.com/ target='_blank'><img src='img/mongo.png' width='80' height='20' style='position: relative; bottom:4;'></a>
			</div>
			<div>
				Fork me on 
				<a href='https://www.github.com' target='_blank'><img src='img/github.png' width='20' height='20'></a>
				<a href='https://github.com/simon-kyger/brawlhallacrewbattle' target='_blank'>: https://github.com/simon-kyger/brawlhallacrewbattle</a>
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
		<div id='loggedin' style='font-size: 20;'>
			Welcome back ${data.username}
		</div>
		<div id='outer' align='center'>
			<img id='logo' src='img/blogotop.png'>
			<div id='loginheader' style='color: orange; width: 400; text-align: center; font-size: 40; padding-bottom: 80;'>CREWS</div>
		</div>
		<div id='content' class='container' align='center' style='width: 750;'>
			<div style='width: 38%; text-align: left;'>
				Active
			</div>
			<ul id='createjoin' class='list-group' style='float:left; margin-bottom: 0;'>
				<li id='creategame' class='list-group-item' style='color: white; background-color: black; padding-left: 30; padding-right: 30; border: 1px solid white; cursor: pointer;'>
					Create
				</li>
				<li id='joingame' class='list-group-item' style='color: white; background-color: black; padding-left: 30; padding-right: 30; border: 1px solid white; cursor: pointer;'>
					Join
				</li>
			</ul>
			<form>
				<select id='games' size='8' style='width: 500; height: 400; float: right; font-size:20; background-color: black;'>
					<option class='list-group-item' style='white-space:pre-wrap; color: white; background-color: black;'>Rob's game</option>
					<option class='list-group-item' style='white-space:pre-wrap; color: white; background-color: black;'>Simon's game</option>
					<option class='list-group-item' style='white-space:pre-wrap; color: white; background-color: black;'>Jeremy's game</option>
					<option class='list-group-item' style='white-space:pre-wrap; color: white; background-color: black;'>Hell yes's game</option>
					<option class='list-group-item' style='white-space:pre-wrap; color: white; background-color: black;'>Steve's game</option>
					<option class='list-group-item' style='white-space:pre-wrap; color: white; background-color: black;'>Some random dude with a really obnoxiously long name's game</option>
					<option class='list-group-item' style='white-space:pre-wrap; color: white; background-color: black;'>etc</option>
				</select>
			</form>
		</div>
		<div id='footer' style='position: fixed; width: 100%; bottom: 0; font-size:12; color:gray;'>
			<div>
				Powered with:
				<a href='https://nodejs.org/en/' target='_blank'><img src='img/node.png' width='40' height='20'></a>
				<a href='https://www.mongodb.com/ target='_blank'><img src='img/mongo.png' width='80' height='20' style='position: relative; bottom:4;'></a>
			</div>
			<div>
				Fork me on 
				<a href='https://www.github.com' target='_blank'><img src='img/github.png' width='20' height='20'></a>
				<a href='https://github.com/simon-kyger/brawlhallacrewbattle' target='_blank'>: https://github.com/simon-kyger/brawlhallacrewbattle</a>
			</div>
		</div>
	`;
	document.getElementById('creategame').addEventListener('click', e=>{
		creategame();
	});
	document.getElementById('joingame').addEventListener('click', e=>{
		const selectedgame = document.getElementById('games').options[e.selectedIndex].value;
		joingame(selectedgame);
	});
}

const creategame = () => {

}

const joingame = game => {

}