import { exit } from "process"

export type gameSocket = { 
	clientid: number ,
	player : {y: number},
	moveball : number,
	player1score : number ,
	player2score : number 
}


export type Gameresponse = { 
	player1 : number  ,
	player2 : number  ,
	player1score : number ,
	player2score : number ,
	ball :{ x: number , y: number },
	stop : number ,
	gameover : boolean} 
		

	
export type GameBack = {
	player1 : { x: number , y: number } ,
	player2 : { x: number , y: number } ,
	player1score : number ,
	player2score : number,
	ball : { x: number , y: number  , direction : {x : number , y : number } , stop : number } ,
	gameover : boolean,
	gameoverHandled : boolean,
	iscollision : boolean,
	colormode : number
}

export type userinfo = { clientid: number , image : string , username : string , ingame : boolean , level : number}
export type RoomInfo = {users: userinfo[],gameloding: boolean  , type : string , mode : string, friendid : number};


export class datagame {

	public angle : number ;
	public framemove : number ;
	public rooms : { [key: string]: RoomInfo} ;
	public game : { [key: string]: GameBack } ;

	public gameIntervals: { [room: string]: NodeJS.Timer };

	constructor ()
	{
		this.framemove = 0;
		this.angle = 0;
		this.rooms = {};
		this.game = {};
		this.gameIntervals = {};
	}
		updatelevel( room : string , clientid : number )
		{
			for (const user of this.rooms[room].users)
			{
				if (user.clientid === clientid)
				{
					if (user.level  < 99)
					user.level  += (100 - user.level ) /  (100); 
					if (user.level  == 99)
					user.level  += 0.02;
					let formattedNumber: string = user.level.toFixed(2);
					user.level = parseFloat(formattedNumber);
				}
			}
		}
		clearIntervals(room :string): void
		{ 
			clearInterval(this.gameIntervals[room] as unknown as number);
			delete this.gameIntervals[room];
		}

		DeleteRoom(room : string)
		{
			delete this.rooms[room];
		}

		Deletegame(room : string)
		{
			delete this.game[room];
		}
		setendgame(room : string )
		{
			this.game[room].gameover = true;
		}
		setgameoverHandled(room : string)
		{
			this.game[room].gameoverHandled = true;
		}
		setmoveball(room : string , moveball : number)
		{
			this.game[room].ball.stop = moveball;
		}

		getmoveball(room : string)
		{
			return this.game[room].ball.stop;
		}

		initgame(room : string)
		{
			this.angle = - Math.PI / 4;
			this.framemove = Math.random() * Math.PI / 2 + this.angle;
			this.game[room] = 
			{
				player1 : { x: 5 , y: 50 },
				player2 : { x: 95 , y: 50 },
				player1score : 0,
				player2score : 0,
				ball : { 
					x: 50,
					 y: 50 ,
					direction : {x : Math.cos(this.framemove) , y : Math.sin(this.framemove)},
					stop : 0,
				},
				gameover : false,
				gameoverHandled : false,
				iscollision : false,
				colormode : 0
			}
		}
		newRound(room : string)
		{
			this.game[room].ball.stop = 0;
			this.game[room].ball.x = 50;
			this.game[room].ball.y = 50;
			if ((this.game[room].player1score + this.game[room].player2score) % 2 == 1)
				this.angle =  3 * Math.PI / 4;
			else
				this.angle = - Math.PI / 4;
			this.framemove = Math.random() * Math.PI / 2 + this.angle ;
			this.game[room].ball.direction = {x : Math.cos(this.framemove)  , y : Math.sin(this.framemove)  };
			this.game[room].iscollision = false;
			this.game[room].colormode = 0;		
		}


		ballcollision(room : string , player : number)
		{
			this.game[room].iscollision = true;
			let speed =  Math.abs(this.game[room].ball.direction.x) + Math.abs(this.game[room].ball.direction.y);
			// console.log("speed" , speed);
			if (player === 1)
			{	
				let base =  this.game[room].ball.y - this.game[room].player1.y ;
				let angle = base / 9.5 * 1.2;
				// console.log("base" , base)
				// console.log("angle" , angle);
				if (angle / speed > 0.7)
					angle = 0.7 * speed;
					// console.log("angle2" , angle);
				this.game[room].ball.direction.y =  angle;
				this.game[room].ball.direction.x = speed - Math.abs(angle)  + (0.05);
				// console.log("speedx" , this.game[room].ball.direction.x);
			}
			else if (player === 2)
			{
				let base =  this.game[room].ball.y - this.game[room].player2.y ;
				let angle = base / 9.5 * 1.2;
				// console.log("base" , base);
				// console.log("angle" , angle);
				if (angle / speed > 0.7)
					angle = 0.7 * speed;
					// console.log("angle2" , angle);
				this.game[room].ball.direction.y =   angle;
				this.game[room].ball.direction.x = (speed - Math.abs(angle)) * (-1)- (0.05);
				// console.log("speedx" , this.game[room].ball.direction.x);
			}
			let speed1 =  Math.abs(this.game[room].ball.direction.x) + Math.abs(this.game[room].ball.direction.y);
			if (Math.abs( this.game[room].ball.direction.y) + 1 >=  Math.abs(this.game[room].ball.direction.x))
				this.game[room].colormode = 0;
			else
				this.game[room].colormode = 1;
			// console.log("Y" , this.game[room].ball.direction.y);
			// console.log("X" , this.game[room].ball.direction.x);
			// console.log("colormode" , this.game[room].colormode);
		}

