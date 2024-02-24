import Image from "next/image";
import Profile from "./Profile";


const Buttons = () => {
    return (
        <div className="buttons">
            <div className="sideButton">
                <Image className="icon" src="homeimages/homeicon.svg" alt="logo" width={14} height={18}/>
                <h2>Home</h2> 
            </div>

            <div className="sideButton">
                <Image className="icon" src="homeimages/homeicon.svg" alt="logo" width={14} height={18}/>
                <h2>Home</h2> 
            </div>

            <div className="sideButton">
                <Image className="icon" src="homeimages/homeicon.svg" alt="logo" width={14} height={18}/>
                <h2>Home</h2> 
            </div>

            <div className="sideButton">
                <Image className="icon" src="homeimages/homeicon.svg" alt="logo" width={14} height={18}/>
                <h2>Home</h2> 
            </div>

            <div className=" sideButton visible xl:invisible">
                <Image className="icon" src="homeimages/homeicon.svg" alt="logo" width={14} height={18}/>
                <h2>Chat</h2> 
            </div>
        </div>
);

}

const PhoneButtons = ()=>{
    return (
        <div className="phonebuttons">
            <div>
                <Image className="icon" src="homeimages/homeicon.svg" alt="logo" width={24} height={18}/>
            </div>
            <div>
                <Image className="icon" src="homeimages/gamesicon.svg" alt="logo" width={30} height={18}/>
            </div>
            <div>
                <Image className="icon" src="homeimages/rankingicon.svg" alt="logo" width={30} height={18}/>
            </div>
            <div>
                <Image className="icon" src="homeimages/searchicon.svg" alt="logo" width={30} height={18}/>
            </div>
            <div>
                <Image className="icon" src="homeimages/chaticon.svg" alt="logo" width={24} height={18}/>
            </div>
        </div>
    );
}

const Sidebar = () => {
    return (
        <>
            <div className="Sidebar ">
                <Buttons/>
                <div className="logout">

                    <Profile/>

                    <h2 className="Username">Username</h2>

                    <div className="logoutSection">
                        <button className="logoutbutton">
                            logout
                        </button>
                    </div>

                </div>
            </div>
        
            <div className="PhoneSidebar">
                
               <PhoneButtons/>
                <div className="logoutIcon">
                    <Image className="icon" src="homeimages/logouticon.svg" alt="logo" width={26} height={18}/>
                </div>

            </div>
        </>
    );
}

export default Sidebar