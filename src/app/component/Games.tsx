import Image from "next/image"
import { GameContext } from "../Game/Gamecontext/gamecontext";
import { useContext } from "react";
import RenderContext from "@/components/context/render";
import UserDataContext from "@/components/context/context";

const Games = () => {
  const game = useContext(GameContext);
  const render = useContext(RenderContext);
  const user = useContext(UserDataContext);

    return (

      <div className="Games">
      <div className="gameContainer">

          <div className="darkRow">

            <div className="gameTable">
                <Image src="./homeImages/darktable.svg" alt="table" width={200} height={200}/>
            </div>

            <div className="tabledescribtion">
                <h2> Dark Valley</h2>
                <p>Play in a dark environment and get Dark</p>
                <p>Valley’s achievement</p>
                <button className="Playbutton"  onClick={

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
                <h2>Frozen Arena</h2>
                <p>Play in a Light environment and get Frozen</p>
                <p>Arena's achievement</p>
                <button className="Playbutton" onClick={ 
                  ()=>{      
                      game?.setRunning(false);
                      game?.setGamemode("Frozen Arena");
                      game?.settype("random");
                      game?.setgamefriend(-1);
                      render?.setRender("playGame");
                  
                  }
                
                } >Play</button>
            </div>

            <div className="gameTable">
                <Image src="./homeImages/lighttable.svg" alt="table" width={200} height={200}/>
            </div>
          </div>

          <div className="robot">

          <div className="gameTable">
                <Image src="./homeImages/robot.svg" alt="table" width={90} height={60}/>
          </div>

            <div className="tabledescribtion">
                <h2>ROBOT</h2>
                <p>Play against the robot and get</p>
                <p>a champion</p>
                <button className="Playbutton" onClick={ 
                  ()=>{      
                      // game?.setRunning(false);
                      // game?.setGamemode("Frozen Arena");
                      // game?.settype("random");
                      // game?.setgamefriend(-1);
                      // render?.setRender("playGame");
                  }
                
                } >Play</button>
            </div>

          </div>

      </div>
      </div>
    )
  }

export default Games