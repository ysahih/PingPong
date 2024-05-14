"use client";
import RenderContext, { renderContext } from "@/components/context/render";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";


interface Src {
  src: string | undefined;
  sidBar?: boolean;
}

const Profile = (props: Src) => {
  // const context: renderContext | null = useContext(RenderContext);
  const router = useRouter();
  return (
    <div
      className={props.sidBar? 'w-[70px] h-[70px] cursor-pointer mt-[-65px] NtfIconSide':  "NtfIcon cursor-pointer ml-1"}
      onClick={() => router.push("/Profile")}
    >
      <Image
        src={props.src ? props.src : "./homeImages/memeber1.svg"}
        className="w-[100%] h-[100%] "
        alt="image"
        style={{
          borderRadius: "50%",
          objectFit: "cover",
        }}
        width={45}
        height={45}
        priority={true}
      />
    </div>
  );
};

export default Profile;
