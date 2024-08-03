"use client";
import "@/styles/userProfile/userprofile.css";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import UserDataContext, { UserData } from "./context/context";
import axios from "axios";
import CloseBtn from "./closebtn";
import Switch from "react-switch";
import UserFriends from "./userProfile/userProfile";
import Awards from "./userProfile/Awards";
import "@/styles/update/update.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SecurityIcon from "@mui/icons-material/Security";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Info from "./userProfile/updateInfo";
import UpdatePassword from "./userProfile/updatePassword";
import OTPInput from "react-otp-input";
import axiosApi from "./signComonents/api";

interface QrCodeProps {
  close: (val: boolean) => void;
  towFa: (val: boolean) => void;
}

const QrCode = (props: QrCodeProps) => {
  const [input, setInput] = useState("");
  const [enable2Fa, setEnable2Fa] = useState(true);
  const [QRsrc, setQRsrc] = useState(null);

  const urlG =
    "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US";
  const btnValue = useRef(null);

  async function submetToken() {
    if (btnValue && btnValue.current) {
      (btnValue.current as HTMLButtonElement).textContent = "Verifying...";
    }
    const res = await axiosApi.post(
      process.env.NEST_API + "/enable-2fa",
      { token: input },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    if (res.data !== undefined) {
      setEnable2Fa(res.data.status);
      if (res.data.status === true) {
        props.towFa(true);
        props.close(false);
      }
    }
    if (btnValue && btnValue.current) {
      (btnValue.current as HTMLButtonElement).textContent = "Verify";
    }
    // console.log(res.data);
  }

  useEffect(() => {
    if (!QRsrc) {
      const generate2Fa = async () => {
        const res = await axiosApi.get(process.env.NEST_API + "/generate-2fa", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        console.log(res.data);
        if (
          res.data &&
          (res.data.error === false || res.data.error === undefined)
        )
          setQRsrc(res.data);
        else setQRsrc(null);
      };
      generate2Fa();
    }
  }, []);

  return (
    <div className="QrContainer">
      <div className="QRCentent">
        <div className="closeBTN">
          <CloseBtn close={props.close} />
        </div>
        <h1>Two Factor Authenticator</h1>
        {QRsrc ? (
          <Image
            src={QRsrc}
            width={200}
            height={200}
            alt="Qr code"
            className="Qrimg"
          />
        ) : (
          <div className="Qrimg flex justify-center items-center">
            Loding...
          </div>
        )}

        <h3 className="Qrtext">
          {" "}
          Scan Qr code and Enter the OTP from: <br />
          <a target="_blank" href={urlG}>
            Google Authenticator
          </a>
        </h3>

        <OTPInput
          numInputs={6}
          
          value={input}
          renderInput={(props, index) => (
            <input {...props} id={index.toString()} />
          )}
          inputStyle={`inputwith ${!enable2Fa && "InputError"} `}
          onChange={(res: string) => {
            setInput(res), setEnable2Fa(true);
            setTimeout(() => {
              if (
                res.length === 6 &&
                btnValue.current &&
                (btnValue.current as HTMLButtonElement)
              ) {
                (btnValue.current as HTMLButtonElement).click();
              }
            }, 200);
          }}
          inputType="number"
        />
        <h4>Enter the code here</h4>
        <button
          ref={btnValue}
          className="btn2Fa"
          type="submit"
          onClick={submetToken}
        >
          Verify
        </button>
        <h3 className="Qrtext">
          {" "}
          Don't have the Authenticator app yet? <br />{" "}
          <span>
            {" "}
            get it from{" "}
            <a target="_blank" href={urlG}>
              Google Play
            </a>
          </span>
        </h3>
      </div>
    </div>
  );
};

interface Disable2FaProps {
  close: (val: boolean) => void;
  twoFa: (val: boolean) => void;
}

const Disable2Fa = (props: Disable2FaProps) => {
  const [input, setInput] = useState("");
  const btnValue = useRef(null);
  const [enable2Fa, setEnable2Fa] = useState(true);

  const DisableTwoFaWithToken = async () => {
    if (btnValue && btnValue.current) {
      (btnValue.current as HTMLButtonElement).textContent = "Disabling...";
    }
    const res = await axiosApi.post(
      process.env.NEST_API + "/disable-2fa",
      { token: input },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    if (res.data !== undefined) {
      setEnable2Fa(res.data.status);
      if (res.data.status === true) {
        props.twoFa(false);
        props.close(false);
      }
    }
    if (btnValue && btnValue.current) {
      (btnValue.current as HTMLButtonElement).textContent = "Disable";
    }
    console.log(res.data);
  };

  return (
    <div className="QrContainer ">
      <div className="QRCentent DisableContainer">
        <div className="closeBTN">
          <CloseBtn close={props.close} />
        </div>
        <h1>Two Factor Authenticator</h1>
        <h3 className="Qrtext">
          Enter the OTP from: <br />
          <a
            target="_blank"
            href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
          >
            Google Authenticator
          </a>
        </h3>
        <OTPInput
          numInputs={6}
          // renderSeparator={<span>-</span>}
          value={input}
          renderInput={(props, index) => (
            <input {...props} id={index.toString()} />
          )}
          inputStyle={`inputwith ${!enable2Fa && "InputError"} `}
          onChange={(res: string) => {
            // console.log("==========",res);
            setInput(res), setEnable2Fa(true);
            setTimeout(() => {
              if (
                res.length === 6 &&
                btnValue.current &&
                (btnValue.current as HTMLButtonElement)
              ) {
                (btnValue.current as HTMLButtonElement).click();
              }
            }, 200);
          }}
          inputType="number"
        />
        <h4>Enter the code here</h4>
        <button
          ref={btnValue}
          className="btn2Fa"
          type="submit"
          onClick={DisableTwoFaWithToken}
        >
          Disable
        </button>
      </div>
    </div>
  );
};

const SettingsAnd2Fa = () => {
  const [Qrclose, setQrclose] = useState(false);
  const context = useContext(UserDataContext);
  const [TwoFaStatus, set2FaStatus] = useState(context?.twoFa);
  const [disable2Fa, setDisable2Fa] = useState(false);
  const RefBtn = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [stateClick, setStateClick] = useState(0);

  const [imageSrc, setImageSrc] = useState(
    context?.image ? context.image : "./defaultImg.svg"
  );

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file?.type.includes("image"))
      return ;
    setImageSrc(
      file
        ? URL.createObjectURL(file)
        : context?.image
        ? context.image
        : imageSrc
    );
     setFile(file || null);
  };

  const handleClick = () => {
    if (RefBtn.current) {
      (RefBtn.current as HTMLElement).click();
    }
  };

  async function SendImg() {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axiosApi.post(
        process.env.NEST_API + "/updateImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res?.data != "error") context?.setImage(res.data);
      console.log(res.data);
    }
  }

  return (
    <>
      <div className="containerUserFriends relative z-10">
        <Image
          className=" min-h-[104%] absolute  max-w-none overflow-hidden mt-[-15px] z-[-1] left-[100%] transform translate-x-[-100%]"
          src="./iconsProfile/Vector.png"
          width={240}
          height={260}
          priority={true}
          alt="image"
          style={{
            maxWidth: "100%",
            height: "auto",
            width: "auto",
          }}
        />
        <h1 className="text-2xl text-white ml-4 mt-[15px]">Settings</h1>
        <div className="flex p-[20px] pt-[20px] gap-4 sm:gap-1 ">
          <div
            className={`cursor-pointer  pr-[5%] text-[25px] text-[#8A99E9] flex justify-center items-center text-center gap-2 hover:scale-[110%] transition-all duration-300 ease-in-out ${
              stateClick !== 0 ? "opacity-25" : ""
            }`}
            onClick={() => {
              setStateClick(0);
              scrollContainerRef.current?.scrollTo({ left: 0 });
            }}
          >
            {/* <FaUserFriends className="min-w-[25px] min-h-[25px]"/> */}
            <AccountCircleIcon className="min-w-[25px] min-h-[25px]" />
            <span className="mt-[4px] hidden sm:block">Picture</span>
          </div>
          <div
            className={`cursor-pointer pr-[5%] text-[24px] text-[#8A99E9] flex justify-center items-center text-center gap-2 hover:scale-[110%] transition-all duration-300 ease-in-out ${
              stateClick !== 1 ? "opacity-25" : ""
            }`}
            onClick={() => {
              setStateClick(1);
              scrollContainerRef.current?.scrollTo({ left: 0 });
            }}
          >
            {/* <MdOutlineBlock className="min-w-[25px] min-h-[25px]" /> */}
            <ManageAccountsIcon className="min-w-[25px] min-h-[25px]" />
            <span className="mt-[4px] hidden sm:block">Info</span>
          </div>
          <div
            className={`cursor-pointer pr-[5%] text-[24px] text-[#8A99E9] flex justify-center items-center text-center gap-2 hover:scale-[110%] transition-all duration-300 ease-in-out ${
              stateClick !== 2 ? "opacity-25" : ""
            }`}
            onClick={() => {
              setStateClick(2);
              scrollContainerRef.current?.scrollTo({ left: 0 });
            }}
          >
            {/* <MdGroupAdd className="min-w-[25px] min-h-[25px]"/> */}
            <SecurityIcon className="min-w-[25px] min-h-[25px]" />
            <span className=" mt-[4px] hidden sm:block">Security</span>
          </div>
        </div>

        <div className="m-[10px] pl-[20px] h-[322px] flex mt-[-35px]">
          {stateClick === 0 && (
            <div className="flex gap-4 w-[100%]  items-center">
              <label htmlFor="ImageInput">
                <Image
                  className="cursor-pointer rounded-[10px] border-2 border-gray-300 w-[140px] h-[140px] object-cover"
                  src={imageSrc}
                  alt="profile"
                  width={140}
                  height={140}
                  priority={true}
                />
              </label>
              <input
                type="file"
                id="ImageInput"
                onInput={handleFileChange}
                style={{ display: "none" }}
              />
              <div>
                <label
                  htmlFor="ImageInput"
                  className="update-botton  w-[100px] h-[40px]"
                >
                  Update
                </label>
                <button
                  className="update-botton  w-[100px] h-[40px]"
                  onSubmit={SendImg}
                  onClick={() => SendImg()}
                  type="submit"
                >
                  submit
                </button>
              </div>
            </div>
          )}
          {stateClick === 1 && <Info />}
          {stateClick === 2 && (
            <div className="flex flex-col w-[100%] gap-4 mt-4 justify-start items-start ">
              <div className="w-full">
                <div className="flex gap-4  items-center mt-4">
                  <Switch
                    onChange={handleClick}
                    checked={!!TwoFaStatus}
                    name="switch"
                    className="h-[40px] w-[40px]"
                  />
                  <button
                    ref={RefBtn}
                    className="btn2Fa h-[30px] w-[120px]"
                    onClick={() =>
                      TwoFaStatus ? setDisable2Fa(true) : setQrclose(true)
                    }
                  >
                    {TwoFaStatus ? "Disable 2FA" : "Enable 2FA"}
                  </button>
                </div>
                <UpdatePassword />
                {Qrclose && <QrCode close={setQrclose} towFa={set2FaStatus} />}
                {disable2Fa && (
                  <Disable2Fa close={setDisable2Fa} twoFa={set2FaStatus} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const UserProfile = () => {
  const context = useContext(UserDataContext);
  const [settings, setSettings] = useState(false);

  return (
    <div className="userProfile">
      <div className="HeadProfile">
        <div className="ImgHeadProfileContainer">
          <Image
            className="ImgHeadprofile w-[70px] h-[70px] rounded-full md:w-[75px] md:h-[75px] "
            src={context?.image ? context?.image : "./defaultImg.svg"}
            width={75}
            height={75}
            alt="avatar"
          />
          <div>
            <h2 className="ProfileUserName text-[20px] sm:text-xl">
              {context?.userName} <span> #{context?.level} </span>
            </h2>
            <h3 className="ProfileUserFName">
              {context?.firstName + " " + context?.lastName}
            </h3>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Image
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
          />
          <div className="flex sm:mr-[35%] p-1 gap-1 sm:gap-0 sm-p-0 justify-center">
            <div>
              <h3 className="WinsLowssers">Wins</h3>
              <h3 className="counterWinsLowsers">{context?.winCounter}</h3>
            </div>
            <div>
              <h3 className="WinsLowssers">Losses</h3>
              <h3 className="counterWinsLowsers">{context?.lossCounter}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="profileFriends">
        {settings ? <SettingsAnd2Fa /> : <UserFriends />}
      </div>
      <div className={settings ? "hidden" : "profileAwards "}>
        <Awards />
      </div>
    </div>
  );
};

export default UserProfile;
