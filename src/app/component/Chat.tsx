"use client";

import { CircularProgress } from "@mui/material";
import { RiSendPlaneFill } from "react-icons/ri";
import React, { use, useEffect, useRef, useState } from "react";
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

import UserStateContext from "@/components/context/userSate";
import ProfileDataContext from "@/components/context/profilDataContext";
import { stat } from "fs";

const Header = () => {
  const rout = useRouter();

  const handleClick = (
    e: React.MouseEvent<HTMLElement>,
    action: "invite" | "create"
  ) => {
    e.preventDefault();
    action === "invite" ? rout.push("/roomInvites") : rout.push("/createRoom");
  };

  return (
    <div className="chatheader">
      <div className="chatheader__header">
        <Image src="./homeImages/chat.svg" alt="logo" width={19} height={17} />
        <h2>General Chat</h2>
      </div>
      <div className="chatheader__btns">
        <button
          className="chatheader__btn url--invite"
          onClick={(e) => handleClick(e, "invite")}
        ></button>
        <button
          className="chatheader__btn url--create"
          onClick={(e) => handleClick(e, "create")}
        ></button>
      </div>
    </div>
  );
};

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
          {members &&
            members.map((user: ChatData, index) => (
              <Image
                className={
                  members?.length > 1 ? "profilepics" : "profilepics-mar"
                }
                src={user.image ? user.image : "/homeImages/memeber1.svg"}
                alt="member"
                key={index}
                width={28}
                height={20}
              />
            ))}
        </div>
      </div>
    </>
  );
};

interface userOptionClass {
  className: string;
}

{
 
}
const UserOption = ({ className }: userOptionClass) => {
  return (
    <div className={`border rounder-[5px] bg-[#040A2F]  ${className}`}>
      <div className="flex gap-1">
        <Image
          className=""
          src="/homeImages/chat.svg"
          alt="logo"
          width={19}
          height={17}
        />
        <p className="clash">Clash</p>
      </div>
    </div>
  );
};

type Props = {
  handleMsgClick: () => void;
  user: ChatData;
};

const More = ({ user }: { user: ChatData }) => {
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
    <div className="more  ">
      <div className="dotscontainer" onClick={handleMsgOption}>
        <Image
          className="dots"
          src="/homeImages/dots.svg"
          alt="member"
          width={16}
          height={16}
        />
      </div>
      <UserOption className={showMsgOption ? "" : "invisible"} />
      <p className="absolute bottom-0 p-2 text-[9px] date font-small">
        {new Date(user.createdAt).toDateString() ===
        new Date(1970, 0, 1, 0, 0, 0, 0).toDateString()
          ? ""
          : timeAgo?.format(new Date(user.createdAt))}
      </p>
    </div>
  );
};

const Message = ({ handleMsgClick, user }: Props) => {
  return (
    <div className="relative Message cursor-pointer w-[20px]">
      <div className="chatData" onClick={handleMsgClick}>
        <div className="picture">
          <Image
            className="profilepic"
            src={user?.image ? user.image : "/homeImages/memeber1.svg"}
            alt="member"
            width={38}
            height={38}
          />
        </div>

        <div className="messageInfo">
          <h2 className="senderName">{user.userName}</h2>
          <p className="msg">
            {user?.lastMessage?.length < 20
              ? user?.lastMessage
              : user.lastMessage?.slice(0, 20) + "..."}
          </p>
        </div>
      </div>

      <More user={user} />
    </div>
  );
};

type ConvoProps = {
  handleMsgClick: (value: number) => void;
  inConvo: Message;
  label: { id: number; isRoom: boolean };
  updateChat: (newChatData: ChatData) => void;
  handleConvo: () => void;
};

