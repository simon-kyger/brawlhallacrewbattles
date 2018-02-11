const express = require(`express`);
const http = require(`http`);
const path = require(`path`);
const mongo = require(`mongodb`).MongoClient;
const ioserver = require(`socket.io`);
const sanitize = require(`mongo-sanitize`);

const app = express();
const server = http.Server(app);
const io = ioserver(server);
const serverport = process.env.PORT || 8080;
const dbport = process.env.DBPORT || 27017;
let sessions = {};
let games = [];

app.use('/', express.static(path.join(__dirname, '../client')));
server.listen(serverport);
console.log(`Server listening on port: ${serverport}`);

mongo.connect(`mongodb://localhost:${dbport}/server`, (err, database)=>{
	if (err) throw err;

	console.log(`Mongodb is listening on port: ${dbport}`);

	let db = database.db('brawlhallacrewdb');
	io.sockets.on('connection', socket =>{
		init(socket);
		socket.on('login', (data)=>login(socket, db, data));
		socket.on('register', (data)=>register(socket, db, data));
		socket.on('disconnect', ()=>disconnect(socket));
		socket.on('getgames', ()=>getgames(socket));
		socket.on('creategame', ()=>creategame(socket));
		socket.on('joingame', (data)=>joingame(socket, data));
		socket.on('updategame', (data)=>updategame(socket, data));
	});
});

//void
const init = socket =>{
	//
}

//returns string
const getusername = socket => {
	return Object.keys(sessions).find(key => sessions[key] === socket);
}

//returns boolean
const checkifadmin = socket => {
	let username = getusername(socket);
	for (let i=0; i<games.length; i++){
		let game = games[i];
		if (game.admin == username){
			return true;
		}
	}
	return false;
}

//returns boolean
const checkifcaptain = socket => {
	let username = getusername(socket);
	for (let i=0; i<games.length; i++){
		let game = games[i];
		if((game.captains[0] == username) || (game.captains[1] == username)){
			return true;
		}
	}
	return false;
}

//void
const joingame = (socket, data) => {
	let username = getusername(socket);
	for (let i=0; i<games.length; i++){
		let game = games[i];
		if(game.admin == data){
			game.inbound.push(username);
			socket.emit('joingame', {
				username: username,
				game: game
			});
			io.sockets.emit('gameupdate', game);
			break;
		}
	}
}

const findgame = (socket) => {
	for (let i=0; i<games.length; i++){
		let game = games[i];
		if (game.admin == getusername(socket))
			return game;
		if ((game.captains[0] == getusername(socket)) || (game.captains[1]) == getusername(socket))
			return game;
		for (let j=0; j<game.inbound.length; j++){
			if(game.inbound[j] == getusername(socket))
				return game;
		}
	}
}

//void
const updategame = (socket, data) =>{
	let game = findgame(socket);
	let username = getusername(socket);
	//if captains pick
	if (game.phase){
		if (game.picking == username){
			if(data.movement == 'left'){
				if(data.selected == game.team2[game.team2.indexOf(data.selected)]){
					game.team2.splice(game.team2.indexOf(data.selected), 1);
					game.inbound.push(data.selected);
				} else {
					game.inbound.splice(game.inbound.indexOf(data.selected), 1);
					game.team1.push(data.selected);
				}
			}
			if(data.movement == 'right'){
				if(data.selected == game.team1[game.team1.indexOf(data.selected)]){
					game.team1.splice(game.team1.indexOf(data.selected), 1);
					game.inbound.push(data.selected);
				} else {
					game.inbound.splice(game.inbound.indexOf(data.selected), 1);
					game.team2.push(data.selected);
				}
			}

			if (game.captains.indexOf(username)){
				game.picking = game.captains[0];
			} else {
				game.picking = game.captains[1];
			}
		}
	} else if ((game.admin == username) && !game.phase){
		//admin control only
		if(data.movement == 'left'){
			if(data.selected == game.team2[game.team2.indexOf(data.selected)]){
				game.team2.splice(game.team2.indexOf(data.selected), 1);
				game.inbound.push(data.selected);
			} else {
				game.inbound.splice(game.inbound.indexOf(data.selected), 1);
				game.team1.push(data.selected);
			}
		}
		if(data.movement == 'right'){
			if(data.selected == game.team1[game.team1.indexOf(data.selected)]){
				game.team1.splice(game.team1.indexOf(data.selected), 1);
				game.inbound.push(data.selected);
			} else {
				game.inbound.splice(game.inbound.indexOf(data.selected), 1);
				game.team2.push(data.selected);
			}
		}
	} else {
		return;
	}
	if (game.team1.length && game.team2.length && !game.phase){
		game.captains[0] = game.team1[0];
		game.captains[1] = game.team2[0];
		game.phase = true;
		game.picking = game.captains[0];
	}
	io.sockets.emit('gameupdate', game);
}

