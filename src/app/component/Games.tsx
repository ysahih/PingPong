"use client";
import Image from "next/image"
import { GameContext } from "../Game/Gamecontext/gamecontext";
import { useContext, useRef, useState } from "react";
import RenderContext from "@/components/context/render";
import UserDataContext from "@/components/context/context";
import { useRouter } from "next/navigation";
import QrContainer from "@/components/Qrcode/QRcode";
import { Carousel } from "@material-tailwind/react";
import { useClickAway } from "@uidotdev/usehooks";
import CloseBtn from "@/components/closebtn";



const HowToPlay = (props : {close : (close : boolean) => void }) => {
  // const [close, setClose] = useState(false);

  return (


      <div   className=" w-[90%]   md:w-[700px] md:h-[800px]  bg-[#FFFFF] " >
        <div  className="w-[100%]  flex justify-end  ">
        <CloseBtn  close={props.close} />
        </div>
      <Carousel placeholder="carousel  " >
        <div  className="  w-[100%] h-[100%]  md:w-[80%]  mx-auto  "  >
          <img src="HowToPlay/ChoseMod.png" width={800} height={800} alt="explaine Game Rulses" />
        </div>

        <div   className="   w-[100%] h-[100%]  md:w-[80%]  mx-auto  " >
          <img src="HowToPlay/HowToMovePlayer.png" width={800} height={800} alt="explaine Game Rulses" />
        </div>
        </Carousel>
      </div>
  )

}





const Games = () => {
  const game = useContext(GameContext);
  const render = useContext(RenderContext);
  const user = useContext(UserDataContext);
  const [renderHowToPlay, setRenderHowToPlay] = useState(false); 
  const ref = useClickAway<HTMLDivElement>(() => {
    setRenderHowToPlay(false);
  });

    return (
      <div className="Games">
      <div className="gameContainer">

          <div className="darkRow">

            <div className="gameTable">
                <Image src="/homeImages/darktable.svg" alt="table" width={200} height={200}/>
            </div>

            <div className="tabledescribtion">
                <h2> Dark Valley</h2>
                <p>Play in a dark environment and get Dark</p>
                <p>Valley’s achievement</p>
                <button ref={ref} className="Playbutton"  onClick={
                  ()=>{
                    game?.setRunning(false);
                    game?.setGamemode("Dark Valley");
                    game?.settype("random");
                    game?.setgamefriend(-1);
                    render?.setRender("playGame");
                  }
                }   >Play</button>
            </div>
          </div>

          <div className="LightRow">

            <div className="tabledescribtion">
                <h2>Flame Arena</h2>
                <p>Play in a Flame environment and get Flame</p>
                <p>Arena's achievement</p>
                <button className="Playbutton" onClick={ 
                  ()=>{      
                      game?.setRunning(false);
                      game?.setGamemode("Flame Arena");
                      game?.settype("random");
                      game?.setgamefriend(-1);
                      render?.setRender("playGame");
                  }
                } >Play</button>
            </div>

            <div className="gameTable">
                <Image src="/homeImages/FlameArena.png" alt="table" width={200} height={200}/>
            </div>
          </div>

          <div className="robot">

          <div className="gameTable">
                <Image src="/homeImages/robot.svg" alt="table" width={90} height={60}/>
          </div>

            <div className="tabledescribtion">
                <h2>ROBOT</h2>
                <p>Play against the robot to </p>
                <p>test your might</p>
                <button className="Playbutton" onClick={ 
                  ()=>{      
                      game?.setRunning(false);
                      game?.setGamemode("Dark Valley");
                      game?.settype("ai");
                      game?.setgamefriend(-1);
                      render?.setRender("playGame");
                  }
                
                } >Play</button>
            </div>
          </div>
            <div className="howto w-[80%] h-[5%] flex  justify-end ">
                <button className="bg-[#535C91] w-[120px] h-[30px] rounded-[6px] text-[#FFFFFF]   border-t-[0.2px] border-hover-border-color-[#9290C3] flex justify-center items-center"
                  onClick=
                  {
                    ()=>{
                      setRenderHowToPlay(true);
                    }
                  }>
                    How To Play
                </button>
            </div>
            {renderHowToPlay && 
            (  
              <div className="QrContainer">
                <div ref={ref} >
                    <HowToPlay  close={setRenderHowToPlay} />   
                </div>
              </div>
            )
            } 
      </div>
      </div>
    )
  }

export default Games