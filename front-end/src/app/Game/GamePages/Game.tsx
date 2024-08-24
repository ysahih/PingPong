"use client";

import { use, useContext, useEffect, useRef, useState } from "react";
import { GameContext, GameLodingProps, Gameresponse, gameExit, leavegame } from "../Gamecontext/gamecontext";
import UserDataContext from "@/components/context/context";
import SocketContext from "@/components/context/socket";
import Image from "next/image";
import Gameresult from "./Gameresult";
import { ColitionEffect, Effect } from "./effect";
import AlertDialog from "./ExitDialog";

const Game : React.FC<{}> = () => {
  const game = useContext(GameContext );
  const canvasRef = useRef <HTMLCanvasElement>(null);
  const [gameover , setgameover] = useState<boolean>(false); 
  const Socket = useContext(SocketContext);
  const user = useContext(UserDataContext );
  const [scores, setScores] = useState({ player1score: 0, player2score: 0 });
  const [shouldRotate, setShouldRotate] = useState<boolean>(false);
  const p_y = useRef(50);
  const adjustedRect = useRef(50);
  const isMouseDown = useRef(false);
  const [dimensions, setDimensions] = useState({ width: (window.innerWidth * 0.6), height: window.innerHeight * 0.4 });
  var bodie = {p_Width: dimensions.width  * 0.011, p_Height: dimensions.height * 0.17 , b_Width: dimensions.width * 0.01 };
  var color  = { background : game?.gamemode == "Dark Valley" ? "#1B266B" : "#000000"  , player: game?.gamemode == "Dark Valley" ? "#0064FB" : "#FFA500",  grid : game?.gamemode == "Dark Valley" ? "#081041" : "#081041" ,ball: "#1ECDF8"}
  const position = useRef<Gameresponse >({player1: 50, player2: 50, player1score: 0, player2score: 0, ball: { x: 50, y: 50 } , stop : 0 , gameover : false , iscollision : false , colormode : 0});
  const [Winner , setWinner] = useState<boolean>(false);
  let effect : Effect[];
  effect = [];
  let colition : ColitionEffect[] ;
  colition = [];


  useEffect(() => { 
    const Gameover = (data : leavegame) =>
    {
      if (data.id == user?.id)
        setWinner(false);
      else
        setWinner(true);
      setgameover(true);


    }
    Socket?.on("LeaveGame", Gameover )
  }, [Socket]);



  useEffect (() => {
    const updatePosition = (mydata: Gameresponse ) => {
      if (game?.playerposition == "left")
      {
        position.current.ball =  mydata.ball;
        position.current.player1 = mydata.player1;
        position.current.player2 = mydata.player2;
        position.current.player1score = mydata.player1score;
        position.current.player2score = mydata.player2score;
      }
      else if (game?.playerposition == "right")
      {
        position.current.ball.y =  mydata.ball.y;
        position.current.ball.x = 100 - mydata.ball.x;
        position.current.player1 = mydata.player2;
        position.current.player2 = mydata.player1;
        position.current.player1score = mydata.player2score;
        position.current.player2score = mydata.player1score; 
      }
      position.current.iscollision = mydata.iscollision;
      position.current.colormode = mydata.colormode;
      position.current.stop = mydata.stop;
      position.current.gameover = mydata.gameover;
      if (position.current.player1score != scores.player1score || position.current.player2score != scores.player2score)
      {
        setScores({ player1score: position.current.player1score, player2score: position.current.player2score });
      }
    };
    Socket?.on("game", updatePosition);
    // Socket?.emit("game", { clientid: user?.id, player: { y: p_y.current }, moveball: position.current.stop , player1score :scores.player1score, player2score: scores.player2score});
    return () => {
      Socket?.off("game", updatePosition);
    };
  }, [Socket]);


useEffect(() => {
  if (window.innerWidth < 520 ) {
    {
      setDimensions({
        width: window.innerHeight < 695? window.innerHeight * 0.65 : window.innerHeight * 0.75,
        height: window.innerWidth * 0.95
      });
      setShouldRotate(true);
    }
  } else {
    setDimensions({
      // width: window.innerWidth * 0.6,     
      width:window.innerWidth > 800? 700 : window.innerWidth  < 1080 ? window.innerWidth * 0.9 : window.innerWidth * 0.6,
      height: window.innerHeight * 0.4,
    });
    setShouldRotate(false);
  } 
}, []);


  useEffect(() => {
    if (position.current.gameover)
    {
      setTimeout(() => {
      setgameover(true);
      }, 1000);
    }
  }, [scores]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas?.style.setProperty('border', '1px solid black');
    canvas?.style.setProperty('background', '#D9EDBF');
    const context = canvas?.getContext('2d');
    const lingrad = context?.createLinearGradient(0, 0, 0, 150);

    const  pushEffect = (myEffect : Effect[]  ,  numbertoadd : number   ,x : number , y : number , colormode : number) =>
    {    
        for (let i = 0 ; i  < numbertoadd  && myEffect.length < 50 ; i++)
        {
            myEffect.push(new Effect(x , y , colormode));
        }
    }
    
      const pushColition =(myEffect : ColitionEffect[]  ,  numbertoadd : number   ,x : number , y : number , colormode : number) =>
    {    
      for (let i = 0 ; i  < numbertoadd  && myEffect.length < 20 ; i++)
      {
          myEffect.push(new ColitionEffect(x , y , colormode));
      }
    } 

     const PopColition = ( myEffect : ColitionEffect[]) =>
    {
      for (let i = 0 ; myEffect.length > 0 ; i++)
      {
          myEffect.pop();
      }
    }



    if (context) {

      let animationFrameId: number;
      const draw = () => {
        context.beginPath();
        context.fillStyle = color.background ; 
        context.fillRect(0, 0, dimensions.width, dimensions.height); 
        context.fillStyle = color.player ; 
        if (game?.gamemode != "Dark Valley")
        {
            context.shadowColor = `hsla(${40}, 100%, 50%, .99)`;
            context.shadowBlur = 30;
        }
        context.fillRect(
          dimensions.width * 0.05, 
          dimensions.height * p_y.current / 100 - bodie.p_Height / 2, 
          bodie.p_Width, 
          bodie.p_Height
          );
        context.fillRect(
          dimensions.width * 0.95, 
          dimensions.height * position.current.player2 / 100 - bodie.p_Height / 2, 
          bodie.p_Width, 
          bodie.p_Height
          );

        
        context.fill();
        context.shadowColor = 'transparent'; 
        context.shadowBlur = 0;


        context.fillStyle = color.grid ;
        context.fillRect(dimensions.width * 0.495 ,
          dimensions.height * 0.05 ,
          dimensions.width * 0.01 ,
          dimensions.height * 0.9 )
        
        if(position.current.colormode == 1 && game?.gamemode != "Dark Valley")
        context.fillStyle = "#ff8c19";
        else if(position.current.colormode == 2 && game?.gamemode != "Dark Valley")
        context.fillStyle = `hsla(${200}, 100%, 70%, .8)`;
        else
        context.fillStyle = color.ball;
        context.arc(
            dimensions.width * position.current.ball.x / 100, 
            dimensions.height * position.current.ball.y / 100, 
            bodie.b_Width, 
            0, 
            Math.PI * 2
        );
        context.fill();
        context.closePath();

        if (game?.gamemode != "Dark Valley")
        {
          effect.map((effect) => {
            effect.draw(context);
            effect.update(dimensions.width * position.current.ball.x / 100 , dimensions.height * position.current.ball.y / 100 , position.current.colormode , shouldRotate);
          }) 
          pushEffect(effect , 20 , dimensions.width * position.current.ball.x / 100 , dimensions.height * position.current.ball.y / 100 , position.current.colormode );
          if (position.current.iscollision)
          {
            pushColition(colition , 20 , dimensions.width * position.current.ball.x / 100 , dimensions.height * position.current.ball.y / 100 , position.current.colormode);
            colition.map((effect) => {
              effect.update(dimensions.width * position.current.ball.x / 100 , dimensions.height * position.current.ball.y / 100  , position.current.colormode);
              effect.draw(context);
            })
          }
        }
    };

    const handleMouseMove =  (e: MouseEvent) => {
      if (canvasRef.current) {
        var rect = (e.y / window.innerHeight) * 100;
        const tablerect = canvasRef.current.getBoundingClientRect();
        if (!shouldRotate && rect >= tablerect.top / window.innerHeight * 100 && rect <= tablerect.bottom / window.innerHeight * 100) {
           adjustedRect.current = rect - (tablerect.top / window.innerHeight * 100);
          adjustedRect.current = adjustedRect.current * 100 / (tablerect.height / window.innerHeight * 100);
          if (isMouseDown.current) {
            position.current.stop = 1;
            p_y.current = adjustedRect.current;    
          }
        }
          rect = (e.x / window.innerWidth) * 100;
         if (shouldRotate && rect >= tablerect.left / window.innerWidth * 100 && rect <= tablerect.right / window.innerWidth * 100) {
          adjustedRect.current = rect - (tablerect.left / window.innerWidth * 100);
          adjustedRect.current = adjustedRect.current * 100 / (tablerect.width / window.innerWidth * 100);
         
          if (isMouseDown.current) {
            position.current.stop = 1;
            p_y.current = adjustedRect.current;
          }
        }
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      
      if (e.button === 0) {
       
        isMouseDown.current = true;
      }
    };

    const  handleMouseUp = (e: MouseEvent) => {
      isMouseDown.current = false;
    }
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove);
      const render = () => {
        draw();  
          Socket?.emit("game", { clientid: user?.id, player: { y: p_y.current }, moveball: position.current.stop ,player1score : position.current.player1score,player2score : position.current.player2score});
        animationFrameId = window.requestAnimationFrame(render);
      };
      render();
      return () => {
        window.cancelAnimationFrame(animationFrameId);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dimensions, Socket, user?.id]);
  
  useEffect(() => {
    const handleResize = () => {
      
      if (window.innerWidth < 520 ) {
        {
          setDimensions({
            width: window.innerHeight < 695? window.innerHeight * 0.65 : window.innerHeight * 0.75,
            height:    window.innerWidth * 0.85
          });
          setShouldRotate(true);
        }
      } else {
        setDimensions({
          // width: window.innerWidth * 0.6,     
          width:window.innerWidth > 800? 700 : window.innerWidth  < 1080 ? window.innerWidth * 0.9 : window.innerWidth * 0.6,
          height: window.innerHeight * 0.4,
        });
        setShouldRotate(false);
      }   
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dimensions]);


  const handleTouchMove = (e: React.TouchEvent) => {
    
      if (canvasRef.current) {
        var rect = (e.touches[0].clientY / window.innerHeight) * 100;
        const tablerect = canvasRef.current.getBoundingClientRect();
        if (!shouldRotate && rect >= tablerect.top / window.innerHeight * 100 && rect <= tablerect.bottom / window.innerHeight * 100) {
           adjustedRect.current = rect - (tablerect.top / window.innerHeight * 100);
          adjustedRect.current = adjustedRect.current * 100 / (tablerect.height / window.innerHeight * 100);  
            position.current.stop = 1;
            p_y.current = adjustedRect.current;    
          
        }
          rect = (e.touches[0].clientX / window.innerWidth) * 100;
         if (shouldRotate && rect >= tablerect.left / window.innerWidth * 100 && rect <= tablerect.right / window.innerWidth * 100) {
          adjustedRect.current = rect - (tablerect.left / window.innerWidth * 100);
          adjustedRect.current = adjustedRect.current * 100 / (tablerect.width / window.innerWidth * 100);
         
          
            position.current.stop = 1;
            p_y.current = adjustedRect.current;
          
        }
      }

    }

  return (
    <div>
        {gameover  && <Gameresult result = { scores.player1score ==7 || Winner == true   ? "You Win" :   "You Lose" }/>}
        <div className="fixed  flex  justify-center items-center  w-[100vw] h-[100vh] ">
          <div className="Gamecader flex  flex-col justify-center items-center   mt-5 relative" >
          <div 
          className=" bg-[#1B266B] from-[#131795] via-[#d6d5e1] to-[#131795] hover:bg-gradient-to-br focus:ring-4 focus:outline-none  rounded-lg  text-center   ">
            <AlertDialog /> 
            </div>
            <div className="score flex  justify-between items-center  font-lalezar text-xs" id = "score">
              <div className="PlayerProfile">
                <Image className="mb-[7px]"  src={ game?.lodingdata.users[0].image || ""  }  width={48} height={48}  alt ="Player image" 
                  style={
                    {
                     width: 40,  
                      height: 40,
                      borderRadius: "50%"
                    }
                  }></Image>
                <p  className="mt-[7px]" >{game?.lodingdata.users[0].username}</p>
              </div>
              <div  className="scoredisplay" id = "scoredisplay" >
                <div className="leftscore" id = "leftscore">{position.current.player1score}
                </div>
                <p>:</p>
                <div className="rightscore" id = "rightscore">{position.current.player2score}
                </div>
              </div>
              <div className="PlayerProfile">    
                <Image  className="mb-[7px]" src={ game?.gametype == "ai"  && game?.lodingdata.users[1].username == "ROBOT" ?  "./homeImages/robot.svg"  :   game?.lodingdata.users[1].image || "" } width={48} height={48}  alt ="Player image" 
                style={
                        {
                         width: 40,  
                          height: 40,
                          borderRadius: "50%"
                        }
                      }
                ></Image>
                <p className="mt-[7px]">{game?.lodingdata.users[1].username}</p>
              </div>
            </div>
            <div className="flex justify-center items-center" style = {{
              height: shouldRotate ?  dimensions.width : dimensions.height ,
              width: shouldRotate ?  dimensions.height : dimensions.width
            }}>
              <canvas onTouchMove={handleTouchMove}    ref={canvasRef} width={dimensions.width}  style={
                        {transform: shouldRotate ? 'rotate(-90deg)' : 'none',
                          transformOrigin: 'center center'
                        }}
                        height={dimensions.height} />
            </div>
          </div>
        </div>
    </div>
  )
};

export default Game;