		updateBall(room : string)
		{
			this.game[room].iscollision = false;
			if (this.game[room].ball.stop === 0)
			return ;      
			if (this.game[room].ball.y + 1 >= 100 || this.game[room].ball.y - 1 <= 0)
				this.game[room].ball.direction.y = - this.game[room].ball.direction.y 

			else if ( this.game[room].ball.direction.x <= 0 && this.game[room].ball.x <= 50 && (this.game[room].ball.x - 1 <=  this.game[room].player1.x + 1.1 && this.game[room].ball.x + 1 >= this.game[room].player1.x ) && (this.game[room].ball.y - 1 >= this.game[room].player1.y - 9.5 ) && (this.game[room].ball.y + 1 <= this.game[room].player1.y + 9.5))
			{			
				// this.game[room].ball.direction.x = - this.game[room].ball.direction.x ;
				this.ballcollision(room , 1);

			}
			else if ( this.game[room].ball.direction.x > 0 && this.game[room].ball.x > 50 && (this.game[room].ball.x + 1 >=  this.game[room].player2.x ) && this.game[room].ball.x - 1 <= this.game[room].player2.x + 1.1 && (this.game[room].ball.y - 1 >= this.game[room].player2.y -9.5 ) && (this.game[room].ball.y + 1 <= this.game[room].player2.y + 9.5))
			{
				this.ballcollision(room , 2);
				// this.game[room].ball.direction.x = - this.game[room].ball.direction.x ;
			}
				this.game[room].ball.y += this.game[room].ball.direction.y ;
				this.game[room].ball.x += this.game[room].ball.direction.x ;
		}
		movePlayer(room : string , clientid : number , y : number )
		{
			if (this.rooms[room].users &&  this.rooms[room].users[0] && this.rooms[room].users[0].clientid === clientid)
			this.game[room].player1.y = y;
			else if (this.rooms[room].users &&  this.rooms[room].users[1] && this.rooms[room].users[1].clientid === clientid)
			this.game[room].player2.y = y;
			if (this.rooms[room].type === "ai")
				this.game[room].player2.y = this.game[room].ball.y;
		}
		score(room : string)
		{
			if (this.game[room].ball.x < 0 )
			{
				this.game[room].player2score += 1;
				return true
			}
			else if (this.game[room].ball.x + 1 > 100)
			{
				this.game[room].player1score += 1;
				return true
			}
			return false;
		}
	addRoom( data : userinfo , type : string ,mode : string , friendid : number){
		const { v4: uuidv4 } = require('uuid');
		const roomname = uuidv4();
		this.rooms[roomname] = { users: [data], gameloding: true , type : type  , mode : mode , friendid : friendid};
		this.initgame(roomname);
		if (type === "ai")
		{
			this.addUser(roomname, {clientid: -1, image: "ai", username: "ai", ingame: false , level : 100});
		}
	}
	addUser(roomname : string, user :userinfo ){
			this.rooms[roomname].users.push(user); 
			this.rooms[roomname].gameloding = false;
			this.rooms[roomname].users.forEach(user => user.ingame = true);
	}
	checkRoomsize(roomname : string){
		if (this.rooms[roomname] )
		return this.rooms[roomname].users.length;
	}
	searcheClientRoom(clientid : number){
		for (const room in this.rooms) {
			for (const user of this.rooms[room].users)
			{
				if (this.rooms[room].users. find(user => user.clientid === clientid))
				return room;
			}
		}
		return null
	}
	searchefriendRoom(friendid : number)
	{
		for (const room in this.rooms) {
			if (this.rooms[room].type === "friend" && this.rooms[room].friendid === friendid)
			return room;
		}
		return null
	}

	findEmptyRoom (type : string , clientid : number , mode : string)
	{

		for (const room in this.rooms) {
			if (this.rooms[room].users.length < 2 && this.rooms[room].type === type && type != "ai" && type != "friend")
			{
				console.log("room" , this.rooms[room].type);
				console.log("mode" , this.rooms[room].mode);
				console.log("modein" , mode);
				return room;
			}
			if (this.rooms[room].users.length < 2 && this.rooms[room].type === type && type === "friend" && this.rooms[room].friendid === clientid)
			{
				return room;
			}
		}
		return null
	}
	getRoomsLength(): number {
    return Object.keys(this.rooms).length;
  }
}
