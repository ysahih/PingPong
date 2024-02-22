import Head from "next/head";
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

const Chat = () =>{
    return (

        <div className="chat">
            
           <Header/>
            <hr className="line"></hr>
            <Memebers/>
        
            <></>
        </div>
    );
}

export default Chat