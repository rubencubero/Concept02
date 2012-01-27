var fpsCounter = ( function(){

		console.log('Modulo de FPS cargado...');

		// FPS máximos a los que queremos que se ejecute la aplicación.
    var maxfps = 32;

    // Variables necesarias para el recuento de FPS y el cálculo del delay.
    var frameCount = 0,
				currentFps = 0,
				drawInterval = 1 / maxfps * 1000,
				lastFps = new Date().getTime();

    // Variables para almacenar las referencias al elemento canvas.
    var canvas = null,
				ctx = null;

    // Método que utilizamos como constructor.
    var initCore = function( canvasID ){
			console.log('Inciando el contador de FPS...');

			// Cargamos el objeto canvas y su contexto
			canvas = document.getElementById( ( canvasID ) ? canvasID : 'gameCanvas' );

			if ( canvas && canvas.getContext ){
				ctx = canvas.getContext('2d');
				// Inicializamos el intervalo a los FPS deseados.
				setInterval( function(){ startApp(); }, drawInterval );
			}else{
				console.warn('Objeto canvas no encontrado o navegador no soportado!');
			}

    };

    var startApp = function(){
			// Actualizamos y enviamos la petición de pintado.
			update();
			draw();
    };

    var update = function(){
			// Calculamos el tiempo desde el último frame.
			var thisFrame = new Date().getTime(),
					diffTime = Math.ceil((thisFrame - lastFps));

			if (diffTime >= 1000) {
				currentFps = frameCount;
				frameCount = 0.0;
				lastFps = thisFrame;
			}

			frameCount++;
    };

    var draw = function(){
			// Pintamos los datos en el canvas
			ctx.clearRect( 0, 0, canvas.width, canvas.height );
			ctx.save();
			ctx.fillStyle = '#000';
			ctx.font = 'bold 10px sans-serif';
			ctx.fillText( 'FPS: ' + currentFps + '/' + maxfps, 10, 15 );
			ctx.restore();
		};

		return{
			init : initCore
		}

} )();