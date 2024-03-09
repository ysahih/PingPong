import "@/styles/userProfile/userFriend.css";
import Image from "next/image";

const Block = () => {
    return (
        <div className="FriendsPh min-w-[190px] h-[230px] bg-[#040A2F] mr-[15px] flex flex-col items-center">
      <div className="relative">
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
          src="./iconsProfile/unblock.svg"
          width={25}
          height={25}
          property="true"
          alt="online"
        />
      </div>
        </div>
    )
}


const Blocked = () => {
  return (
    <>
    <Block/>
    <Block/>
    <Block/>
    <Block/>
    <Block/>
    <Block/>
    <Block/>
    <Block/>
    <Block/>
    </>
  );
};

export default Blocked;
