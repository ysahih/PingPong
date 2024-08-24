import "@/styles/userProfile/userFriend.css";
import Image from "next/image";
import { useContext, useState } from "react";
import { InvitsType } from "./Dto";
import ProfileDataContext from "../context/profilDataContext";
import SocketContext from "../context/socket";
import UserDataContext from "../context/context";
import { useRouter } from "next/navigation";

interface InvitProps {
  value: InvitsType;
}

const Invit = (props: InvitProps) => {
  const values = props.value;
  const socket = useContext(SocketContext);
  const user = useContext(UserDataContext);
  const [Accepting, setAccepting] = useState<boolean>(false);
  const [deny, setDeny] = useState<boolean>(false);
  const router = useRouter();

  return (
    <div
      key={values.id}
      className="FriendsPh min-w-[190px] h-[230px] bg-[#040A2F] mr-[15px] flex flex-col items-center"
    >
      <div className="relative">
        <div
          className="mt-[16px] inline-block rounded-full overflow-hidden border-2 border-transparent shadow-lg w-[60px] h-[60px]"
          style={{ outline: ".2px solid #535C91" }}
        >
          <Image
            className="bg-cover bg-center w-full h-full cursor-pointer"
            src={values?.sender?.image || "./defaultImg.svg"}
            onClick={() => {
              router.push(`/users?userName=${props.value.sender.userName}`);
            }
            }
            width={60}
            height={60}
            alt="user"
          />
        </div>
      </div>
      <div className="containerFriend__info">
        <h3 className="text-[16px]">{values.sender.userName}</h3>
        <p className="text-center text-[#8A99E9] text-[12px]">#{values.sender.level}</p>
      </div>
      <div
        className={`${
          Accepting || deny ? "hidden" : "flex"
        } flex items-center justify-center  w-[100%] mt-12 gap-8`}
      >
        <Image
          onClick={() => {
            setDeny(true);
            socket?.emit(
              "DenyFriend",
              { id: values.sender.id, userId: user?.id },
              (error: Error | string) => {
                error ? setDeny(false) : setDeny(true);
              }
            );
          }}
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/Deny.svg"
          width={32}
          height={32}
          property="true"
          alt="online"
        />
        <Image
          onClick={() => {
            setAccepting(true);
            socket?.emit(
              "NewFriend",
              { id: values.sender.id, userId: user?.id },
              (error: Error | string) => {
                error ? setAccepting(false) : setAccepting(true);
              }
            );
          }}
          className="cursor-pointer bg-cover bg-center hover:scale-[120%] transition-all duration-300 ease-in-out"
          src="./iconsProfile/Accept.svg"
          width={32}
          height={32}
          property="true"
          alt="online"
        />
      </div>


      <div className="flex items-center justify-center w-[100%] mt-12">
        {Accepting && (
          <p className="text-[#8A99E9] text-[14px]">Accepting...</p>
        )}
        {deny && <p className="text-[#8A99E9] text-[14px]">Denied</p>}
      </div>
    </div>
  );
};

const Invits = () => {
  // const [Invits, setInvits] = useState<InvitsType[] | null>(null);

  const Invits = useContext(ProfileDataContext)?.InvitsData || null;
  return (
    <>
      {Invits && Invits.length > 0 ?
        Invits.map((invit: InvitsType) => {
          return <Invit key={invit.id} value={invit} />;
        })
        :
        <div className="text-[#8A99E9] flex items-center justify-center w-[95%]">No Invits</div>}
    </>
  );
};
export default Invits;
