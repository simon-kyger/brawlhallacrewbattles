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
						<div class='col-md-4' style='white-space:nowrap;'>
							Powered with:
							<a href="https://nodejs.org/en/" target="_blank"><img src="img/sprite.png" style="margin-left:4;" class="node"></a>
							<a href="https://socket.io/" target="_blank"><img src="img/sprite.png" class="socketio"></a>
							<a href="https://www.heroku.com/" target="_blank"><img src="img/sprite.png" class="heroku"></a>
							<a href="https://www.mongodb.com/" target="_blank"><img src="img/sprite.png" style="position: relative; bottom:4;"  class="mongo"></a>
						</div>
						<div class='col-md-4 text-md-center'>
							<img src='img/sprite.png' class="discord">
							<a href='https://discord.gg/N2q82hb' target='_blank'>https://discord.gg/N2q82hb</a>
						</div>
						<div class='col-md-4 text-md-right'>
							<a href='https://www.github.com' target='_blank'><img src='img/sprite.png' class="github"></a>
							<a href='https://github.com/simon-kyger/brawlhallacrewbattles' target='_blank'>https://github.com/simon-kyger/brawlhallacrewbattles</a>
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
										<p id="passerror">Insert the private room number</p>
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
								<div class="modal-body" id="m-body">
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
									<div class='col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-4 offset-lg-4' id='login' align='center' style='background-color: rgba(0,0,0,.4);box-shadow: 0px 0px 150px 20px rgba(0,0,0,.5)'>
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
			document.getElementById("passerror").classList.add("text-danger");
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
										<div id="loggedin">Welcome back ${data.username}</div>
									</div>
								</div>
								<div class="row">
									<div class="col md-4">
										<div id="intermediate"></div>
									</div>
								</div>
								<div class="row">
									<div class="col"></div>
									<div class="col-md-8 display-4">Active</div>
								</div>
								<div class="row">
									<div class="col-md-4 col-xs-12">
										<ul id="createjoin" class="list-group">
											<button id="creategame" class="createjoin btn btn-dark" data-toggle="modal" data-target="#controlModal">
												Create
											</button>
											<button id="joingame" class="createjoin btn btn-dark" data-toggle="modal" data-target="#pwdModal">
												Join Private Lobby
											</button>
										</ul>
									</div>
									<div class="col-md-8">
										<div id="games" style="background-color: black; width:100%;border: 1px solid #343a40; height:500px;"></div>
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
					pass: pass
				});
			} else {
				document.getElementById("passerror").innerHTML = "Enter a valid 5 digit numeric room number.";
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
						room: room.value,
						private: true
					});
				}
				else {
					socket.emit('creategame', {
						room: room.value,
						private: false
					});
				}

			}
			else {
				document.getElementById('error').innerHTML = "Enter a valid 5 digit numeric room number.";
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
				let c;
				(i % 2 == 0) ? c='uclick' : c='uclick dark'; 
				let div = `<div class="${c} ga btn btn-dark brawlplayer">${data[i].admin}'s Game</div>`;
				document.getElementById("games").innerHTML += div;
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
		return `<button id="reset" class="black btn btn-dark float-right">Reset Game</button>`;
	}

	const renderaddremovestock = (team) => {
		return `<div id="addremovestock" class="btn-group" style="display: flex; flex: 1;">
					<button id="addstock${team}" class="black btn btn-dark" style="flex:1;"><i class="fa fa-plus"></i></button>
					<button id="removestock${team}" class="black btn btn-dark" style="flex:1;"><i class="fa fa-minus"></i></button>
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
		div.innerHTML = `<wrapper class="d-flex flex-column" style="min-height:100vh;">
							${headert()}
							<main id="game" class="container" style="flex:1; min-width: 440px;">
								<div class="row">
									<div class="col">
										<div class="row">
											<span id="loggedin">Welcome back ${data.username}</span>
										</div>
										<div class="row">
											<span>${privacy} lobby  <span class="badge badge-info" id="numUsers"> 1 player</span></span>
										</div>
										<div class="row">
											<span>Room: &nbsp;</span>
											<span id="roomNumber">${data.game.room}</span>
										</div>
										<div class="row">
											<span>Admin: &nbsp;</span>
											<span id="admin">${data.game.admin}</span>
										</div>
										<div class="row">
											<span>Captains: &nbsp;</span>
											<span id="captains"></span>
										</div>
									</div>
									<div class="col">
										<div class="row float-right">
											<div class="col">
												${data.resettable ? renderreset() : ""}
											</div>
											<div class="col">
												<button id="leavegame" class="black leave btn btn-dark float-right">LeaveGame</button>
											</div>
										</div>
									</div>
								</div>
								<div class="row" style='display: flex;'>
									<div class='display-4' style='flex:1;'>Team1</div>
									<div class='display-4' style='flex:1;'>Inbound</div>
									<div class='display-4' style='flex:1;'>Team2</div>
								</div>
								<div class="row" style="display: flex;">
									<div style="flex: 1; display: flex;">
										<div class='stocks'>Stocks: </div>
										<span id='t1stocks' class='stocks'> ${data.game.team1stocks} </span>
										${renderaddremovestock("t1")}
									</div>
									<div id="moveleftright" class='btn-group' style="flex: 1; display: flex;">
										<button id="moveleft" class="black btn btn-dark" style='flex:1;'><i class="fa fa-chevron-left"></i></button>
										<button id="moveright" class="black btn btn-dark" style='flex:1;'><i class="fa fa-chevron-right"></i></button>
									</div>
									<div style="flex: 1; display: flex;">
										<div class='stocks'>Stocks: </div>
										<span id='t2stocks' class='stocks'> ${data.game.team2stocks} </span>
										${renderaddremovestock("t2")}
									</div>
								</div>
								<div id="allplayers" class="row" style="overflow: visible; min-height: 300px; border: 1px solid #32383e;">
									<ul id="team1" class="col" style='overflow-y: auto;margin:0; padding:0; border: 1px solid #32383e;'></ul>
									<ul id="inbound" class="col" style="overflow-y: auto;margin:0; padding: 0; border: 1px solid #32383e;"></ul>
									<ul id="team2" class="col" style='overflow-y: auto;margin:0; padding: 0; border: 1px solid #32383e;'></ul>
								</div>
							</main>
							${footert()}
						</wrapper>
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
		document.getElementById("moveright").addEventListener("click", e=>{
			let userselected = {
				player: document.getElementById('moveleftright').getAttribute('player'),
				fromcontainer: document.getElementById('moveleftright').getAttribute('container')
			}
			if (!userselected.player || !userselected.fromcontainer) 
				return;
			if (userselected.fromcontainer == 'team2') 
				return;
			userselected.fromcontainer == 'inbound' ? userselected.tocontainer = 'team2' : userselected.tocontainer = 'inbound';
			document.getElementById('moveleftright').setAttribute('container', userselected.tocontainer)
			socket.emit("updategame", userselected);
		});
		document.getElementById("moveleft").addEventListener("click", e=>{
			let userselected = {
				player: document.getElementById('moveleftright').getAttribute('player'),
				fromcontainer: document.getElementById('moveleftright').getAttribute('container')
			}
			if (!userselected.player || !userselected.fromcontainer) 
				return;
			if (userselected.fromcontainer == 'team1') 
				return;
			userselected.fromcontainer == 'inbound' ? userselected.tocontainer = 'team1' : userselected.tocontainer = 'inbound';
			document.getElementById('moveleftright').setAttribute('container', userselected.tocontainer)
			socket.emit("updategame", userselected);
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
			let numPlayers = data.inbound.length + data.team1.length + data.team2.length;
			document.getElementById('numUsers').innerHTML = (numPlayers > 1) ? numPlayers+ " players" : numPlayers + " player";

			document.getElementById("captains").innerHTML = "";
			for (let i = 0; i < data.captains.length; i++) {
				document.getElementById("captains").innerHTML += `${data.captains[i]} `;
			}
			document.getElementById("team1").innerHTML = "";
			for (let i = 0; i < data.team1.length; i++) {
				let c;
				(i % 2 == 0) ? c='uclick' : c='uclick dark'; 
				document.getElementById("team1").innerHTML += `<li class="${c} draggable btn btn-dark brawlplayer">${data.team1[i]}</li>`;
			}
			document.getElementById("inbound").innerHTML = "";
			for (let i = 0; i < data.inbound.length; i++) {
				let c;
				(i % 2 == 0) ? c='uclick' : c='uclick dark'; 
				document.getElementById("inbound").innerHTML += `<li class="${c} draggable btn btn-dark brawlplayer">${data.inbound[i]}</li>`;
			}
			document.getElementById("team2").innerHTML = "";
			for (let i = 0; i < data.team2.length; i++) {
				let c;
				(i % 2 == 0) ? c='uclick' : c='uclick dark'; 
				document.getElementById("team2").innerHTML += `<li class="${c} draggable btn btn-dark brawlplayer">${data.team2[i]}</li>`;
			}

			let clickers = document.getElementsByClassName("uclick");

			for (let i = 0; i < clickers.length; i++) {
				clickers[i].addEventListener("click", e=>{
					document.getElementById('moveleftright').setAttribute('player', e.target.textContent)
					document.getElementById('moveleftright').setAttribute('container', e.target.parentElement.id)
				})
			}

			$('.uclick').draggable({ 
				opacity: 0.7,
    			helper: 'clone',
    			scroll: false,
    			revert: 'invalid',
    			appendTo: $('#main'),
				helper: function(e) {
					let original = $(e.target).hasClass("ui-draggable") ? $(e.target) :  $(e.target).closest(".ui-draggable");
					return original.clone().css({
						width: original.width()
					});                
				},
			});
			$('#team1, #team2, #inbound').droppable({
				accept: '.draggable',
				drop: function(event, ui){
					$(this).css('border', '1px solid black')
					$('#inbound').css({
						'border-left': '1px solid #32383e', 
						'border-right': '1px solid #32383e'
					});
					let self = this;
					userselected = {
						player: ui.draggable[0].textContent,
						tocontainer: self.id,
						fromcontainer: ui.draggable[0].parentElement.id
					}
					socket.emit("updategame", userselected);
					userselected = {};
				},
				over: function(ev, el){
					$(this).css('border', '1px solid #dee2e6');
				},
				out: function(ev, el){
					$(this).css('border', '1px solid #32383e')
				}
			})
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
