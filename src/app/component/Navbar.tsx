import Image from "next/image";
import Profile from "./Profile";
import { UserData } from "@/components/context/context";
import { use, useContext, useEffect, useRef, useState } from "react";
import UserDataContext from "@/components/context/context";
import { useClickAway } from "@uidotdev/usehooks";
import SocketContext from "@/components/context/socket";
import axios from "axios";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en';
import { Span } from "next/dist/trace";
import { getTimeAgo } from "./timeAgo";
import { ClassNames } from "@emotion/react";

const PhoneLogo = ()=>{}

const Logo = ()=>{
    return (
        <div className="logo">
            <Image src="./homeImages/logo.svg" alt="logo" className="applogo" width={36} height={42}/>
            <Image src="./homeImages/PONGy.svg" className="Pongy" alt="logo" width={106} height={36}/>
        </div>
    );
}


type NotificationType = {
    id: number,
    content: string,
    createdAt: Date,
    image: string,
    userName: string,
    seen: boolean,
}


const Notification = () =>{
    const [notification, setNotification] = useState(false);
    const ref = useClickAway<HTMLDivElement>( () => {
        if (!notification )
            return ;
        setNotification(false);
        setNumberNotf(0);

      });
    const [notificationList, setNotificationList] = useState<NotificationType[]>([]);
    const socket = useContext(SocketContext);
    const [timeAgo, setTimeAgo] = useState<TimeAgo | null>(null);
    const [numberNotf, setNumberNotf] = useState<number>(0);

    useEffect(() => {
        setTimeAgo(getTimeAgo());
        // No need for cleanup to set to null, but you can keep it if it suits your use case
        return () => {
          setTimeAgo(null);
        };
   }, []);

   const NotificationsSeen = async () => {
        const res = await axios.get(process.env.NEST_API + "/user/NotificationsSeen" , {
            withCredentials: true,
            }
        )
        // setNotificationList(data);
        
   }

    useEffect(() => {
        
        async function fetchNotification() {
            const res = await axios.get(process.env.NEST_API + "/user/Notifications", {
                withCredentials: true,
                }
            )
            const data:  NotificationType[] = res.data.notifications;
            setNotificationList(data);
            setNumberNotf(data.filter((data) => !data.seen).length);
        }
        fetchNotification();

        socket?.on("Notification", (data: NotificationType) => {
            setNotificationList((prev) =>prev.length? [data,  ...prev ]: [data]);
            setNumberNotf((prev) => prev + 1);
        });
        return () => {
            socket?.off("Notification");
        }
    }
    , [socket, numberNotf]);
    
    return (
        <div ref={ref} className="z-100">
        <div className="notification cursor-pointer" onClick={()=> {
            notification && setNumberNotf(0);
            setNotification(!notification)
            // setNumberNotf(0)
    
            NotificationsSeen();
        }}>
            <div className="absolute text-white ml-[30px] mt-[-4px] rounded-full NumNotf">{numberNotf> 100 ? '99+' : `${numberNotf|| '0'}`}</div>
            <div className="NtfIcon">
                <Image  src="./homeImages/Ell2.svg" alt="logo" width={26} height={26}/>
            </div>

        </div>
        {notification && 
            <div className="NtfContainer absolute"  >
                {   notificationList?.length > 0 ?
                    notificationList.map((data) => (
                       
                        <div className={data.seen? 'bg-[#23233efc] notificationList' : 'notificationList bg-[#1B1A55]'} key={data.id}>
                            <Image src={data.image} className="rounded-full" alt="image" width={34} height={34}/>
                            <p className="infoNtf"> <span className='userNameSpan'>{data.userName} </span>{data.content}</p>
                            <p className="text-[12px]  absolute mt-[40px] ml-[180px]">{timeAgo?.format(new Date(data.createdAt))}</p>
                        </div>
            
                    )):
                    <div className="notificationList">
                        <p className="text-sm">No Notification</p>
                    </div>
                }
            </div>
        }
    </div>
    );
}

const Invite = () => {
    return (
        <div className="Gameinvite drift-animation">
            <div className="userprofile">
                <Image src="./homeImages/memeber1.svg"  className="userpic" alt="image" width={34} height={34}/>
            </div>

            <div className="info">
                <h2 className="username">Username</h2>
                <p className="type">Dark Valley</p>
            </div>

            <div className="desicion ">
                <Image src="./homeImages/Deny.svg" className="yes-no   " alt="image" width={24} height={24}/>
                <Image src="./homeImages/Accept.svg" className="yes-no " alt="image" width={24} height={24}/>
            </div>
        </div>
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
               <Notification/>
                    
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