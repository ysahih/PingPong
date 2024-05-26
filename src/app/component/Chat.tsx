"use client";

import { CircularProgress } from "@mui/material";
import { RiSendPlaneFill } from "react-icons/ri";
import { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useContext } from "react";
import { ChatData } from "./Dto/Dto";
import { Input } from "postcss";
import { array, number } from "yup";
import axios from "axios";
import SocketContext from "@/components/context/socket";
import UserDataContext from "@/components/context/context";
import { input } from "@material-tailwind/react";
import ChatContext, { chatContext } from "@/components/context/chatContext";
import { ConvoData } from "./Dto/Dto";
import { send } from "process";
import RenderContext, { renderContext } from "@/components/context/render";
import { render } from "react-dom";
import type { Message } from "./Dto/Dto";
import TimeAgo from "javascript-time-ago";
import { getTimeAgo } from "./timeAgo";
import { useRouter } from "next/navigation";

const Header = () =>{
    return(
        <div className="chatheader">
            <Image src="/homeImages/chat.svg" alt="logo" width={19} height={17}/>
            <h2>General Chat</h2>
        </div>
    );
}

interface Pics {
    chatdata: ChatData[] | null;
  }


  
const Members: React.FC<Pics> = ({ chatdata }) => {

    const members = chatdata?.length! > 3 ? chatdata?.slice(0, 3) : chatdata;
    return (
        <>
        <hr className="line"></hr>
        <div className="chatmembers">

            <div className="text">
                <p className="sentence">Chat Members:</p>
                <p className="number">{chatdata?.length}</p>
            </div>

            <div className="profiles">
                {members && members.map((user: ChatData, index) => (
                    <Image  className={members?.length > 1 ? "profilepics" : 'profilepics-mar'}
                            src={ user.image ? user.image : "/homeImages/memeber1.svg"} 
                            alt="member" 
                            key={index}
                            width={28} height={20}/>
                ))}
                
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
                <Image className="optionlogo" src="/homeImages/chat.svg" alt="logo" width={19} height={17}/>
                <p>Block</p>
            </div>
            <hr className="liney"></hr>
            <div className="clash">
                <Image className="optionlogo" 
                    src="/homeImages/chat.svg" 
                    alt="logo" 
                    width={19} height={17}/>
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
    
    const [timeAgo, setTimeAgo] = useState<TimeAgo | null>(null);
  
    useEffect(() => {
      setTimeAgo(getTimeAgo());
      return () => {
        setTimeAgo(null);
      };
    }, []);

    const handleMsgOption = () => {
      setShowMsgOption(!showMsgOption);
    };

    return (
        <div className="more">
            <div className="dotscontainer" onClick={handleMsgOption}>
                <Image className="dots" src="/homeImages/dots.svg" alt="member" width={16} height={16}/>
            </div>
            <UserOption className={showMsgOption ? '' : 'invisible'} />
            <p className="date">{timeAgo?.format(new Date(user.createdAt))}</p>
        </div>
    );
}



const Message = ({handleMsgClick, user } : Props) =>{

   

    return (
        <div className="Message">

            <div className="chatData" onClick={()=>{handleMsgClick(user.id)}}>
                <div className="picture">
                    <Image className="profilepic" src={user?.image? user.image : "/homeImages/memeber1.svg"} alt="member" width={48} height={40}/>
                </div>

                <div className="messageInfo">
                    <h2 className="senderName">{user.userName}</h2>
                    <p className="msg" >{user?.lastMessage?.length < 20 ? user?.lastMessage : user.lastMessage?.slice(0, 20) + "..."}</p>
                </div>
            </div>

           <More user={user} />
        </div>
    );
}



 

  type ConvoProps = {
    handleMsgClick: (value:number) => void;
    inConvo: Message;
    userId: number;
    updateChat: (newChatData: ChatData) =>void
    handleConvo : () => void;
};

const Conversation = (props : ConvoProps) =>{

    const socket = useContext(SocketContext);
    const sender  = useContext(UserDataContext);
    const [Input, setInput] = useState("");
    const [convo, setConvo] = useState<ConvoData | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const render = useContext(RenderContext);
    const scrollableDivRef = useRef<HTMLDivElement>(null);
    const [timeAgo, setTimeAgo] = useState<TimeAgo | null>(null);
    const [typing, setTyping] = useState<Boolean> (false);

    useEffect(() => {
      const scrollableDiv = scrollableDivRef.current;
      if (scrollableDiv)
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
      
    });

    const appendMessage = (newMessage: Object) => {
        setConvo((prevConvo :any) => {
          if (prevConvo?.messages) {
            const updatedConvo = {
              ...prevConvo,
              messages: [...prevConvo.messages, newMessage],
            };
            return updatedConvo;
          }
          return ({
            ...prevConvo, 
            messages: [newMessage],
          });
        });
      };

    const sendInput = (e: any) => {

        e.preventDefault();
        if (Input.length > 0) {

            setTimeout(() => {
            socket?.emit("directMessage", {
                from: sender?.id,
                to: props.userId,
                message: Input,
                createdAt: new Date(Date.now()),
            });
        }, 1000);
      
          const newMessage = { content: Input, userId: sender?.id, createdAt: Date.now()};
          appendMessage(newMessage);
          

          props.updateChat({id: props.userId,
                            userName: convo?.userName!,
                            image: convo?.image!,
                            lastMessage: Input,
                            isOnline: false, // will be added
                            isRead: false, //will be removed
                            isRoom: false,
                            createdAt: new Date()
            });
          setInput('');
          if (inputRef.current)
            inputRef.current.value = '';
        }
      };

    const handleClick = ()=>{
        props.handleMsgClick(0);
    }

    //fetch http data
    useEffect(()=>{
        const fetchConvo  = async () =>{
            try{
                
                // const request = userId > 0 ? process.env.NEST_API + '/user/messages?id=' + userId.toString()
                //                 : process.env.NEST_API + '/user/messages?roomName=' + roomName;
                const response = await axios.get(process.env.NEST_API + '/user/messages?id=' + props.userId.toString(), {
                    withCredentials: true,
                });
                setConvo(response.data);
            } catch {
                console.log('Error Fetching data for all messages !');
            }
        }
        fetchConvo();
        
    }, [props.userId]);

    //appending new messages that are passed as props 
    useEffect(()=>{
        if (props.inConvo?.content)
            appendMessage({content: props.inConvo.content, userId: props.inConvo.senderID, createdAt: props.inConvo.createdAt})
        props.handleConvo();
    }, [props.inConvo?.content]);

    
    const handleTyping = (e: any) => {
        socket?.emit("typing", {
            from: sender?.id,
            to: props.userId,
        })
        setInput(e.target.value);
    }

    useEffect(()=>{
        socket?.on("isTyping", (payload : {from: number}) => {

            if (payload.from === props.userId) {

                setTyping(true);
                setTimeout( () => {
                    setTyping(false);
                }, 2000);
            }
        })
        setTimeAgo(getTimeAgo());
        return () => {
            socket?.off("isTyping");
              setTimeAgo(null);
        };
    }, []) ;
    const router = useRouter();
    return (

        <div className="conversation">
            {convo === null && <div className="loading">
                        <CircularProgress />
            </div> }
            {
                convo &&
            <>
            <div className="convo">
                <div className="convoHeader">
                    <div className="sender-info  cursor-pointer" onClick={() => {render?.setRender("profileOverly")
                    router.push("/users?userName=" + props.userId.toString())

                    }}>
                        <Image className="profilepic" src={convo?.image ? convo.image : "/homeImages/memeber1.svg"} width={38} height={42} alt="photo"/>
                        <div>
                            <h2>{convo?.userName}</h2>
                            <p className="typing">{typing ? 'Typing' : 'online'}</p>
                        </div>
                    </div>
                    <Image className="go-back cursor-pointer" src="/homeImages/goback.svg" onClick={handleClick} width={28} height={25} alt="back" />
                </div>
                <hr className="line"/>
                
             <div className="convoHolder" ref={scrollableDivRef}>
                    {convo?.messages?.map((message: Message, index: number) => (
                        <div  key={index} className={props.userId === message.senderID ? "othersMsg" : "myMsg"}>
                            <p className={`sentAt ${props.userId === message.senderID ? "othersDate" : "myDate"}`}>{timeAgo?.format(new Date(message.createdAt))}</p>
                            <div className={props.userId === message.senderID ? "othersContent" : "myContent"}>
                                <p className="msgContent">{message?.content}</p>
                            </div>
                        </div>
                    ))} 
                </div>
            
            </div>

              <form onSubmit={sendInput} className="input-footer">
                <input ref={inputRef} type="text" className="convoInput" placeholder="Send a Message..." onChange={handleTyping}/>
                <button type="submit" >
                  <RiSendPlaneFill className="sendLogo" />
                </button>
              </form>
            </>
            }

            </div>
    );
}


const Chat = () => {

    const [chatdata, setChatdata] = useState<ChatData[] | null >(null);
    const socket = useContext(SocketContext);
    const Convo = useContext(ChatContext);
    const [inConvo, setInConvo]  = useState<Message>();

    const appendChat = (newChatData: ChatData) => {
        setChatdata((prevConvo) => {
          if (prevConvo) {
            const updatedConvo = [ newChatData, ...prevConvo ];
            return updatedConvo;
        }
        return [newChatData];
        });
    };

    useEffect(() => {
        //fetching chat data.
        const fetchData = async () => {
            try {
                const response = await axios.get(process.env.NEST_API + '/user/conversation', {
                    withCredentials: true,
                });
                setChatdata([...response.data].reverse());
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
            //!! if a user is blocked i should not recieve it from the back-end
    }, []);


    const updateChat = (newChatData: ChatData) =>{
        
        // if the conversation exists:
        // ^^ this logic gets it sorted when appending new conversations ^^ \\
        if (chatdata?.some( olddata => olddata.id === newChatData.id))
                setChatdata(chatdata.filter(chat => chat.id !== newChatData.id));
            appendChat(newChatData);
    }
    // listen
    useEffect(() => {
        socket?.on("newConvo", (newChatData: ChatData) => {
            updateChat(newChatData);
            
            // if you are inside the convo we pass the new message as props
            if (Convo?.chat === newChatData.id)
                setInConvo({content: newChatData.lastMessage, createdAt: newChatData.createdAt, senderID: newChatData.id});
        })
        return () => { socket?.off("newConvo")}
    }, [chatdata, Convo?.chat]);


    return (

            <div className="chat">
            
                    {Convo?.chat === 0 &&
                    <div>
                        <div className="chatbar">
                            <Header/>
                            <Members chatdata={chatdata}/>
                        </div>
                        
                        <div className="messagesHolder">
                            {chatdata ? chatdata.map((user: ChatData, index) => (
                                <Message key={index} handleMsgClick= {()=>Convo?.setChat(user.id)} user={user}/>
                            )) : null}
                        </div>
                    </div>}
                {Convo?.chat !== 0 && <Conversation updateChat={updateChat} handleMsgClick={()=>Convo?.setChat(0)} userId={Convo?.chat!} handleConvo={()=>setInConvo({content: "", createdAt: new Date(), senderID: 0})} inConvo={inConvo!} />}
                
            </div>

        
    );
}

export default Chat