//void
const creategame = socket => {
	if (checkifadmin(socket))
		return;
	const username = getusername(socket);
	const game = {
		admin: username,
		captains: [],
		team1: [],
		inbound: [username],
		team2: [],
		phase: false,
		picking: username,
	};
	games.push(game);
	socket.emit('joingame', {
		username: username,
		game: game
	});
	io.sockets.emit('gamesupdate', games);
	setTimeout(()=>{
		socket.emit('gameupdate', game)
	}, 0);
}

//void
const disconnect = socket => {
	//game cleanup
	let username = getusername(socket);
	if (username){
		for (let i=0; i<games.length; i++){
			let game = games[i];
			if (game.admin == username){
				let team1 = game.team1;
				let team2 = game.team2;
				let inbound = game.inbound;
				game.admin = 'Admin left, please leave the game.'
				for(let j=0; j<team1.length; j++){
					if(sessions[team1[j]])
						sessions[team1[j]].emit('gameupdate', game);
				}
				for(let j=0; j<team2.length; j++){
					if(sessions[team2[j]])
						sessions[team2[j]].emit('gameupdate', game);
				}
				for(let j=0; j<inbound.length; j++){
					if(sessions[inbound[j]])
						sessions[inbound[j]].emit('gameupdate', game);
				}
				games.splice(i, 1);
				io.sockets.emit('gamesupdate', games);
			}
			let team1 = game.team1;
			let team2 = game.team2;
			let inbound = game.inbound;
			for(let j=0; j<team1.length; j++){
				if (team1[j] == username){
					team1.splice(j, 1);
					io.sockets.emit('gameupdate', game);
				}
			}
			for(let j=0; j<team2.length; j++){
				if (team2[j] == username){
					team2.splice(j, 1);
					io.sockets.emit('gameupdate', game);
				}
			}
			for(let j=0; j<inbound.length; j++){
				if (inbound[j] == username){
					inbound.splice(j, 1);
					io.sockets.emit('gameupdate', game);
				}
			}
		}
	}

	//session cleanup
	for(let user in sessions){
		if (socket == sessions[user]){
			delete sessions[user];
			break;
		}
	}
}

//void
const login = (socket, db, data) => {
	if(!data.username){
		socket.emit('usercreated', {
			msg: `Enter a valid username.`
		});
		return;
	}
	if (!data.password){
		socket.emit('usercreated', {
			msg: `Enter a valid password.`
		});
		return;
	}

	let users = db.collection('users');

	let query = sanitize(data);

	users.findOne({username: query.username, password: query.password}).then(res=>{
		if(!res){
			socket.emit('usercreated', {
				msg: `Unknown user and/or password combination.`
			});
			return;
		}
		for(let users in sessions){
			if(sessions[users] == sessions[res.username]){
				socket.emit('usercreated',{
					msg: `User is already signed in.`
				});
				return;
			}
		}
		sessions[res.username] = socket;
		socket.emit('loginsuccess', {
			username: res.username,
			wins: res.wins,
			losses: res.losses
		});
		socket.emit('gamesupdate', games);
	})
}

//void
const register = (socket, db, data) => {
	if(!data.username){
		socket.emit('usercreated', {
			msg: `Enter a new username to register.`
		});
		return;
	}
	if (!data.password){
		socket.emit('usercreated', {
			msg: `Enter a password.`
		});
		return;
	}

	let users = db.collection('users');
	
	let query = sanitize(data);

	users.findOne({username: query.username}).then(res=>{
		if (res){
			socket.emit('usercreated', {
				msg: `User: ${query.username} already exists.`
			});
			return;
		}

		users.insert({username: query.username, password: query.password, wins: 0, losses: 0}, (err, user)=>{
			if (err){
				socket.emit('usercreated', {
					msg: `DB is having issues. Please contact admin.`
				});
				return;
			}
			socket.emit('usercreated', {
				msg: `User ${query.username} has been created.`
			});
		});
	})
}