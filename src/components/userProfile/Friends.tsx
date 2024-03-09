import "@/styles/userProfile/userFriend.css";
import Image from "next/image";


const Friend = () => {
    return (
      <div className="FriendsPh min-w-[190px] h-[230px] bg-[#040A2F] mr-[15px] flex flex-col items-center">
        <div className="relative">
          {/* Status Indicator */}
          <p className="absolute w-2.5 h-2.5 bg-green-500 rounded-full z-50 -top-[-12px] -right-[-8px] transform translate-x-1/2 translate-y-1/2 border-[1px] border-white animationClass"></p>
          <div
            className="mt-[16px] inline-block rounded-full overflow-hidden border-2 border-transparent shadow-lg w-[60px] h-[60px]"
            style={{ outline: ".2px solid #535C91" }}
          >
            <Image
              className="bg-cover bg-center w-full h-full"
              src="https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=1024x1024&w=is&k=20&c=LEk3Riu7RsJXkWMTEdmQ1yDkgf5F95ScLNZQ4j0P23g="
              width={60}
              height={60}
              alt="user"
            />
          </div>
        </div>
        <div className="containerFriend__info">
          <h3 className="text-[16px]">Username</h3>
          <p className="text-center text-[#8A99E9] text-[12px]">#12</p>
        </div>
        <div className="flex items-center justify-center  w-[100%] gap-4 mt-12">
          <Image
            className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
            src="./iconsProfile/Gamepad_solid.svg"
            width={28}
            height={28}
            property="true"
            alt="online"
          />
          <Image
            src="./iconsProfile/Chat_solid.svg"
            width={23}
            height={24}
            property="true"
            alt="online"
            className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          />
          <Image
            className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
            src="./iconsProfile/User-block.svg"
            width={28}
            height={28}
            property="true"
            alt="online"
          />
        </div>
      </div>
    );
  };

const Friends = () => {
    return (
        <>
        <Friend/>
        <Friend/>
        <Friend/>
        <Friend/>
        <Friend/>
        <Friend/>
        <Friend/>
        <Friend/>
        <Friend/>
        <Friend/>
        <Friend/>
        <Friend/>
        </> 
    );
}

export default Friends;