const Conversation = (props: ConvoProps) => {
  const socket = useContext(SocketContext);
  const sender = useContext(UserDataContext);
  const [Input, setInput] = useState("");
  const [convo, setConvo] = useState<ConvoData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const render = useContext(RenderContext);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const [timeAgo, setTimeAgo] = useState<TimeAgo | null>(null);
  const [typing, setTyping] = useState<Boolean>(false);
  const state = useContext(UserStateContext);

  const [userState, setUserState] = useState<string>("offline");

  const friends = useContext(ProfileDataContext);

  useEffect(() => {
    if (props.label.isRoom == false && state?.userState.id === props.label.id)
      setUserState(state.userState.state);
  }, [state?.userState.state]);

  useEffect(() => {
    const scrollableDiv = scrollableDivRef.current;
    if (scrollableDiv) scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
  });
  const appendMessage = (newMessage: Object) => {
    setConvo((prevConvo: any) => {
      if (prevConvo?.messages) {
        const updatedConvo = {
          ...prevConvo,
          messages: [...prevConvo.messages, newMessage],
        };
        return updatedConvo;
      }
      return {
        ...prevConvo,
        messages: [newMessage],
      };
    });
  };

  const sendInput = (e: any) => {
    e.preventDefault();
    if (Input.length > 0) {
      setTimeout(() => {
        socket?.emit("directMessage", {
          from: sender?.id,
          to: props.label.id,
          message: Input,
          createdAt: new Date(Date.now()),
          isRoom: props.label.isRoom,
        });
        // TODO: Last message time - now() < 500ms ? 500ms : 0,
      }, 2000);

      const newMessage = {
        content: Input,
        userId: sender?.id,
        createdAt: Date.now(),
      };
      appendMessage(newMessage);

      props.updateChat({
        id: props.label.id,
        userName: convo?.userName!,
        image: convo?.image!,
        lastMessage: Input,
        isOnline: false, // will be added
        isRead: false, //will be removed
        isRoom: props.label.isRoom,
        createdAt: new Date(),
        hasNoAccess: false, // add this later on
      });
      setInput("");
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    props.handleMsgClick(0);
  };

  //fetch http data
  useEffect(() => {
    const fetchConvo = async () => {
      try {
        const response = await axios.get(
          process.env.NEST_API + "/user/messages",
          {
            params: {
              id: props.label.id,
              isRoom: props.label.isRoom ? 1 : 0,
            },
            withCredentials: true,
          }
        );

        console.log("data hhh:", response.data);

        setConvo(response.data);

        if (response.data.inGame) setUserState("inGame");
        else if (response.data.online) setUserState("online");
      } catch {
        console.log("Error Fetching data for all messages !");
      }
    };
    fetchConvo();
  }, [props.label.id]);

  //appending new messages that are passed as props
  useEffect(() => {
    if (props.inConvo?.content)
      appendMessage({
        content: props.inConvo.content,
        userId: props.inConvo.senderID,
        createdAt: props.inConvo.createdAt,
      });
    props.handleConvo();
  }, [props.inConvo?.content]);

  const handleTyping = (e: any) => {
    socket?.emit("typing", {
      from: sender?.id,
      to: props.label.id,
    });
    setInput(e.target.value);
  };

  useEffect(() => {
    socket?.on("isTyping", (payload: { from: number }) => {
      if (payload.from === props.label.id) {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
        }, 2000);
      }
    });
    setTimeAgo(getTimeAgo());
    return () => {
      socket?.off("isTyping");
      setTimeAgo(null);
    };
  }, []);
  const router = useRouter();
  return (
    <div className="conversation">
      {convo === null && (
        <div className="loading">
          <CircularProgress />
        </div>
      )}
      {convo && (
        <>
          <div className="convo">
            <div className="convoHeader">
              <div
                className="sender-info  cursor-pointer"
                onClick={() => {
                  render?.setRender("profileOverly");
                  router.push("/users?userName=" + convo?.userName);
                  // router.push("/room?name=" + props.roomName);
                }}
              >
                <Image
                  className="profilepic"
                  src={convo?.image ? convo.image : "/homeImages/memeber1.svg"}
                  width={38}
                  height={38}
                  alt="photo"
                />
                <div>
                  <h2>{convo?.userName}</h2>
                  {!props.label.isRoom && (
                    <p className="w-[50px]">
                      {typing ? "Typing..." : userState}
                    </p>
                  )}
                </div>
              </div>
              <Image
                className="go-back cursor-pointer"
                src="/homeImages/goback.svg"
                onClick={handleClick}
                width={28}
                height={25}
                alt="back"
              />
            </div>
            <hr className="line" />

            <div className="convoHolder" ref={scrollableDivRef}>
              {convo?.messages?.map((message: any, index: number) => (
                <div
                  key={index}
                  className={
                    props.label.id === message.userId ? "othersMsg" : "myMsg"
                  }
                >
                  <p
                    className={`sentAt ${
                      props.label.id === message.userId
                        ? "othersDate"
                        : "myDate"
                    }`}
                  >
                    {timeAgo?.format(new Date(message.createdAt))}
                  </p>
                  <div
                    className={
                      props.label.id === message.userId
                        ? "othersContent"
                        : "myContent"
                    }
                  >
                    <p className="msgContent">{message?.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={sendInput} className="input-footer">
            <input
              ref={inputRef}
              type="text"
              className="convoInput"
              placeholder="Send a Message..."
              onChange={handleTyping}
            />
            <button type="submit">
              <RiSendPlaneFill className="sendLogo" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

const Chat = () => {
  const [chatdata, setChatdata] = useState<ChatData[] | null>(null);
  const socket = useContext(SocketContext);
  const Convo = useContext(ChatContext);
  const [inConvo, setInConvo] = useState<Message>();
  const [isRoom, setIsRoom] = useState<boolean>(false);

  const appendChat = (newChatData: ChatData) => {
    setChatdata((prevConvo) => {
      if (prevConvo) {
        const updatedConvo = [newChatData, ...prevConvo];
        return updatedConvo;
      }
      return [newChatData];
    });
  };
  useEffect(() => {
    console.log("user when enters is: ", Convo?.label.id);
  });

  useEffect(() => {
    //fetching chat data.
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.NEST_API + "/user/conversation",
          {
            withCredentials: true,
          }
        );
        console.log("Convs:", response.data);
        setChatdata([...response.data].reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    //!! if a user is blocked i should not recieve it from the back-end
  }, []);

  const updateChat = (newChatData: ChatData) => {
    // if the conversation exists:
    // ^^ this logic gets it sorted when appending new conversations ^^ \\
    if (
      chatdata?.some(
        (olddata) =>
          olddata.isRoom == newChatData.isRoom && olddata.id === newChatData.id
      )
    )
      setChatdata(chatdata.filter((chat) => chat.id !== newChatData.id)); // to be tested!!
    appendChat(newChatData);
  };
  // listen
  useEffect(() => {
    socket?.on("newConvo", (newChatData: ChatData) => {
      updateChat(newChatData);

      // if you are inside the convo we pass the new message as props
      if (
        Convo?.label.id === newChatData.id &&
        Convo?.label.isRoom === newChatData.isRoom
      )
        setInConvo({
          content: newChatData.lastMessage,
          createdAt: newChatData.createdAt,
          senderID: newChatData.id,
        }); //check for isRoom
    });
    return () => {
      socket?.off("newConvo");
    };
  }, [chatdata, Convo?.label]);

  return (
    <div className="chat">
      {Convo?.label.id && (
        <Conversation
          updateChat={updateChat}
          label={Convo?.label!}
          handleMsgClick={() => Convo?.setLabel({ id: 0, isRoom: false })}
          handleConvo={() =>
            setInConvo({ content: "", createdAt: new Date(), senderID: 0 })
          }
          inConvo={inConvo!}
        />
      )}
      {Convo?.label.id == 0 && (
        <div>
          <div className="chatbar">
            <Header />
            <Members chatdata={chatdata} />
          </div>

          <div className="messagesHolder">
            {chatdata
              ? chatdata.map((user: ChatData, index) => (
                  <Message
                    key={index}
                    handleMsgClick={() =>
                      Convo.setLabel({ id: user.id, isRoom: user.isRoom })
                    }
                    user={user}
                  />
                ))
              : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
