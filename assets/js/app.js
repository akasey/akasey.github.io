
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

var Cell = function(x,y){
	var me = this;

	me.isAlive = false;
	me.x = x;
	me.y = y;

	me.neighbors = null;

	me.countNeighbors = function(){
		return me.neighbors.filter(function(cell){
			return cell.isAlive;
		}).length;
	};

	me.lifetime = 0;
	me.lifetimePlusPlus = function() {
		if (me.lifetime<2)
			me.lifetime++;
	}

	return me;
};


var Grid = function(width, height){
	var me = this;
	var _cells = new Array(width*height);

	var _living = [];

	// instantiate cells
	for(var i = 0; i < width; i++){
		for(var j = 0; j < height; j++){
			(function(){
				_cells[i+j*width] = new Cell(i, j);
			})();
		}
	}

	// assign neighbors
	_cells.forEach(function(cell){
		cell.neighbors = _cells.filter(function(cell2){
			var dx = Math.abs(cell2.x - cell.x);
			var dy = Math.abs(cell2.y - cell.y);
			return (dx === 1 && dy === 1 ) || (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
		});
	});


	me.filter = function(fcn){
		return _cells.filter(fcn);
	};

	me.updateLiving = function(){
		var deadOvercrowded = _cells.filter(function(cell){
			return cell.isAlive && (cell.countNeighbors() > 3);
		});
		var deadUnderpop = _cells.filter(function(cell){
			return cell.isAlive && (cell.countNeighbors() < 2);
		})
		var reproduction = _cells.filter(function(cell){
			return !cell.isAlive && cell.countNeighbors() === 3;
		});
		var livesOn = _cells.filter(function(cell){
			return cell.isAlive && (cell.countNeighbors() === 2 || cell.countNeighbors() === 3);
		});
		deadOvercrowded.concat(deadUnderpop).forEach(function(cell){
			cell.lifetime = 0;
			cell.isAlive = false;
		});
		reproduction.forEach(function(cell){
			cell.isAlive = true;
		});
		livesOn.forEach(function(cell){
			cell.lifetimePlusPlus();
			cell.isAlive = true;
		});
	};

	me.getCell = function(x,y){
		return _cells[x+y*width];
	};

	return me;
}

var App = function(targetElementId, squaresX, squaresY){
	var borderColor = "#009688";
	var fillColor = ["#80CBC4","#B2DFDB","#E0F2F1"];
	var me = this;
	me.canvas = document.getElementById(targetElementId);
	me.ctx = me.canvas.getContext("2d");

	// Set height and width to window inner height
	viewWidth = me.canvas.width = window.innerWidth;
  	viewHeight = me.canvas.height = window.innerHeight;

  	squaresX = squaresX || 20;
  	squaresY = squaresY || 20;

  	var _squareWidth = me.canvas.width/squaresX;
  	var _squareHeight = _squareWidth;

  	var grid = new Grid(squaresX, squaresY);

	var gun = [
		[1,5],[1,6],[2,5],[2,6],
		[11,5],[11,6],[11,7],
		[12,4],[12,8],
		[13,3],[13,9],
		[14,3],[14,9],
		[15,6],
		[16,4],[16,8],
		[17,5],[17,6],[17,7],
		[18,6],
		[21,3],[21,4],[21,5],
		[22,3],[22,4],[22,5],
		[23,2],[23,6],
		[25,1],[25,2],[25,6],[25,7],
		[35,3],[35,4],
		[36,3],[36,4]
	];

	var jpt = [
		[50,40],[50,41],
		[51,40],[51,41]
	];

	me.dummyInit = function(matrix){
		matrix.forEach(function(each){
			grid.getCell(each[0],each[1]).isAlive = true;
		});
	};

  	// Handle Click events
	var _mouseDown = false;
	me.mouseclicks = [];
	var handleClick = function(event){
		var x = event.pageX - me.canvas.offsetLeft;
		var y = event.pageY - me.canvas.offsetTop;

		var i = Math.floor(x/_squareWidth);
		var j = Math.floor(y/_squareHeight);
		me.mouseclicks.push([i,j]);
		grid.getCell(i, j).isAlive = true;
		return;
	};

	window.onresize = function(ev){
		viewWidth = me.canvas.width = window.innerWidth;
  		viewHeight = me.canvas.height = window.innerHeight;
	};

	me.canvas.addEventListener('mousedown', function(event){
		_mouseDown = true;
		handleClick(event);
		me.canvas.addEventListener('mousemove', handleClick);
	});

	me.canvas.addEventListener('mouseup', function(event){
		_mouseDown = false;
		me.canvas.removeEventListener('mousemove', handleClick);
	});

	me.start = function(){
		me.dummyInit(gun);
		me.dummyInit(jpt);
		setInterval(function(){
			me.update();
			me.draw();
		}, 20);

		setInterval(function(){
			me.dummyInit(jpt);
		}, 1000);
	};

	me.update = function(){
		grid.updateLiving();
	};

	me.draw = function(){
		// Erase previous draw
		me.ctx.fillStyle = 'white';
	 	me.ctx.fillRect(0,0,me.canvas.width,me.canvas.height);

	 	// Draw living squares
	 	grid.filter(function(cell){
	 		return cell.isAlive;
	 	}).forEach(function(cell){
			var thickness = 2;
			me.ctx.fillStyle = borderColor;
			me.ctx.fillRect(cell.x * _squareWidth, cell.y * _squareHeight, _squareWidth, _squareHeight);
	 		me.ctx.fillStyle = fillColor[cell.lifetime];
	 		me.ctx.fillRect(cell.x*_squareWidth + (thickness), cell.y*_squareHeight + (thickness), _squareWidth - (thickness * 2), _squareHeight - (thickness * 2))
	 	});
	};

	return me;
};


var app = new App("game", 100, 50);
app.start();
