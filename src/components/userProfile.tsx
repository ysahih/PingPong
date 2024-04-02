import "@/styles/userProfile/userprofile.css";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import UserDataContext from "./context/context";
import axios from "axios";
import AuthCode from "react-auth-code-input";
import CloseBtn from "./closebtn";
import Switch from "react-switch";
import UserFriends from "./userProfile/userProfile";
import Awards from "./userProfile/Awards";
import UpdateForm from "@/app/update/UpdateForm";
import "@/styles/update/update.css";

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
    const res = await axios.post(
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
    console.log(res.data);
  }

  useEffect(() => {
    if (!QRsrc) {
      const generate2Fa = async () => {
        const res = await axios.get(process.env.NEST_API + "/generate-2fa", {
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
        <AuthCode
          inputClassName={`inputwith ${!enable2Fa && "InputError"} `}
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
          allowedCharacters="numeric"
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
    const res = await axios.post(
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
        <AuthCode
          inputClassName={`inputwith ${!enable2Fa && "InputError"} `}
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
          allowedCharacters="numeric"
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

  const [imageSrc, setImageSrc] = useState(
    context?.image ? context.image : "./defaultImg.svg"
  );

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    setImageSrc(file ? URL.createObjectURL(file) : context?.image? context.image : imageSrc);
    setFile(file || null);
  };
  // if () set2FaStatus(true);
  const handleClick = () => {
    if (RefBtn.current) {
      (RefBtn.current as HTMLElement).click();
    }
  };

  return (
    <>
      <div>
      <Image
          className="float-right h-full   max-w-none overflow-hidden"
          src="./iconsProfile/Vector.png"
          width={202}
          height={200}
          alt="image"
        />
        <div className="p-4">
          <h1 className="text-2xl text-blue-600 mb-2">Settings</h1>
          <div className="flex flex-col sm:flex-row">
            <div className="p-8">
              <Image
                className="rounded-[10px]"
                src={imageSrc}
                alt="Pongy"
                width={100}
                height={100}
                priority={true}
              />
              <input
                type="file"
                id="ImageInput"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="ImageInput" className="update-botton mt-10">
                Update
              </label>
            </div>

            <div>

              <div className="flex gap-8">
                <div className=" flex flex-col gap-4 w-[120px]">
                  <input className="rounded-2 " type="text" />
                  <input type="text" />
                  <input type="text" />
                </div>
                <div className="flex flex-col gap-4 w-[120px]">
                  <input type="text" />
                  <input type="text" />
                  <input type="text" />
                </div>
              </div>


              <h3 className="text-md text-gray-500 mt-6">
                Enable or disable 2FA
              </h3>
              <div className="flex w-[100%] gap-4 justify-center mt-4">
              <Switch onChange={handleClick} checked={!!TwoFaStatus} />
              <button
                ref={RefBtn}
                className="btn2Fa"
                onClick={() =>
                  TwoFaStatus ? setDisable2Fa(true) : setQrclose(true)
                }
              >
                {TwoFaStatus ? "Disable 2FA" : "Enable 2FA"}
              </button>
              {Qrclose && <QrCode close={setQrclose} towFa={set2FaStatus} />}
              {disable2Fa && (
                <Disable2Fa close={setDisable2Fa} twoFa={set2FaStatus} />
              )}
              </div>
            </div>
          </div>
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
              {context?.userName} <span> #12 </span>
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
              <h3 className="counterWinsLowsers">30</h3>
            </div>
            <div>
              <h3 className="WinsLowssers">Losses</h3>
              <h3 className="counterWinsLowsers">5</h3>
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
