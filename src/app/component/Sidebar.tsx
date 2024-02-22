import Image from "next/image";

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
            <hr></hr>
            
        </div>
    );
}

export default Sidebar