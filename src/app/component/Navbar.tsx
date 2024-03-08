import Image from "next/image";
import Profile from "./Profile";
import { UserData } from "@/components/context/context";
import { useContext } from "react";
import UserDataContext from "@/components/context/context";

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
    return (
        <div className="Gameinvite">
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