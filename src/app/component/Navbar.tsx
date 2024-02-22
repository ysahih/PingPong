import Image from "next/image";


const Logo = ()=>{
    return (
        <div className="logo">
            <Image src="/homeImages/logo.svg" alt="logo" width={36} height={42}/>
            <Image  src="/homeImages/PONGY.svg" alt="logo" width={136} height={36}/>
        </div>
    );
}

const Notification = () =>{
    return (
        <div className="notification">
            <Image className="notificationLogo"  src="/homeImages/ell.svg" alt="logo" width={48} height={48}/>
            <Image className="notificationLogo" src="/homeImages/ell1.svg" alt="logo" width={42} height={42}/>
            <Image className="notificationLogo" src="/homeImages/ell2.svg" alt="logo" width={26} height={26}/>
        </div>
    );
}

const Invite = () =>{
    return (
        <div className="Gameinvite">
            <div className="userprofile">
                <Image src="/homeImages/memeber1.svg" className="profileimage" alt="image" width={34} height={34}/>
            </div>

            <div className="info">
                <h2 className="username">Username</h2>
                <p className="type">Dark Valley</p>
            </div>

            <div className="desicion">
                <Image src="/homeImages/Deny.svg" className="profileimage" alt="image" width={24} height={24}/>
                <Image src="/homeImages/Accept.svg" className="profileimage" alt="image" width={24} height={24}/>
            </div>
        </div>
    );
}

const Header = () =>{
    return (
        <div className="header">
            <div className="leftBar">
                <Invite/>
            </div>

            <div className="rightBar">
               <Notification/>
                <div className="profile">
                    <Image  src="/homeImages/ell.svg" className="profileimage" alt="logo" width={48} height={48}/>
                    <Image src="/homeImages/memeber1.svg" className="profileimage" alt="image" width={42} height={43}/>
                </div>
                <h2>LEVEL: 10</h2>
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