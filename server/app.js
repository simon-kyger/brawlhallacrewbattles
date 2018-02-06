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
let games = {};

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
	});
});

const init = socket =>{
	//
}

const creategame = socket => {
	let username;
	for (let users in sessions){
		if(sessions[users] == socket){
			username = users;
		}
	}
	games[username] = {};
	io.sockets.emit('gamecreated', games);
	socket.emit('creategame', {username: username})
}

const getgames = socket => {

}

const disconnect = socket => {
	for(let user in sessions){
		if (socket == sessions[user]){
			delete sessions[user];
			break;
		}
	}
}

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
		sessions[res.username] = socket;
		socket.emit('loginsuccess', {
			username: res.username,
			wins: res.wins,
			losses: res.losses
		});
	})
}

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