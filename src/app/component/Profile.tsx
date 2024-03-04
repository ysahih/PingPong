
import RenderContext, { renderContext } from "@/components/context/render";
import Image from "next/image";
import { useContext } from "react";

interface Src {
    src: string | undefined;
}

const Profile = (props: Src)=>{
    const context : renderContext | null = useContext(RenderContext);
    return (
        <div className="profile" onClick={ () => context?.setRender("profile")}>
            <Image  src="/homeImages/ell.svg" className="profilecenter" alt="logo" width={48} height={48}/>
            <Image src={props.src? props.src: "/homeImages/memeber1.svg"}
                         className="profileimage" alt="image" style={
                        {
                            borderRadius: "50%",
                            objectFit: "cover",
                        }
                    } width={42} height={42} priority={true}/>
        </div>
    );
}

export default Profile