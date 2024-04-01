import { createContext } from 'react';

export  type GameLodingProps = 
{
    users: Userinfo[],
    gameloding: boolean 
};

export    type Userinfo = { clientid: number , image : string , username : string , ingame : boolean }



export type Gameresponse = { 
	player1 : number  ,
	player2 : number  ,
	player1score : number ,
	player2score : number ,
	ball :{ x: number , y: number },
	stop : number,
	gameover : boolean
 }


export  interface GameResultProps {
	playerPosition: string;
	scores: { player1score: number; player2score: number };
	runGame: boolean;
  }

export type GameContextType = {
	setGamemode : (mode : string) => void;
  settype : (type : string) => void;
  setgamefiend : (friend : number) => void;
  setrungame: (run : boolean) => void;
}

export const GameContext = createContext<GameContextType | null>(null);