import Image from "next/image";
import Profile from "./Profile";
import { UserData } from "@/components/context/context";
import { use, useContext, useEffect, useState } from "react";
import UserDataContext from "@/components/context/context";
import { GameContext, NotificationContext } from "../Game/Gamecontext/gamecontext";
import SocketContext from "@/components/context/socket";
import RenderContext from "@/components/context/render";

const PhoneLogo = ()=>{}

const Logo = ()=>{
    return (
        <div className="logo">
            <Image src="./homeImages/logo.svg" alt="logo" className="applogo" width={36} height={42}/>
            <Image src="./homeImages/PONGy.svg" className="Pongy" alt="logo" width={106} height={36}/>
        </div>
    );
}

const Notification = () =>{
    return (
        <div className="notification">
            <Image className="notificationLogo" src="./homeImages/Ell.svg" alt="logo" width={48} height={48}/>
            <Image className="notificationLogo" src="./homeImages/Ell1.svg" alt="logo" width={42} height={42}/>
            <Image className="notificationLogo" src="./homeImages/Ell2.svg" alt="logo" width={26} height={26}/>
        </div>
    );
}

const Invite = () => {
const socket  = useContext(SocketContext );
  const [notification , setNotification] = useState({invitationSenderID: "", username: "", userimage: "", message: "" , mode : ""});
  const [display, setDisplay] = useState(false);
  const [displayChoise , setDisplayChoise] = useState(false);
  const game = useContext(GameContext);
  const render = useContext(RenderContext);
  const user = useContext(UserDataContext );
  useEffect(() => {

    const resetgame = () => {
        game?.setRunning(false);
        game?.setlodingdata({
          users  : [{
            clientid : user?.id || -1 ,
               image : user?.image || "no image",
               username : user?.userName || "no name" ,
                ingame : false
      } ] ,
          gameloding: true });   
        game?.setplayerposition("");
        game?.setGamemode("");
        game?.settype("");
        game?.setgamefriend(-1);
    }

    const HandelNotification = () => {

      socket?.on("gameInvitation", (data) => {
        console.log("message" , data);
        setNotification(data);
        setDisplayChoise(true);
        setDisplay(true);
        setTimeout(() => {
            setDisplay(false);
            setDisplayChoise(true);
        }, 5000);
      });

      socket?.on("gameresponse", (data) => {
        console.log("message1" , data);
        setNotification(data);
        setDisplayChoise(false);
        setDisplay(true);
    
        if(data.response == false)
        {
            resetgame();
            render?.setRender("home");
        }
        setTimeout(() => {
            setDisplay(false);
            setDisplayChoise(true);
        }, 3000)
      })


    }
    HandelNotification()

    
        return () => {
            socket?.off("gameInvitation");
        }
  }, [socket]);

    return (
        <>
        {
                display &&
            <div className="Gameinvite drift-animation">
                <div className="userprofile">
                    <Image src={notification.userimage}  className="userpic" alt="image" width={34} height={34}/>
                </div>
                <div className="info">
                    <h2 className="username">{notification.username}</h2>
                    <p className="type">{notification.message}</p>
                </div>
                {
                        displayChoise &&  <div className="desicion ">
                        <Image src="./homeImages/Deny.svg" className="yes-no   " alt="image" width={24} height={24}  onClick={() =>
                        { 
                            socket?.emit("gameInvitation", { clientID : user?.id ,  invitationSenderID: notification.invitationSenderID , response: false});
                            setDisplay(false);
                        } 
                        } />
                        <Image src="./homeImages/Accept.svg" className="yes-no " alt="image" width={24} height={24} onClick={() =>
                            {
                                socket?.emit("gameInvitation", {  clientID : user?.id , invitationSenderID: notification.invitationSenderID , response: true});
                                game?.setGamemode(notification.mode);
                                game?.settype("friend");
                                render?.setRender("playGame");
                                setDisplay(false);
                            }
                        } />
                    </div>
                }
            </div>
        }
        </>
    );
}


const Header = () =>{
    const data: UserData | null = useContext(UserDataContext);
  


    return (
        <div className="header">

            <div className="leftBar">
                <Invite/>
            </div>
            
            <div className="rightBar ">
               <Notification  />
                <Profile src={data?.image}/>
                
                <h2 className="hidden md:block "> {data?.userName}</h2>
            </div>
           
        </div>

    );
}

const Navbar = () =>{
    return (
        <div className="navbar">
                <Logo/>
                <Header/>
        </div>
    );
}


export default Navbar