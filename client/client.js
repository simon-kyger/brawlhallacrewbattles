(function() {

	const socket = io();

	//static templates
	const headert = (login) => {
		return `<div class="container" id="header">
					<div class="row">
						<div class="col-12">
							<a href="https://www.brawlhalla.com" target="_blank">
								<img src="img/blogotop.png" class="mx-auto d-block" style="padding-top: ${login ? 50 : 0}; width:100%; max-width: 500px;">
							</a>
						</div>
					</div>
					<div class="row">
						<div class="col-12" style="text-align: center; color: orange;">
							<a href="https://www.brawlhalla.com" target="_blank">
								<img src="img/crew_battles.png" class="mx-auto d-block" style="width:15%; margin-top: -40; margin-bottom: 40;">
							</a>
						</div>
					</div>
				</div>
		`;
	}

	const footert = () => {
		return `<footer class='container-fluid w-100' id='footer'>
					<div class='row'>
						<div class='col-sm-8 col-md-4' style='white-space:nowrap;'>
							Powered with:
							<a href="https://nodejs.org/en/" target="_blank"><img src="img/sprite.png" style="margin-left:4;" class="node"></a>
							<a href="https://socket.io/" target="_blank"><img src="img/sprite.png" class="socketio"></a>
							<a href="https://www.heroku.com/" target="_blank"><img src="img/sprite.png" class="heroku"></a>
							<a href="https://www.mongodb.com/" target="_blank"><img src="img/sprite.png" style="position: relative; bottom:4;"  class="mongo"></a>
						</div>
						<div class='col-sm-6 col-md-4 text-md-center'>
							<img src='img/sprite.png' class="discord">
							<a href='https://discord.gg/N2q82hb' target='_blank'>https://discord.gg/N2q82hb</a>
						</div>
						<div class='col-md-4 text-md-right'>
							<a href='https://www.github.com' target='_blank'><img src='img/sprite.png' class="github"></a>
							<a href='https://github.com/simon-kyger/brawlhallacrewbattle' target='_blank'>https://github.com/simon-kyger/brawlhallacrewbattle</a>
						</div>
					</div>
				</footer>
		`;
	}

	const loginvid = () => {
		let vidids = [
			`nNF9cPPSwUQ?`, //pugsy wilson
			`cunWS-05m9s?`, //stevenator doppy
			`tQ_Yq7gj42s?start=7`, //isidroo rbrenz
			`LUK5AtT1URY?start=3`, //lilcapped sillygobi
			`-SX2mbt4-f4?start=7`, //ldz crockie
		];
		const randvid = vidids[Math.floor(Math.random() * (vidids.length))];
		return `<iframe id="brawlvid" style="opacity:.7;" src="//www.youtube.com/embed/${randvid}&controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=1" frameborder="0" allowfullscreen></iframe>
		`;
	}

	const passwordModal = () => {
		return `<div class="modal modal-sm fade" id="pwdModal" tabindex="-1" role="dialog" aria-labelledby="pwdModalLabel" aria-hidden="true" style="color: #333;margin:0 auto;">
					<div class="modal-dialog" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" text-center style="margin: 0 auto;">Join private lobby</h5>
							</div>
							<div class="modal-body">
								<div class="row">
									<div class="col">
										<div class="input-group">
											<div class="input-group-prepend">
												<label class="input-group-text" for="password">Room #</label>
											</div>
											<input type="text" class="form-control" aria-label="Room#" placeholder="#00000" id="privPassword" maxlength="5">
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-md-12">
										<p style="font-size: 1vw;" id="passerror">Insert the private room number</p>
									</div>
								</div>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
								<button type="button" class="btn btn-primary" id="privateJoin">Join</button>
							</div>
						</div>
					</div>
				</div>
		`;
	}
	/*const editModal = (data) => { // Edit modal
		return `<div class="modal modal-sm fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true" style="color: #333;margin:0 auto;">
					<div class="modal-dialog" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" text-center style="margin: 0 auto;">Edit lobby</h5>
							</div>
							<div class="modal-body">
								<div class="row">
									<div class="col">
										<div class="input-group">
											<div class="input-group-prepend">
												<label class="input-group-text" for="password">Room #</label>
											</div>
											<input type="text" class="form-control" aria-label="Room#" placeholder="${data}" id="privPassword" maxlength="5">
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-md-12">
										<p style="font-size: 1vw;" id="passerror">Edit room number: </p>
									</div>
								</div>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
								<button type="button" class="btn btn-primary" id="editLobby">Edit</button>
							</div>
						</div>
					</div>
				</div>
		`;
	}*/ 
	const creategamemodal = () => {
		return `<div class="modal fade" id="controlModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="color: black;">
					<div class="modal-dialog" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h4 class="modal-title text-center" id="label" style="margin: 0 auto;">Room settings</h4>
							</div>
							<div class="grid">
								<div class="modal-body" style="font-size: 15px;" id="m-body">
									<div class="row">
										<div class="col">
											<div class="input-group">
												<div class="input-group-prepend">
													<label class="input-group-text" for="inputGroupSelect01" for="room">Room #</label>
												</div>
												<input type="text" class="form-control" aria-label="Room#" placeholder="#00000" id="room" maxlength="5">
											</div>
											<div class="row error">
												<div class="col-md-12">
													<p class="text-danger" id="error"></p>
												</div>
											</div>
										</div>
										<div class="col">
											<select id="priv" class="selectpicker form-control" data-live-search="true" title="Privacy">
												<option>Public</option>
												<option>Private</option>
											</select> 
										</div>
									</div>
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
									<button type="button" class="btn btn-success" id="creating">Create</button>
								</div>
							</div>
						</div>
					</div>
				</div>
		`;
	}

	//onload
	const rendermain = () => {
		document.body.style.margin = 0;
		document.body.style.background = `black`;
		document.body.style.color = `white`;
		document.body.style.fontSize = `40`;
		document.body.style.minheight = `100vh`;

		let div = document.createElement(`div`);
		document.body.appendChild(div);
		div.id = `main`;
		socket.emit("init");
	}
	document.addEventListener("DOMContentLoaded", rendermain);

	const loginpage = (down) => {
		let div = document.getElementById("main");
		div.innerHTML = "";
		div.style.width = `100%`;
		div.style.height = `100%`;
		div.innerHTML = `<wrapper class="d-flex flex-column" style="min-height:100vh;">
							${loginvid()}
							${headert(true)}
							<main class='container' style='flex:1;'>
								<div class='row'>
									<div class='col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-4 offset-lg-4' id='login' align='center' style='font-size: 20; background-color: rgba(0,0,0,.4);box-shadow: 0px 0px 150px 20px rgba(0,0,0,.5)'>
										<form>
											<div style="text-shadow: 0px 0px 8px rgba(255,255,255,.8)">Username: </div>
											<input id="username" style="padding-left: 5px;color: white; background-color: rgba(0,0,0,.4); text-shadow: 0px 0px 8px rgba(255,255,255,1);"></input>
											<div style="padding-top:10; text-shadow: 0px 0px 8px rgba(255,255,255,.8)">Password: </div>
											<input id="password" type="password" style="color: white; background-color: rgba(0,0,0,.4); text-shadow: 0px 0px 8px rgba(255,255,255,1);"></input>
											<div class="row" style="padding-top: 10px;">
												<div class="col">	
													<a id="loginlink" class="btn btn-lg" href="#">Login</a>
												</div>
												<div class="col">
													<a id="registerlink" class="btn btn-lg" href="#">Register</a>
												</div>
											</div>
											<div class="row">
												<div class="col">
													<div id="success">${ down ? `Status: Down for maintenance.` : "Status: Up"}</div>
												</div>
											</div>
										</form>
									</div>
								</div>
							</main>
							${footert()}
						</wrapper>
		`;
		$("#header").hide().fadeIn(1000);
		$("#footer").hide();
		$("#login").hide();
		$("#brawlvid").hide();
		setTimeout(() => {
			$("#footer").fadeIn()
			$("#login").fadeIn(2000)
			$("#brawlvid").fadeIn(3000);
		}, 1000);

		document.getElementById("password").addEventListener("keyup", function(event) {
			event.preventDefault();
			if (event.keyCode === 13)
				document.getElementById("loginlink").click();
		});

		//TODO: debounce these
		document.getElementById("loginlink").addEventListener("click", e => {
			e.preventDefault();
			if (socket.connected){
				const username = document.getElementById("username").value;
				const password = document.getElementById("password").value;
				socket.emit("login", {
					username: username,
					password: password
				});
			}
		})
		document.getElementById("registerlink").addEventListener("click", e => {
			if (socket.connected){
				e.preventDefault();
				const username = document.getElementById("username").value;
				const password = document.getElementById("password").value;
				socket.emit("register", {
					username: username,
					password: password
				});
			}
		})
	}

	socket.on("welcomeheader", data => {
		document.getElementById("loginheadert").innerHTML = data.msg;
	});
	socket.on("usercreated", data => {
		document.getElementById("success").innerHTML = data.msg;
	});
	socket.on("verif", data => {
		if (document.getElementById('error')) {
			document.getElementById('error').innerHTML = data.msg;
		}
	});
	socket.on('passfailed', data => {
		if(document.getElementById("passerror")){
			document.getElementById("passerror").innerHTML = data.msg;
		}	
	});
	socket.on("loginpage", () => loginpage(false));
	socket.on("loginsuccess", data => gamespage(data));

	const gamespage = data => {
		let div = document.getElementById("main");
		div.innerHTML = `<wrapper class="d-flex flex-column" style="min-height:100vh;">
							${headert()}
							<main class="container" style="flex:1;">
								${creategamemodal()}
								${passwordModal()}
								<div class="row">
									<div class="col md-4">
										<div id="loggedin" style="font-size: 20;">Welcome back ${data.username}</div>
									</div>
								</div>
								<div class="row">
									<div class="col md-4">
										<div id="intermediate" style="font-size: 20;"></div>
									</div>
								</div>
								<div class="row">
									<div class="col"></div>
									<div class="col-md-8">Active</div>
								</div>
								<div class="row">
									<div class="col-md-4 col-xs-12">
										<ul id="createjoin" class="list-group">
											<li id="creategame" class="list-group-item" style="font-size: 30px;color: white; background-color: black; padding-left: 30; padding-right: 30; border: 1px solid white; cursor: pointer;" data-toggle="modal" data-target="#controlModal">
												Create
											</li>
											<li id="joingame" class="list-group-item" style="font-size: 30px;color: white; background-color: black; padding-left: 30; padding-right: 30; border: 1px solid white; cursor: pointer;" data-toggle="modal" data-target="#pwdModal">
												Join Private lobby
											</li>
										</ul>
									</div>
									<div class="col-md-8">
										<div id="games" style="font-size:20; background-color: black; min-height:400px; width:100%;border: 1px solid white;"></div>
									</div>
								</div>
							</main>
							${footert()}
						</wrapper>
		`;
		document.getElementById("privateJoin").addEventListener("click", e => {
			let pass = document.getElementById("privPassword").value;
			let reg = /\b\d{5}\b/
			if(reg.test(pass)){
				socket.emit('joingame', {
					priv: pass
				});
			} else {
				document.getElementById("passerror").innerHTML = "Enter a valid room number.";
				document.getElementById("passerror").classList.add("text-danger");
			}
		});
		document.getElementById('creating').addEventListener("click", e => {
			let room = document.getElementById('room');
			let reg = /\b\d{5}\b/; // Verify that the room number is 5 digits, \d = [0-9]

			if (reg.test(room.value)) {
				document.getElementById('error').innerHTML = "";
				let privacy = ((document.getElementById('priv').value === "Private") ? true : false);

				if (privacy) {
					socket.emit('creategame', {
						room: document.getElementById('room').value,
						private: true
					});
				}
				else {
					socket.emit('creategame', {
						room: document.getElementById('room').value,
						private: false
					});
				}

			}
			else {
				document.getElementById('error').innerHTML = "Please, specify a valid room number.";
			}
		});
	}
	socket.on("joingame", data => {
		playgamepage(data);
		$('#controlModal').modal('hide');
		$('#pwdModal').modal('hide');
		//$('#editModal').modal('hide');
		$('body').removeClass('modal-open');
		//$("#editModal").remove();
		$("#controlModal").remove();
		$("#pwdModal").remove();
		$('.modal-backdrop').remove();
	});

	socket.on("notification", data => {
		if (document.getElementById("intermediate")) {
			document.getElementById("intermediate").innerHTML = data;
		}
	});

	socket.on("gamesupdate", data => {
		if (document.getElementById("games")) {
			document.getElementById("games").innerHTML = "";
			for (let i = 0; i < data.length; i++) {
				let game = data[i];
				if(!game.priv){ // Only show if game is public
					let div = `<div class="ga" id='usergame${i}' style="cursor: pointer; white-space:pre-wrap; color: white; background-color: black;">${game.admin}'s Game</div>`;
					document.getElementById("games").innerHTML += div;
				}
			}
			document.querySelectorAll('.ga').forEach((domelem) => {
				domelem.addEventListener('click', (e) => {
					let selectedgame = e.target.textContent;
					selectedgame = selectedgame.substring(0, selectedgame.length - 7);
					socket.emit("joingame", {
						selected: selectedgame
					});
				})
			})
		}
	});

	const renderreset = () => {
		return `<button id="reset" class="btn btn-dark">Reset Game</button>`;
	}

	const renderaddremovestock = (team) => {
		return `<div id="addremovestock" class="col">
					<button id="addstock${team}" class="btn btn-dark" style="width:40px;height: 40px;"><i class="fa fa-plus"></i></button>
					<button id="removestock${team}" class="btn btn-dark" style="width:40px;height: 40px;"><i class="fa fa-minus"></i></button>
				</div>
		`;
	}		

	const playgamepage = data => {
		let div = document.getElementById("main");
		$('.modal-backdrop').remove();
		/*let isAdm = () => { // edit button for later use
			if(data.username == data.game.admin){
				return `
				<div class="row">
						<button id="editgame" class="btn btn-dark" style="width: 28%;" data-toggle="modal" data-target="#editModal">Edit Game</button>
					</div>
				`;
			} else {
				return "";
			}
		}*/
		div.innerHTML = "";
		div.style.width = `100%`;
		let privacy = (data.game.priv) ? "Private" : "Public";
		div.style.height = `100%`;
		div.innerHTML = ``;
		div.innerHTML = `<div id="game" class="container" align="center" style="text-align: left; min-width:500;">
							<div id="loggedin" style="font-size: 20; position: absolute;">Welcome back ${data.username}</div>
							${headert()}
					<div class="row" style="float: right; font-size: 20">
								<div class="col">
									${data.resettable ? renderreset() : ""}
								</div>
								<div class="col">
									<button id="leavegame" class="btn btn-dark">LeaveGame</button>
								</div>
							</div>
							<div class="row" style="font-size:20;">
								<span>${privacy} lobby  <span class="badge badge-info" id="numUsers"> 1 player</span></span>
								
							</div>
							<div class="row" style="font-size:20;">
								<span>Room: &nbsp;</span>
								<span id="roomNumber">${data.game.room}</span>
							</div>
							<div class="row" style="font-size:20;">
								<span>Admin: &nbsp;</span>
								<span id="admin">${data.game.admin}</span>
							</div>
							<div class="row" style="font-size:20;">
								<span>Captains: &nbsp;</span>
								<span id="captains"></span>
							</div>
							<div class="row" style="font-size:20;">
								<span>Currently picking: &nbsp;</span>
								<span id="picking"></span>
							</div>
							<div class="row">
								<div class="col"></div>
								<div class="col">
									<span id="moveleft" class="fa fa-chevron-left" style="cursor:pointer;"></span>
								</div>
								<div class="col"></div>
								<div class="col">
									<span id="moveright" class="fa fa-chevron-right" style="cursor:pointer;"></span>
								</div>
								<div class="col"></div>
							</div>
							<div class="row">
								<div class="col">
									<div>Team1</div>
									<div class="row" style="font-size: 20;">
										<div class="col">Stocks</div> 
										<div id="t1stocks" class="col">${data.game.team1stocks}</div>
										${data.resettable ? renderaddremovestock("t1") : ""}
									</div>
								</div>
								<div class="col">
									<div>Inbound:</div>
									<div style="font-size: 20;">&nbsp;</div>
								</div>
								<div class="col">
									<div>Team2</div>
									<div class="row" style="font-size: 20;">
										<div class="col">Stocks</div> 
										<div id="t2stocks" class="col">${data.game.team2stocks}</div>
										${data.resettable ? renderaddremovestock("t2") : ""}
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col" style="border-bottom: 1px solid white; width: 90%"></div>
								<div class="col" style="border-bottom: 1px solid white; width: 90%"></div>
								<div class="col" style="border-bottom: 1px solid white; width: 90%"></div>
							</div>
							<div id="allplayers" class="row" style="max-height: 800px; max-width: 1600px; overflow: auto;">
								<ul id="team1" class="col" style="list-style-type:none;"></ul>
								<ul id="inbound" class="col" style="list-style-type:none; overflow-x: hidden; overflow-y: auto; max-height:300;"></ul>
								<ul id="team2" class="col" style="list-style-type:none;"></ul>
							</div>
							<div class="row"></div>
						</div>
		`;
		if (document.getElementById("addremovestock")) {
			document.getElementById("addstockt1").addEventListener("click", e => {
				if(document.getElementById("t1stocks").classList.contains('text-danger')){
					document.getElementById("t1stocks").classList.remove('text-danger');
				}
				socket.emit("stockchange", {
					team1stocks: parseInt(document.getElementById("t1stocks").innerHTML) + 1
				});
			});
			document.getElementById("addstockt2").addEventListener("click", e => {
				if(document.getElementById("t2stocks").classList.contains('text-danger')){
					document.getElementById("t2stocks").classList.remove('text-danger');
				}
				socket.emit("stockchange", {
					team2stocks: parseInt(document.getElementById("t2stocks").innerHTML) + 1
				});
			});
			document.getElementById("removestockt1").addEventListener("click", e => {
				if(parseInt(document.getElementById("t1stocks").innerHTML) <= 0){
					if(!document.getElementById("t1stocks").classList.contains('text-danger')){
						document.getElementById("t1stocks").classList.add('text-danger');
					}
				} else {
				socket.emit("stockchange", {
					team1stocks: parseInt(document.getElementById("t1stocks").innerHTML) - 1
				});
				}
			});
			document.getElementById("removestockt2").addEventListener("click", e => {
				if(parseInt(document.getElementById("t2stocks").innerHTML) <= 0){
						if(!document.getElementById("t2stocks").classList.contains('text-danger')){
						document.getElementById("t2stocks").classList.add('text-danger');
					}
				} else {
				socket.emit("stockchange", {
					team2stocks: parseInt(document.getElementById("t2stocks").innerHTML) - 1
				});
				}
			});
		}
		if (document.getElementById("reset")) {
			document.getElementById("reset").addEventListener("click", e => {
				socket.emit("resetgame");
			});
		}
		document.getElementById("leavegame").addEventListener("click", e => {
			socket.emit("leavegame");
		});
	}

	socket.on("stockchange", data => {
		if (document.getElementById("game")) {
			document.getElementById("t1stocks").innerHTML = data.team1;
			document.getElementById("t2stocks").innerHTML = data.team2;
		}
	})

	socket.on("gameupdate", data => {
		if (document.getElementById("game")) {
			document.getElementById("admin").innerHTML = data.admin;
			document.getElementById("picking").innerHTML = data.picking;
			let numPlayers = data.inbound.length + data.team1.length + data.team2.length;
			document.getElementById('numUsers').innerHTML = (numPlayers > 1) ? numPlayers+ " players" : numPlayers + " player";

			setInterval(() => {
				$("#picking").animate({
					opacity: 1.0
				}, 500).animate({
					opacity: .2
				});
			}, 1000);

			document.getElementById("captains").innerHTML = "";
			for (let i = 0; i < data.captains.length; i++) {
				document.getElementById("captains").innerHTML += `${data.captains[i]} `;
			}
			document.getElementById("team1").innerHTML = "";
			for (let i = 0; i < data.team1.length; i++) {
				document.getElementById("team1").innerHTML += `<li class="uclick" style="cursor: pointer;">${data.team1[i]}</li>`;
			}
			document.getElementById("inbound").innerHTML = "";
			for (let i = 0; i < data.inbound.length; i++) {
				document.getElementById("inbound").innerHTML += `<li class="uclick" style="cursor: pointer;">${data.inbound[i]}</li>`;
			}
			document.getElementById("team2").innerHTML = "";
			for (let i = 0; i < data.team2.length; i++) {
				document.getElementById("team2").innerHTML += `<li class="uclick" style="cursor: pointer;">${data.team2[i]}</li>`;
			}
			let userselected = {};
			let clickers = document.getElementsByClassName("uclick");
			for (let i = 0; i < clickers.length; i++) {
				clickers[i].addEventListener("click", e => {
					userselected = {
						username: e.target.textContent,
						container: e.target.parentElement.id
					};
				});
			}
			document.getElementById("moveright").addEventListener("click", e => {
				if (!userselected.username)
					return;
				socket.emit("updategame", {
					selected: userselected.username,
					container: userselected.container,
					movement: "right"
				});
				userselected = {};
			});
			document.getElementById("moveleft").addEventListener("click", e => {
				if (!userselected.username)
					return;
				socket.emit("updategame", {
					selected: userselected.username,
					container: userselected.container,
					movement: "left"
				});
				userselected = {};
			});
		}
	});

	socket.on("disconnect", ()=> {
		loginpage(true);
		const ping = () => {
			if (socket.connected){
				socket.emit("reconnect");
				clearInterval(ping)
			}
		}
		setInterval(ping(), 1000);
	});

	socket.on('reconnect', ()=>{
		if (document.getElementById('success')){
			document.getElementById('success').innerHTML = `Status: Up`;
		}
	})

})();
