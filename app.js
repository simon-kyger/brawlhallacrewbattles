const express = require(`express`);
const http = require(`http`);
const path = require(`path`);
const mongo = require(`mongodb`).MongoClient;
const ioserver = require(`socket.io`);
const sanitize = require(`mongo-sanitize`);
const bcrypt = require('bcrypt');
const config = require('config');
const sslredirect = require('heroku-ssl-redirect');

const app = express();
const server = http.Server(app);
const io = ioserver(server);
const serverport = process.env.PORT || 80;
const dbport = process.env.DBPORT || 27017;
const dbname = process.env.DBNAME || config.get('admin.dbconfig.name') || `brawlhallacrewdb`;
const dburl = process.env.MONGODB_URI || config.get('admin.dbconfig.host') || `mongodb://localhost:${dbport}`;
let sessions = {};
let games = [];

app.use(sslredirect());
app.use('/', express.static(path.join(__dirname, '/client')));
server.listen(serverport);
console.log(`Server listening on port: ${serverport}`);
mongo.connect(dburl, (err, database) => {
	if (err) throw err;

	console.log(`Mongodb is listening.`);

	let db = database.db(dbname);
	io.sockets.on('connection', socket => {
		socket.on('init', () => init(socket));
		socket.on('login', (data) => login(socket, db, data));
		socket.on('register', (data) => register(socket, db, data));
		socket.on('disconnect', () => disconnect(socket));
		socket.on('creategame', (data) => creategame(socket, data));
		socket.on('joingame', (data) => joingame(socket, data));
		socket.on('updategame', (data) => updategame(socket, data));
		socket.on('resetgame', () => resetgame(socket));
		socket.on('leavegame', () => leavegame(socket));
		socket.on('stockchange', (data) => stockchange(socket, data));
		socket.on('reconnect', ()=> reconnect(socket));
	});
});

//returns string
const getusername = socket => Object.keys(sessions).find(key => sessions[key] === socket)

//returns boolean
const checkroomnumexists = roomnumber => Boolean(games.find(game=> game.room === roomnumber))

//returns boolean
const checkifadmin = socket => Boolean(games.find(game=> game.admin === getusername(socket)))

//returns obj
const findgamebyid = args => games.find(game=> game.room === args)

//returns obj
const findgamebysocket = socket => games.find(game => game.inbound.concat(game.team1, game.team2).some(user => user === getusername(socket)));

//generates a game object
const gamefactory = (username, roomnum, privacy) => {
	return {
		admin: username,
		captains: [],
		team1: [],
		team1stocks: 10,
		inbound: [username],
		team2: [],
		team2stocks: 10,
		phase: false,
		room: roomnum,
		priv: (privacy) ? true : false
	};
}

//void
const init = socket => {
	socket.emit('loginpage');
}

//void
const reconnect = socket => {
	socket.emit('reconnect');
}

//void
const joingame = (socket, data) => {
	let username = getusername(socket);
	if (!username) return;
	let game;
	if (data.pass){
		let reg = /\b\d{5}\b/; // Verify that the room number is 5 digits, \d = [0-9]
		if (!reg.test(data.pass)) return;
		game = findgamebyid(data.pass);
	} else {
		game = findgamebysocket(sessions[data.selected]);
	}
	if (!game) {
		socket.emit('passfailed', { msg: "No room found by that #." });
		return;
	}
	game.inbound.push(username);
	socket.emit('joingame', {
		username: username,
		game: game,
	});
	game.inbound.concat(game.team1, game.team2).forEach(i=>{
		sessions[i].emit('gameupdate', game);
	})
}

//void
const leavegame = socket => {
	let game = findgamebysocket(socket);
	let username = getusername(socket);
	if (!game || !username) return;
	if (game.admin == username) {
		game.inbound.concat(game.team1, game.team2).forEach(i=>{
			sessions[i].emit('loginsuccess', { username: i });
			sessions[i].emit('notification', `Game admin ${game.admin} left the game.`);
		});
		games.splice(games.indexOf(game), 1);
	}
	else {
		if (game.inbound.indexOf(username) !== -1) game.inbound.splice(game.inbound.indexOf(username), 1);
		if (game.team1.indexOf(username) !== -1) game.team1.splice(game.team1.indexOf(username), 1);
		if (game.team2.indexOf(username) !== -1) game.team2.splice(game.team2.indexOf(username), 1);

		game.team1.length ? game.captains[0] = game.team1[0] : game.captains[0] = '';
		game.team2.length ? game.captains[1] = game.team2[0] : game.captains[1] = '';
		(game.team1.length && game.team2.length) ? game.phase = true : game.phase = false;

		game.inbound.concat(game.team1, game.team2).forEach(i=>{
			sessions[i].emit('gameupdate', game);
		});

		socket.emit('loginsuccess', { username: username });
	}
	io.sockets.emit('gamesupdate', games);
}

//void
const resetgame = socket => {
	let game = findgamebysocket(socket);
	let username = getusername(socket);
	if (!game || !username) return;
	if (game.admin !== username) return;

	const ngame = gamefactory(username, game.room, game.priv);
	game.inbound.concat(game.team1, game.team2).forEach(i=>{
		if(i !== game.admin)
			ngame.inbound.push(i)
	})

	for (let i = 0; i < games.length; i++) {
		if (games[i].admin == username) {
			games[i] = ngame;
			break;
		}
	}
	for (let i = 0; i < ngame.inbound.length; i++) {
		sessions[ngame.inbound[i]].emit('gameupdate', ngame);
	}
}

