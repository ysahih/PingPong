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
        </div>
);

}


const Sidebar = () => {
    return (
        <div className="Sidebar">
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
    );
}

export default Sidebar