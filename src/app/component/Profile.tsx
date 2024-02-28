import Image from "next/image";

const Profile = ()=>{
    return (
        <div className="profile">
            <Image  src="/homeImages/ell.svg" className="profilecenter" alt="logo" width={48} height={48}/>
            <Image src="/homeImages/memeber1.svg" className="profileimage" alt="image" width={42} height={43}/>
        </div>
    );
}

export default Profile