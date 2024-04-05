"use client";

import { use, useContext, useEffect, useRef, useState } from "react";
import { GameContext, GameLodingProps, Gameresponse } from "../Gamecontext/gamecontext";
import UserDataContext from "@/components/context/context";
import SocketContext from "@/components/context/socket";
import Image from "next/image";
import Gameresult from "./Gameresult";



const Game : React.FC<{}> = () => {
  const game = useContext(GameContext );
  const canvasRef = useRef <HTMLCanvasElement>(null);
  const [gameover , setgameover] = useState<boolean>(false); 
  const Socket = useContext(SocketContext);
  const user = useContext(UserDataContext );
  const [scores, setScores] = useState({ player1score: 0, player2score: 0 });
  const [shouldRotate, setShouldRotate] = useState(false);
  const p_y = useRef(50);
  const adjustedRect = useRef(50);
  const isMouseDown = useRef(false);



  const [dimensions, setDimensions] = useState({ width: (window.innerWidth * 0.6), height: window.innerHeight * 0.4 });


  
  var bodie = {p_Width: dimensions.width  * 0.011, p_Height: dimensions.height * 0.17 , b_Width: dimensions.width * 0.01 };
  var color  = { background : game?.gamemode == "Frozen Arena" ? "#0064FB" : "#1B266B"  , player: game?.gamemode == "Frozen Arena" ? "#1B266B" : "#0064FB",  grid : game?.gamemode == "Frozen Arena" ? "#1ECDF8" : "#081041" ,ball: "#00FFE0"}
  const position = useRef<Gameresponse >({player1: 50, player2: 50, player1score: 0, player2score: 0, ball: { x: 50, y: 50 } , stop : 0 , gameover : false});
  useEffect (() => {
    const updatePosition = (mydata: Gameresponse ) => {
      console.log(mydata);
      if (game?.playerposition == "left")
      {
        // console.log(mydata);
        // console.log(game?.playerporistion);
        position.current.ball =  mydata.ball;
        position.current.player1 = mydata.player1;
        position.current.player2 = mydata.player2;
        position.current.player1score = mydata.player1score;
        position.current.player2score = mydata.player2score;
      }
      else if (game?.playerposition == "right")
      {
        // console.log(mydata);
        // console.log(props.playerporistion);
        position.current.ball.y =  mydata.ball.y;
        position.current.ball.x = 100 - mydata.ball.x;
        position.current.player1 = mydata.player2;
        position.current.player2 = mydata.player1;
        position.current.player1score = mydata.player2score;
        position.current.player2score = mydata.player1score;
      }
      position.current.stop = mydata.stop;
      position.current.gameover = mydata.gameover;
      if (position.current.player1score != scores.player1score || position.current.player2score != scores.player2score)
      {
        setScores({ player1score: position.current.player1score, player2score: position.current.player2score });
      }
    };
    Socket?.on("game", updatePosition);
    Socket?.emit("game", { clientid: user?.id, player: { y: p_y.current }, moveball: position.current.stop , player1score :scores.player1score, player2score: scores.player2score});
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

    if (context) {
      let animationFrameId: number;
      const draw = () => {


        context.fillStyle = color.background ; 
        context.fillRect(0, 0, dimensions.width, dimensions.height); 
        context.fillStyle = color.player ; 
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
            context.fillStyle = color.grid ;
            context.fillRect(dimensions.width * 0.495 ,
              dimensions.height * 0.05 ,
              dimensions.width * 0.01 ,
              dimensions.height * 0.9 )
            
            context.beginPath();
            context.fillStyle = color.ball; 
            context.arc(
                dimensions.width * position.current.ball.x / 100, 
                dimensions.height * position.current.ball.y / 100, 
                bodie.b_Width, 
                0, 
                Math.PI * 2
            );
            context.fill();
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

  return (
    <div>
        {gameover && <Gameresult result = {scores.player1score > scores.player2score ? "You Win" : "You Lose"}/>}
        <div className="fixed  flex  justify-center items-center  w-[100vw] h-[100vh]">
          <div className="Gamecader flex  flex-col justify-center items-center   mt-5 " >
            <div className="score flex  justify-center items-center " id = "score">
              <div className="PlayerProfile sideleft">
                < Image  className="rounded-full" src={ game?.lodingdata.users[0].image || ""  }  width={40} height={40}  alt ="Player image" ></Image>
                <p>{game?.lodingdata.users[0].username}</p>
              </div>
              <div  className="scoredisplay" id = "scoredisplay" >
                <div className="leftscore" id = "leftscore">{position.current.player1score}
                </div>
                <p>:</p>
                <div className="rightscore" id = "rightscore">{position.current.player2score}
                </div>
              </div>
              <div className="PlayerProfile sideright">    
                <Image  className="rounded-full" src={ game?.lodingdata.users[1].image || ""} width={40} height={40}  alt ="Player image" ></Image>
                <p>{game?.lodingdata.users[1].username}</p>
              </div>
            </div>
            <div className="flex justify-center items-center" style = {{
              height: shouldRotate ?  dimensions.width : dimensions.height ,
              width: shouldRotate ?  dimensions.height : dimensions.width
            }}>
              <canvas ref={canvasRef} width={dimensions.width}  style={
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