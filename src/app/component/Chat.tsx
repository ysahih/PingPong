// import Head from "next/head";
import { useState } from "react";
import Image from "next/image";



const Header = () =>{
    return(
        <div className="chatheader">
            <Image src="/homeImages/chat.svg" alt="logo" width={19} height={17}/>
            <h2>General Chat</h2>
        </div>
    );
}

const Memebers = ()=>{
    return (
        <div className="chatmembers">

            <div className="text">
                <p className="sentence">Chat Members:</p>
                <p className="number">50</p>
            </div>

            <div className="profiles">
                <Image className="profilepic" src="/homeImages/memeber1.svg" alt="member" width={35} height={35}/>
                <Image className="profilepic" src="/homeImages/memeber1.svg" alt="member" width={35} height={35}/>
                <Image className="profilepic" src="/homeImages/memeber1.svg" alt="member" width={35} height={35}/>
            </div>
        </div>
    );
}

const UserOption = ({ className }) => {
    return (
        <div  className={`userOption ${className}`}>
            <div className="block">
                <Image className="optionlogo" src="/homeImages/chat.svg" alt="logo" width={19} height={17}/>
                <p>Block</p>
            </div>
            <hr className="liney"></hr>
            <div className="clash">
                <Image className="optionlogo" src="/homeImages/chat.svg" alt="logo" width={19} height={17}/>
                <p>Clash</p>
            </div>
        </div>
    );
}

const More = ()=> {

    const [showUserOption, setShowUserOption] = useState(false);

    const handleToggleUserOption = () => {
      setShowUserOption(!showUserOption);
    };

    return (
        <div className="more">
            <Image className="dots" onClick={handleToggleUserOption} src="/homeImages/dots.svg" alt="member" width={12} height={16}/>
            <UserOption className={showUserOption ? '' : 'invisible'} />
            <p className="date">15:30</p>
        </div>
    );
}

const Message = () =>{
    return (
        <div className="Message">

            <div className="picture">
                <Image className="profilepic" src="/homeImages/memeber1.svg" alt="member" width={40} height={40}/>
            </div>

            <div className="messageInfo">
                <h2 className="sendeName">Username</h2>
                <p className="msg" >hello, how you doing!</p>
            </div>

           <More/>

        </div>
    );
}


const Chat = () =>{
    return (

        <div className="chat">
            <div className="chatbar">
                <Header/>
                <hr className="line"></hr>
            </div>

            <Memebers/>
            <div className="messagesHolder">
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
            </div>
        </div>
    );
}

export default Chat