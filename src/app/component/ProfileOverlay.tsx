import Awards from "@/components/userProfile/Awards";

import "@/styles/userProfile/userprofile.css";
import { useContext } from "react";



const ProfileOverlay = () => {
    // const context = useContext(UserDataContext);

  
    return (
      <div className="userProfile">
        <div className="HeadProfile">
          <div className="ImgHeadProfileContainer">
            {/* <Image
              className="ImgHeadprofile w-[70px] h-[70px] rounded-full md:w-[75px] md:h-[75px] "
              src={context?.image ? context?.image : "./defaultImg.svg"}
              width={75}
              height={75}
              alt="avatar"
            /> */}
            <div>
              <h2 className="ProfileUserName text-[20px] sm:text-xl">
                {/* {context?.userName} <span> #12 </span> */}
              </h2>
              <h3 className="ProfileUserFName">
                {/* {context?.firstName + " " + context?.lastName} */}
              </h3>
            </div>
          </div>
          <div className="flex flex-col items-end">
            {/* <Image
              className="hover:scale-[120%] w-[20px] md:w-[26px] transition-all duration-300 ease-in-out"
              src="/Settings.svg"
              width={26}
              height={26}
              alt="settings"
              style={{
                cursor: "pointer",
                margin: "15px",
              }}
              onClick={() => setSettings(!settings)}
            /> */}
            <div className="flex sm:mr-[35%] p-1 gap-1 sm:gap-0 sm-p-0 justify-center">
              <div>
                <h3 className="WinsLowssers">Wins</h3>
                <h3 className="counterWinsLowsers">30</h3>
              </div>
              <div>
                <h3 className="WinsLowssers">Losses</h3>
                <h3 className="counterWinsLowsers">5</h3>
              </div>
            </div>
          </div>
        </div>
        
        <div className={"profileAwards "}>
          <Awards />
        </div>
      </div>
    );
  };
  
  export default ProfileOverlay;
  