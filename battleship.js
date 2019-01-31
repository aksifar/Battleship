var view = {
	displayMessage : function(msg)
	{
		var messageArea =  document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	
	displayHit : function( location )
	{
		var cell =  document.getElementById( location );
		cell.setAttribute("class", "hit");
	},
	
	displayMiss : function( location )
	{
		var cell =  document.getElementById( location );
		cell.setAttribute("class", "miss");
	}
};

var model = {
	boardSize : 7,
	numShips : 3,
	shipLength : 3,
	shipSunk : 0,
	
	ships : [{ locations: ["0", "0", "0"], hits: ["", "", ""] },
			 { locations: ["0", "0", "0"], hits: ["", "", ""] },
			 { locations: ["0", "0", "0"], hits: ["", "", ""]} ],
	
	fire : function( guess )
	{
		for(var i=0; i < this.numShips; i++ )
		{
			var ship = this.ships[i];
			var index = ship.locations.indexOf( guess );
			if( index >= 0 )
			{
				ship.hits[index] = "hit";
				view.displayHit( guess );
				view.displayMessage( "HIT!" );
				if( this.isSunk( ship ) )
				{
					view.displayMessage( "You sank my battleship!" );
					this.shipSunk++;
				}
				return true;
			}
		}
		view.displayMiss( guess );
		view.displayMessage( "You missed!" );
		return false;
	},
	
	isSunk : function( ship )
	{
		for(var i=0; i< this.shipLength; i++)
		{
			if( ship.hits[i] != "hit" )
			{
				return false;
			}
		}
		return true;			
	},
	
	generateShipLocations : function()
	{
		var locations;
		for( var i=0; i < this.numShips; i++ )
		{
			do
			{
				locations =  this.generateShip();
			}
			while( this.collision( locations ));
			this.ships[i].locations = locations;
		}
	},	
	
	generateShip : function()
	{
		var direction = Math.floor(Math.random() * 4);
		direction++;
		var row, col;
		
		//generating first coordinates of the ship.
		if(direction == 1) //horizontal ship
		{
			row = Math.floor( Math.random() * this.boardSize );
			col = Math.floor( Math.random() * ( this.boardSize - this.shipLength ) );
		}
		else if(direction == 2) //vertical ship
		{
			row = Math.floor( Math.random() * ( this.boardSize - this.shipLength ) );
			col = Math.floor( Math.random() * this.boardSize );
		}
		else if(direction == 3) //left to right diagonal ship
		{
			row = Math.floor( Math.random() * ( this.boardSize - this.shipLength ) );
			col = Math.floor( Math.random() * ( this.boardSize - this.shipLength ) );
		}
		else if(direction == 4) //right to left diagonal ship
		{
			row = Math.floor( Math.random() * ( this.boardSize - this.shipLength ) );
			col =  Math.floor(Math.random() * this.shipLength ) + 2;
		}
		
		//generating remaining coordinates of the ship
		var newShipLocation = [];
		for(var i=0; i<this.shipLength; i++)
		{
			if( direction == 1 )
			{
				 newShipLocation.push( row + "" + (col+i) );
			}
			else if( direction == 2 )
			{
				newShipLocation.push( (row+i) + "" + col );
			}
			else if( direction == 3 )
			{
				newShipLocation.push( (row+i) + "" + (col+i) );
			}
			else if( direction == 4 )
			{
				newShipLocation.push( (row+i) + "" + (col-i) );
			}
		}
		return newShipLocation;
	},
	
	collision : function( locations ) 
	{
		for (var i = 0; i < this.numShips; i++) 
		{
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) 
			{
				if (ship.locations.indexOf(locations[j]) >= 0) 
				{
					return true;
				}
			}
		}
		return false;
	}
};

var controller ={
	guesses : 0,
	processGuess : function( guess ) 
	{
		var location = this.parseGuess( guess ); // converts input like A4 to 04 or D6 to 36 
		if( location )							//if location is valid and not null
		{
			this.guesses++;
			var hit = model.fire( location );
			if( hit && model.shipSunk === model.numShips )
			{
				view.displayMessage("You sank all my battleships, in " +
				this.guesses + " guesses");
			}
		}
	},
	
	parseGuess : function( guess )
	{
		var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
		if( guess === null || guess.length !== 2)
		{
			alert("Oops, please enter a letter and a number on the board.");
		}
		else
		{
			firstChar = guess.charAt(0);
			var row = alphabet.indexOf(firstChar);
			var column = guess.charAt(1);
			if( isNaN( row ) || isNaN( column ) ) 
			{
				alert("Oops, that isn't on the board.");
			} 
			else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize)
			{
				alert("Oops, that's off the board!");
			}
			else 
			{
				return row + column;
			}
		}
		return null;
	}
}
function init()
{
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	model.generateShipLocations();
}

function handleFireButton()
{
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess( guess );
	guessInput.value = "";
}

function handleKeyPress( e )
{
	var fireButton = document.getElementById( "fireButton" );
	if( e.keyCode == 13 )
	{
		fireButton.click();
		return false;
	}
}

window.onload = init;