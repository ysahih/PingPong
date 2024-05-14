// import Head from "next/head";
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


const Header = () =>{
    return(
        <div className="chatheader">
            <Image src="./homeImages/chat.svg" alt="logo" width={19} height={17}/>
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
                            src={ user.image ? user.image : "./homeImages/memeber1.svg"} 
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
                <Image className="optionlogo" src="./homeImages/chat.svg" alt="logo" width={19} height={17}/>
                <p>Block</p>
            </div>
            <hr className="liney"></hr>
            <div className="clash">
                <Image className="optionlogo" 
                    src="./homeImages/chat.svg" 
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



const Message = ({handleMsgClick, user } : Props) =>{

    // console.log("--")
    // console.log(user.lastMessage);

    return (
        <div className="Message">

            <div className="chatData" onClick={()=>{handleMsgClick(user.id)}}>
                <div className="picture">
                    <Image className="profilepic" src={user.image? user.image : "./homeImages/memeber1.svg"} alt="member" width={48} height={40}/>
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



  type Message = {
    content: string;
    userId: number;
  };
  
  interface convProps {
    messages: Message[];
    userId: number;
  }

function Convo( props : convProps | undefined ) {
    const scrollableDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const scrollableDiv = scrollableDivRef.current;
      if (scrollableDiv) {
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
      }
    }, [scrollableDivRef.current?.innerHTML, props?.messages]);
    
    return (
        <div className="convoHolder" ref={scrollableDivRef}>
            {props?.messages?.map((message, index) => (
                <div key={index} className={props.userId === message.userId ? "othersMsg" : "myMsg"}>
                    <p>{message.content}</p>
                </div>
            ))} 
        </div>
    );
  }


  type ConvoProps = {
    handleMsgClick: (value:number) => void;
    userId : number;
    inConvo: String;
    handleConvo : () => void;
};

const Conversation = (props : ConvoProps) =>{

    
    const socket = useContext(SocketContext);
    const sender  = useContext(UserDataContext);
    const [Input, setInput] = useState("");
    const [convo, setConvo] = useState<ConvoData | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const render = useContext(RenderContext);
    
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
          socket?.emit("directMessage", {
            from: sender?.id,
            to: props.userId,
            message: Input,
          });
      
          const newMessage = { content: Input, userId: sender?.id };
          appendMessage(newMessage);
          setInput('');
          if (inputRef.current)
            inputRef.current.value = '';
        }
      };

    const handleClick = ()=>{
        props.handleMsgClick(0);

    }


   
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
    //     socket?.on("chat", (convodata : { userId : number, message : string}) => {
    //         const newMessage = { content: convodata.message, userId: props.userId};
    //         if(convodata.userId === props.userId)
    //             appendMessage(newMessage);
    //     });
    //     return () => {
    //         socket?.off("chat");
    //     }
    }, []);

    useEffect(()=>{
        if(props.inConvo)
            appendMessage({content: props.inConvo, userId: props.userId})
        props.handleConvo();
    }, [props.inConvo]);

    return (
        <div className="conversation">
            <div className="convo">
                <div className="convoHeader">
                    <div className="sender-info  cursor-pointer" onClick={() => render?.setRender("profileOverly")}>
                        <Image className="profilepic" src={convo?.image ? convo.image : "./homeImages/memeber1.svg"} width={38} height={42} alt="photo"/>
                        <h2>{convo?.userName}</h2>
                    </div>
                    <Image className="go-back cursor-pointer" src="./homeImages/goback.svg" onClick={handleClick} width={28} height={25} alt="back" />
                </div>
                <hr className="line"/>
                <Convo userId={props.userId} messages={convo?.messages as Message[]}/>
            
            </div>

              <form onSubmit={sendInput} className="input-footer">
                <input ref={inputRef} type="text" className="convoInput" placeholder="Send a Message..." onChange={(e) => setInput(e.target.value)}/>
                <button type="submit" >
                  <RiSendPlaneFill className="sendLogo" />
                </button>
              </form>

        </div>
    );
}



/*
import React, { useState } from 'react';



export default ChatInput;
 */

const Chat = () => {

    const [chatdata, setChatdata] = useState<ChatData[] | null >(null);
    const socket = useContext(SocketContext);
    const Convo = useContext(ChatContext);
    const [inConvo, setInConvo]  = useState<String>('');
    //TODO: change the render state when clicking on the username.
    



    const appendChat = (newChatData: ChatData) => {
        setChatdata((prevConvo) => {
          if (prevConvo) {
            const updatedConvo = [ newChatData, ...prevConvo ];
            // console.log("--before")
            return updatedConvo;
        }
        return [newChatData];
        });
    };


    useEffect(() => {
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
            //! when commiting new messages , the data fetched isn't sorted...!
            //if a user is blocked i should not recieve it from the back-end
    }, []);

    // listen
    useEffect(() => {
        socket?.on("newConvo", (newChatData: ChatData) =>{
            //if the conversation exists: 
        if (chatdata?.some( olddata => olddata.id === newChatData.id))
            setChatdata(chatdata.filter(chat => chat.id !== newChatData.id));
        appendChat(newChatData);
        // ^^ this logic gets it sorted when appending new conversations ^^ \\
        // console.log("----")
        // console.log(chatdata)
        
        //if you are inside the convo we pass the new message as props

            if (Convo?.chat === newChatData.id)
                setInConvo(newChatData.lastMessage);
        
            })
        return () => { socket?.off("newConvo")}
    }, [chatdata]);


    return (
        <div className="chat">
            {Convo?.chat === 0 && <div className="">
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
            {Convo?.chat !== 0 && <Conversation handleMsgClick={()=>Convo?.setChat(0)} userId={Convo?.chat!} inConvo={inConvo} handleConvo={() =>{setInConvo("")}} />}
            
        </div>
    );
}

export default Chat
