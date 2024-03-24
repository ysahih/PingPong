// import Head from "next/head";
import { RiSendPlaneFill } from "react-icons/ri";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useContext } from "react";
import { ChatData } from "./Dto/Dto";
import { Input } from "postcss";
import { number } from "yup";
import axios from "axios";
import SocketContext from "@/components/context/socket";
import UserDataContext from "@/components/context/context";
import { input } from "@material-tailwind/react";
import ChatContext, { chatContext } from "@/components/context/chatContext";


const Header = () =>{
    return(
        <div className="chatheader">
            <Image src="./homeImages/chat.svg" alt="logo" width={19} height={17}/>
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
                <Image className="profilepic" src="./homeImages/memeber1.svg" alt="member" width={35} height={35}/>
                <Image className="profilepic" src="./homeImages/memeber1.svg" alt="member" width={35} height={35}/>
                <Image className="profilepic" src="./homeImages/memeber1.svg" alt="member" width={35} height={35}/>
            </div>
        </div>
        </>
    );
}

interface userOptionClass{
    className: string;
}

const UserOption = ( { className }: userOptionClass ) => {
    return (
        <div  className={`userOption ${className}`}>
            <div className="block">
                <Image className="optionlogo" src="./homeImages/chat.svg" alt="logo" width={19} height={17}/>
                <p>Block</p>
            </div>
            <hr className="liney"></hr>
            <div className="clash">
                <Image className="optionlogo" src="./homeImages/chat.svg" alt="logo" width={19} height={17}/>
                <p>Clash</p>
            </div>
        </div>
    );
}
type Props = {
    handleMsgClick: (value:number) => void;
    user : ChatData;
};

const More = ({user}: {user: ChatData})=> {

    const [showMsgOption, setShowMsgOption] = useState(false);
    
    const chatDate = new Date(user.createdAt);
    const currentDate = new Date();
    let formattedDate;
    if (chatDate.toDateString() === currentDate.toDateString()) {
      const hours = chatDate.getHours();
      const minutes = chatDate.getMinutes();
      formattedDate = `${hours< 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    } else {
      formattedDate = chatDate.toLocaleDateString();
    }

    const handleMsgOption = () => {
      setShowMsgOption(!showMsgOption);
    };

    return (
        <div className="more">
            <Image className="dots" onClick={handleMsgOption} src="./homeImages/dots.svg" alt="member" width={16} height={16}/>
            <UserOption className={showMsgOption ? '' : 'invisible'} />
            <p className="date">{formattedDate}</p>
        </div>
    );
}



const Message = ({handleMsgClick, user} : Props) =>{

    const handleClick = ()=>{
        handleMsgClick(user.id);
    }

    return (
        <div className="Message">

            <div className="chatData" onClick={()=>{handleMsgClick(user.id)}}>
                <div className="picture">
                    <Image className="profilepic" src="./homeImages/memeber1.svg" alt="member" width={48} height={40}/>
                </div>

                <div className="messageInfo">
                    <h2 className="sendeName">{user.userName}</h2>
                    <p className="msg" >{user.lastMessage.length < 30 ? user.lastMessage : user.lastMessage.slice(0, 30) + "..."}</p>
                </div>
            </div>

           <More user={user} />
        </div>
    );
}

const Conversation = ({handleMsgClick, user}: Props) =>{

    
    const socket = useContext(SocketContext);
    const [Input, setInput] = useState("");
    const sender  = useContext(UserDataContext);
    const sendInput = () => {
        socket?.emit("directMessage", {
            from: sender?.id,
            to : user.id,
            message: Input
        })
    }
    const handleClick = ()=>{
        handleMsgClick(0);
    }
    const handleInput = (event)=>{
        setInput(event.target.value)
    }
    useEffect(()=>{
        socket?.on("chat", (convodata)=>{
            console.log(convodata)
        });
        return () => {
            socket?.off("chat");
        }
    }, [])
    //TODO: fetch all messages (user to user).
    // useEffect(()=>{

    //     const respose = await axios.get("https://localhost");
        
    // }, [])
    return (
        <div className="conversation">
            <div className="convo">
                <div className="convoHeader">
                    <div className="sender-info">
                        <Image src="./homeImages/memeber1.svg" width={38} height={42} alt="photo"/>
                        <h2>{user.userName}</h2>
                    </div>
                    <Image className="go-back" src="./homeImages/goback.svg" onClick={handleClick} width={28} height={25} alt="back" />
                </div>
                <hr />

                <div className="convoHolder">
                    
                </div>
            </div>
            <div className="input-footer">
                <textarea className="convoInput" placeholder="Send a Message..." onSubmit={handleInput}/>
                <RiSendPlaneFill className="sendLogo" onClick={sendInput}/>
            </div>
        </div>
    );
}
// const ChatChat = ()=>{
//     return (
//         <div className="">
//             <div className="chatbar">
//                 <Header/>
//                 <Memebers/>
//             </div>
//              <div className="messagesHolder">
//                 <Message />
//             </div> 
//         </div>
//     );
// }


const Chat = () => {
    
    //TODO: fetch HTTP chat data;: done
    //(after getting the data, it should be mapped in as messages)// Done;

    //(then we should listen for 2 events: *online and *newMessage) // before and after entering the conversation 
    
    //firts we add new messages recieved on the socket to the Message map//

    const [chatdata, setChatdata] = useState<ChatData[] | null >(null);
    const socket = useContext(SocketContext);
    // const [chat, setchat]  = useState(0);
    const Convo = useContext(ChatContext);

    // const handleMsgClick = (value:number)=>{
    //     setchat(value);
    // }

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/user/conversation', {
                    withCredentials: true,
                });
                // console.log(response.data);
                setChatdata(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        //listen
        socket?.on("newConvo", (newChatData) =>{
            console.log(newChatData);
            chatdata?.push(newChatData);
        })

        return () => { socket?.off("newConvo") }
    }, []);


    return (
        <div className="chat">
            {Convo?.chat === 0 && <div className="">
                <div className="chatbar">
                    <Header/>
                    <Memebers/>
                </div>
               
                <div className="messagesHolder">
                    {chatdata?.map((user: ChatData) => (
                        <Message handleMsgClick={()=>Convo?.setChat(user.id)} user={user} />
                    ))}
                 </div>
            </div>}
            {Convo?.chat !== 0 && <Conversation handleMsgClick={()=>Convo?.setChat(0)} user={chatdata?.find(user => user?.id === Convo?.chat)!} />}
            
        </div>
    );
}

export default Chat