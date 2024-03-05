// import Head from "next/head";
import { RiSendPlaneFill } from "react-icons/ri";
import { useState } from "react";
import Image from "next/image";
import { Input } from "postcss";



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
        <>
        <hr className="line"></hr>
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
        </>
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

    const [showMsgOption, setShowMsgOption] = useState(false);

    const handleMsgOption = () => {
      setShowMsgOption(!showMsgOption);
    };

    return (
        <div className="more">
            <Image className="dots" onClick={handleMsgOption} src="/homeImages/dots.svg" alt="member" width={12} height={16}/>
            <UserOption className={showMsgOption ? '' : 'invisible'} />
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

const Conversation = () =>{
    return (
        <>
            <div className="convo">
                <div className="convoHeader">
                    <div className="sender-info">
                        <Image src="./homeImages/memeber1.svg" width={38} height={42} alt="photo"/>
                        <h2>Username</h2>
                    </div>
                    <Image className="go-back" src="./homeImages/goback.svg" width={28} height={25} alt="back"/>
                </div>
                <hr />

                <div className="convoHolder">
                    <div className="myMsg">
                        <p>hello there from youssef sahih i want to try if the width and height fit perfectly and yes did they do;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>hello there;</p>
                    </div>
                    <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div>
                    <div className="myMsg">
                        <p>finish</p>
                    </div>
                    {/* <div className="othersMsg">
                        <p>hi, thank you</p>
                    </div> */}
                </div>

            </div>
            <div className="input-footer">
                <input className="convoInput" placeholder="Send a Message..."/>
                <RiSendPlaneFill className="sendLogo"/>
            </div>
        </>
    );
}


const Chat = () =>{

    return (
        <div className="chat">
            <div className="chatbar">
                <Header/>
            </div>

            
            {/* <Memebers/> */}
            {/* <div className="messagesHolder">
                <Message />
            </div> */}

            <Conversation/>
        </div>
    );
}

export default Chat