//void
const creategame = (socket, data) => {
	let reg = /\b\d{5}\b/; // Verify that the room number is 5 digits, \d = [0-9]
	if (!reg.test(data.room)) return;
	
	if (checkifadmin(socket)) return;
	const username = getusername(socket);
	if (!username) return;

	if (checkroomnumexists(data.room)) {
		socket.emit('verif', { msg: "A crew battle already uses this room number." });
		return;
	}
	const game = gamefactory(username, data.room, data.private);
	games.push(game);
	socket.emit('joingame', {
		username: username,
		game: game,
		resettable: true
	});
	io.sockets.emit('gamesupdate', games);
	setTimeout(() => {
		socket.emit('gameupdate', game)
	}, 0);
}

//void
const disconnect = socket => {
	let game = findgamebysocket(socket);
	if (game)
		leavegame(socket)

	//session cleanup
	for (let user in sessions) {
		if (socket == sessions[user]) {
			delete sessions[user];
			break;
		}
	}
}

//void
const login = (socket, db, data) => {
	if (!data.username) {
		socket.emit('usercreated', {
			msg: `Enter a valid username.`
		});
		return;
	}
	if (!data.password) {
		socket.emit('usercreated', {
			msg: `Enter a valid password.`
		});
		return;
	}

	let users = db.collection('users');

	let query = sanitize(data);

	users.findOne({ username: query.username }).then(res => {
		if (!res) {
			socket.emit('usercreated', {
				msg: `Incorrect username and or password.`
			});
			return;
		}
		socket.emit('usercreated', {
			msg: `Logging in...`
		});

		const a = query.username + query.password;
		const h = res.password;

		bcrypt.compare(a, h, (err, res2) => {
			for (let user in sessions) {
				if (user == res.username) {
					socket.emit('usercreated', {
						msg: `User is already signed in.`
					});
					return;
				}
			}
			if (res2) {
				sessions[res.username] = socket;
				socket.emit('loginsuccess', {
					username: res.username,
					wins: res.wins,
					losses: res.losses
				});
				socket.emit('gamesupdate', games);
			}
			else {
				socket.emit('usercreated', {
					msg: `Incorrect username and or password.`
				});
			}
		})
	})
}

//void
const register = (socket, db, data) => {
	if (!data.username) {
		socket.emit('usercreated', {
			msg: `Enter a new username to register.`
		});
		return;
	}
	if (!data.password) {
		socket.emit('usercreated', {
			msg: `Enter a password.`
		});
		return;
	}
	if ((data.username.indexOf("<") > -1) || (data.username.indexOf(">") > -1) || (data.username.indexOf('&') > -1)) {
		socket.emit('usercreated', {
			msg: `Characters <, >, and & are not permitted in usernames. Choose a new name.`
		});
		return;
	}

	let users = db.collection('users');

	let query = sanitize(data);
	const h = query.username + query.password;
	bcrypt.hash(h, 13, (err, hash) => {
		users.findOne({ username: query.username }).then(res => {
			if (res) {
				socket.emit('usercreated', {
					msg: `User: ${query.username} already exists.`
				});
				return;
			}
			users.insert({ username: query.username, password: hash, wins: 0, losses: 0 }, (err, user) => {
				if (err) {
					socket.emit('usercreated', {
						msg: `DB is having issues. Please contact admin.`
					});
					return;
				}
				socket.emit('usercreated', {
					msg: `User ${query.username} has been created.`
				});
			});
		});
	});
}

//void
const stockchange = (socket, data) => {
	if (!checkifadmin(socket))
		return;
	let game = findgamebysocket(socket);
	if (!game) return;
	if (Number.isInteger(data.team1stocks)) game.team1stocks = data.team1stocks;
	if (Number.isInteger(data.team2stocks)) game.team2stocks = data.team2stocks;
	game.inbound.concat(game.team1, game.team2).forEach(i=>{
		sessions[i].emit('stockchange', {
			team1: game.team1stocks,
			team2: game.team2stocks
		});
	});
}

//void
//data type obj:
// {
//		player: usernameoftargetbeingmoved
// 		tocontainer: containernamemovedto
// 		fromcontainer: containernamemovedfrom
// }
const updategame = (socket, data) => {
	let game = findgamebysocket(socket);
	let username = getusername(socket);
	if (!game || !username) return;

	//validations of data
	let reg = /^(team1|team2|inbound|)$/;
	if (!reg.test(data.fromcontainer)) return;
	if (!reg.test(data.tocontainer)) return;
	if (game[data.tocontainer].find(i=> i === data.player)) return;
	if (!game[data.fromcontainer].find(i=> i === data.player)) return;

	//game logic
	
	if (username == game.admin){
		game[data.fromcontainer].splice(game[data.fromcontainer].indexOf(data.player), 1);
		game[data.tocontainer].push(data.player);
	} else if ((game.phase) && (username == game.captains[0] || username == game.captains[1])){
		if (username == game.captains[0]){
			if (data.tocontainer == 'team2' || data.fromcontainer == 'team2')
				return;
		}
		if (username == game.captains[1]){
			if (data.tocontainer == 'team1' || data.fromcontainer == 'team1')
				return;
		}
		game[data.fromcontainer].splice(game[data.fromcontainer].indexOf(data.player), 1);
		game[data.tocontainer].push(data.player);
	} else {
		return;
	}

	game.team1.length ? game.captains[0] = game.team1[0] : game.captains[0] = '';
	game.team2.length ? game.captains[1] = game.team2[0] : game.captains[1] = '';

	(game.team1.length && game.team2.length) ? game.phase = true : game.phase = false;

	game.inbound.concat(game.team1, game.team2).forEach(i=>{
		sessions[i].emit('gameupdate', game)
	});
}