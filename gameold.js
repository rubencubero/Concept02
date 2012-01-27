$(document).ready(function() {

	var canvas = $("#gameCanvas");
	var context = canvas.get(0).getContext("2d");
	
	// Canvas dimensions
	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height();
	
	var xScore = 10;
	var yScore = 20;
	
	//Sonidos
	var soundCoin = $("#gameSoundCoin").get(0);
	
	//Teclas
	var xShoot = 87;
	var R = 82;
	var arrowLeft = 37;
	var arrowRight = 39;
	var arrowUp = 88; //38
	
	var playGame = false;
	var gameOver = false;
	var player;		
	var tmpTimer;
	var score;
	var lastFrame = window.mozPaintCount;
	
	
	var player = function(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.vX = 0;
		this.vY = 0;
		this.maxJump = -54;
		this.actualJump = 0;
		
		this.shoot = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.moveUp = false;
		this.orientation = 3;//1-izquierda, 2-arriba,3-derecha,4-abajo
		this.jump = true;
	};
	
	var bullet = function (x,y,w,h,vX,vY){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.vX = vX;
		this.vY = vY;
	};
	
	var plataforma = function (x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		
		this.scored = false;
	}
	
	var moneda = function (x,y,w,h,score){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		
		this.score = score;
		this.scored = false;
	}
	
	var enemigo = function (x,y,w,h,xPlataforma,wPlataforma){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.xPlataforma = xPlataforma; 
		this.wPlataforma = wPlataforma;
		
		this.orientation = 1;
	}
	
	function startGame() {
		
		
		balas = new Array();
		plataformas = new Array();
		monedas = new Array();
		enemigos = new Array();
		
		player = new player(100,250,10,15);
		
		score = 0;
		tmpTimer = 0;
		//playGame = true;
		gameOver = false;
		
		plataformas.push(new plataforma(player.x-25,(player.y + player.h),50,10));
		
		// Set up keyboard event listeners
		$(window).keydown(function(e) {
			var keyCode = e.keyCode;			
			
			
			
			//if (((keyCode == arrowLeft) || (keyCode == arrowRight)) || playGame == false) {
			if (playGame == false && gameOver == false) {
				playGame = true;											
				// Start the animation loop
				animate();				
			    								
			}else if((gameOver) && (keyCode == R)){
				//reiniciar todo
				score = 0;
				tmpTimer = 0;
				gameOver = false;
				var startTime = undefined;
				
				context.clearRect(0, 0, canvasWidth, canvasHeight);
								
				player.x = 100;
				player.y = 250;
				
				balas.splice(0,balas.length);
				monedas.splice(0,monedas.length);
				enemigos.splice(0,enemigos.length);
				plataformas.splice(0,plataformas.length);
				plataformas.push(new plataforma(player.x-25,(player.y + player.h),50,10));
							
				playGame = true;
				
				animate();			
			};
			
			
			if (keyCode == arrowLeft) {
				player.moveLeft = true;	
				player.orientation = 1;						
			} else if (keyCode == arrowRight) {
				player.moveRight = true;
				player.orientation = 3;
			} else if (keyCode == arrowUp){
				player.moveUp = true;
			} else if (keyCode == xShoot){
				player.shoot = true;			
			};		
		});
		
		$(window).keyup(function(e) {
			var keyCode = e.keyCode;
			
			if (keyCode == arrowRight) {
				player.moveRight = false;
			} else if (keyCode == arrowLeft) {
				player.moveLeft = false;	
			} else if (keyCode == arrowUp){
				player.moveUp = false;					
			} else if (keyCode == xShoot){
				player.shoot = false;	
			};
		});
		
		//animate();
	};
	
	function animate() {		
		    
		//Limpiar todo
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		
		//Lógica		
			//Mover jugador	
			if (!(player.jump)){				
				if (player.moveUp){							
					if (player.actualJump == player.maxJump){						
						player.jump = true;
						player.vY = 6;
						player.actualJump = 0;
					}else{
						if (!(player.jump)){
							player.vY = -6;
							player.actualJump += player.vY;
						}
					}
				}else{
					player.vY = 6;
				}
			}
			if (player.moveRight){
				player.vX = 6;
			}else if (player.moveLeft){
				player.vX = -6;
			}else{
				player.vX = 0;
			}
				
			//Control de disparos	
			if (player.shoot){				
				//Crear bala
				if (player.orientation==1){
					balas.push(new bullet(player.x+(player.w/2),player.y+(player.h/2),2,2,-10,0));
				}else if (player.orientation==3){
					balas.push(new bullet(player.x+(player.w/2),player.y+(player.h/2),2,2,10,0));					
				}			
			}
									
			//Colisiones					
			//Margen superior e inferior
			/*if (player.y < 0){
				player.vY = 4;
				playGame = false;
				gameOver = true;
			}*/
			if (((player.y + player.h) >= canvasHeight) && !(player.moveUp)){
				player.vY = 0;
				player.y = canvasHeight - player.h;
				playGame = false;				
				gameOver = true;
			}
			
			//Margen izquierdo y derecho			
			if (player.x < 0){
				player.vX = 4;
			}
			if ((player.x + player.w) > canvasWidth){
				player.vX = -4;
			}
						
			player.x += player.vX;	
			//console.log("Player.y: " + player.y + " | Player.vY" + player.vY);
			player.y += player.vY;
			
			
		//Dibujar
			//Player		
				context.fillStyle = "#000000";		
				context.fillRect(player.x,player.y,player.w,player.h);
			//Ojo	
				context.fillStyle = "#FFFFFF";
				
				if (player.orientation == 1){								
					context.fillRect((player.x),(player.y)+2,3,2);					
				}else if (player.orientation == 3){
					context.fillRect((player.x + player.w)-2,(player.y)+2,3,2);
				}					
							
			//Plataformas
				for (k=0;k<plataformas.length;k++){
					var tmpPlataforma = plataformas[k];
					
					tmpPlataforma.y -=2;
					//Colisiones
					var tmpX = player.x + player.w;
					var tmpY = player.y + player.h;
					
					//Comprobar si la plataforma ya no esta en pantalla					
					if ((tmpPlataforma.y + tmpPlataforma.h) <= 0){
						var tmpRemoved = plataformas.splice(k,1);				
					}else{ //Comprobar colisiones del jugador con la plataforma
						if ((tmpX >= tmpPlataforma.x) && (player.x <= (tmpPlataforma.x + tmpPlataforma.w))){											
							if ((tmpY >= tmpPlataforma.y) && (tmpY <= (tmpPlataforma.y + tmpPlataforma.h))){								
								player.y = (tmpPlataforma.y - tmpPlataforma.h)- player.h + 2;
								player.jump = false;															
								if (!(tmpPlataforma.scored)){
									tmpPlataforma.scored = true;
									score +=10;	
								};								
								if ((player.y + (tmpY/2) < 0) ){
									playGame = false;				
									gameOver = true;
								}
							}					
						}	
					}																						
					
					context.fillStyle = "#000000";		
					context.fillRect(tmpPlataforma.x,tmpPlataforma.y,tmpPlataforma.w,tmpPlataforma.h);
				};
			//Monedas
				for (i=0;i<monedas.length;i++){
					var tmpMoneda = monedas[i];
													
					
					//Colisiones
					var tmpX = player.x + player.w;
					var tmpY = player.y + player.h;
					
					//Comprobar si la moneda ya no esta en pantalla					
					if ((tmpMoneda.y + tmpMoneda.h) <= 0){
						var tmpRemoved = monedas.splice(i,1);
						i--;
					}else{ //Comprobar colisiones del jugador con la moneda
						if ((tmpX >= tmpMoneda.x) && (player.x <= (tmpMoneda.x + tmpMoneda.w))){											
							if ((tmpY >= tmpMoneda.y) && (tmpY <= (tmpMoneda.y + tmpMoneda.h))){								
								score += tmpMoneda.score;
								soundCoin.currentTime = 0;
								soundCoin.play();
								var tmpRemoved = monedas.splice(i,1);
								i--;																							
							}					
						}	
					}	
					
					tmpMoneda.y -=2;
					
					context.fillStyle = "#FFE100";		
					context.fillRect(tmpMoneda.x,tmpMoneda.y,tmpMoneda.w,tmpMoneda.h);
				};
				
			//Enemigos
				for (i=0;i<enemigos.length;i++){
					var tmpEnemigo = enemigos[i];
													
					
					//Colisiones
					var tmpX = player.x + player.w;
					var tmpY = player.y + player.h;
					
					//Comprobar si el enemigo ya no esta en pantalla					
					if ((tmpEnemigo.y + tmpEnemigo.h) <= 0){
						var tmpRemoved = enemigos.splice(i,1);
						i--;
					}else{ //Comprobar colisiones del jugador con el enemigo
						if ((tmpX >= tmpEnemigo.x) && (player.x <= (tmpEnemigo.x + tmpEnemigo.w))){											
							if ((tmpY >= tmpEnemigo.y) && (tmpY <= (tmpEnemigo.y + tmpEnemigo.h))){								
								playGame = false;				
								gameOver = true;																														
							}					
						}	
					}	
										
					//Desplazar por la plataforma
					if ((tmpEnemigo.orientation == 1) && (tmpEnemigo.x > tmpEnemigo.xPlataforma)){
						tmpEnemigo.x --;												
						if (tmpEnemigo.x <= tmpEnemigo.xPlataforma){
							tmpEnemigo.orientation = 3;												
						};
					}else if((tmpEnemigo.orientation == 3) && ((tmpEnemigo.x + tmpEnemigo.w) < (tmpEnemigo.xPlataforma + tmpEnemigo.wPlataforma)))	{
						tmpEnemigo.x ++; 
						if ((tmpEnemigo.x + tmpEnemigo.w) >= (tmpEnemigo.xPlataforma + tmpEnemigo.wPlataforma)){
							tmpEnemigo.orientation = 1;											
						};
					}	
					
						
					tmpEnemigo.y -=2;
					
					context.fillStyle = "#A60800";		
					context.fillRect(tmpEnemigo.x,tmpEnemigo.y,tmpEnemigo.w,tmpEnemigo.h);
				};
				
			//Balas			
				for (i=0;i<balas.length;i++){
					var tmpBala = balas[i];
					
					tmpBala.x += tmpBala.vX;
					
					
					context.fillStyle = "#000000";		
					context.fillRect(tmpBala.x,tmpBala.y,tmpBala.w,tmpBala.h);
				};
			
			//HUD
				context.fillStyle = 'rgba(0,0,0,0.75)';
				context.fillRect(0,0,canvasWidth,30);
				context.fillStyle = "#FFFFFF";
				context.font = "10pt Verdana";
				context.fillText("Puntuación: " + score,xScore,yScore);
				
				/*lastFrame = window.mozPaintCount;
				context.fillStyle = 'rgba(0,0,0,0.75)';
				context.fillText("FPS: " + lastFrame,canvasWidth-60, canvasHeight -10);*/
			
		tmpTimer ++;
		
		//Añadir nueva plataforma
		if (tmpTimer == 30){
			
			plataformas.push (new plataforma((Math.random()*480-50),canvasHeight,(Math.random()*50)+50,10))
			
			if (Math.round(Math.random())==1){
				//Añadir modenas
					var lastPlataforma = plataformas[plataformas.length - 1];
					monedas.push (new moneda(lastPlataforma.x + (lastPlataforma.w/2),lastPlataforma.y - 10,10,10,50));
			};
			
			if (Math.round(Math.random())==1){
				//Añadir enemigo
					var lastPlataforma = plataformas[plataformas.length - 1];
					enemigos.push (new enemigo(lastPlataforma.x + (lastPlataforma.w/2),lastPlataforma.y - 10,10,10,lastPlataforma.x,lastPlataforma.w));
			};
			tmpTimer = 0;
		}		
					
		//Animar
		if (playGame){			
			setTimeout(animate, 33);
		}else{
			if (gameOver){				
				context.fillStyle = "#FFFFFF";	
				context.font = "30pt Verdana";	
				context.fillText("GAME OVER!",(canvasWidth/2)-120,(canvasHeight/2));			
				context.font = "10pt Verdana";	
				context.fillText("Pulsa 'R' para reiniciar",(canvasWidth/2)-60,(canvasHeight/2)+20);											
			};
		}		
	};
	
	startGame();
})