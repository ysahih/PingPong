import Image from "next/image";
import Profile from "./Profile";
import { useState } from "react";
import axios from "axios";
import Router from "next/navigation";
import { useRouter } from "next/navigation";
import UserDataContext, { UserData } from "@/components/context/context";
import { useContext } from "react";
import RenderContext, { renderContext } from "@/components/context/render";

const Buttons = () => {
    
    const context : renderContext | null = useContext(RenderContext);


    return (
        <div className="buttons">
            <div className={`sideButton ${context?.render === "home" ? 'activeChatButton' : ''}`} onClick={() => context?.setRender('home')}>
                <Image className="icon" src="homeimages/homeicon.svg" alt="logo" width={14} height={18}/>
                <h2>Home</h2> 
            </div>

            <div className={`sideButton ${context?.render === "games" ? 'activeChatButton' : ''}`} onClick={() => context?.setRender('games')}>
                <Image className="icon" src="homeimages/gamesicon.svg" alt="logo" width={20} height={18}/>
                <h2>Games</h2> 
            </div>

            <div className={`sideButton ${context?.render === "ranking" ? 'activeChatButton' : ''}`}  onClick={() => context?.setRender('ranking')}>
                <Image className="icon" src="homeimages/rankingicon.svg" alt="logo" width={20} height={18}/>
                <h2>Ranking</h2> 
            </div>

            <div className={`sideButton ${context?.render === "search" ? 'activeChatButton' : ''}`}  onClick={() => context?.setRender('search')}>
                <Image className="icon" src="homeimages/searchicon.svg" alt="logo" width={20} height={18}/>
                <h2>Search</h2> 
            </div>

            <div className={`sideButton visible xl:invisible ${context?.render === "chat" ? 'activeChatButton' : ''}`} onClick={() => context?.setRender('chat')}>
                <Image className="icon" src="homeimages/chaticon.svg" alt="logo" width={20} height={18}/>
                <h2>Chat</h2> 
            </div>
        </div>
);

}

const PhoneButtons = () => {
    
    const context : renderContext | null = useContext(RenderContext);

    return (

        <div className="phonebuttons">

            <div className={`phonebutton ${context?.render === "home" ? 'activeChatButton' : ''}`} onClick={() => context?.setRender('home')}>
                <Image className="Phoneicon" src="homeimages/homeicon.svg" alt="logo" width={24} height={20}/>
            </div>

             <div className={`phonebutton ${context?.render === "games" ? 'activeChatButton' : ''}`} onClick={() => context?.setRender('games')}>
                <Image className="Phoneicon" src="homeimages/gamesicon.svg" alt="logo" width={30} height={18}/>
            </div>
             <div className={`phonebutton ${context?.render === "ranking" ? 'activeChatButton' : ''}`} onClick={() => context?.setRender('ranking')}>
                <Image className="Phoneicon" src="homeimages/rankingicon.svg" alt="logo" width={30} height={18}/>
            </div>
             <div className={`phonebutton ${context?.render === "search" ? 'activeChatButton' : ''}`} onClick={() => context?.setRender('search')}>
                <Image className="Phoneicon" src="homeimages/searchicon.svg" alt="logo" width={30} height={18}/>
            </div>
             <div className={`phonebutton ${context?.render === "chat" ? 'activeChatButton' : ''}`} onClick={() => context?.setRender('chat')}>
                <Image className="Phoneicon" src="homeimages/chaticon.svg" alt="logo" width={24} height={18}/>
            </div>

        </div>
    );
}

const Sidebar = () => {

    const data: UserData | null = useContext(UserDataContext);
    const router = useRouter();

    async function Logout() {
        try{
            const res = await axios.get(process.env.NEST_API + '/logout', {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            })
            if(res.data){
                // //console.log('Success:', data);
               
                    router.push('/login');
            }
        }
        catch (error) {
            //console.error('Error:', error);
        };
    }

    return (
        <div className="side_holder">
            <div className="Sidebar">
                <Buttons/>
                <div className="logout">

                    <Profile src={data?.image} />

                    <h2 className="Username">{data?.userName}</h2>

                    <div className="logoutSection">
                        <button className="logoutbutton" onClick={Logout}>
                            logout
                        </button>
                    </div>

                </div>
            </div>
        
            <div className="PhoneSidebar">
                
               <PhoneButtons/>
                <div className="logoutIcon" onClick={Logout}>
                    <Image className="" src="homeimages/logouticon.svg" alt="logo" width={26} height={18}/>
                </div>

            </div>
        </div>
    );
}

export default Sidebar