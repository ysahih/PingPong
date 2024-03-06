import "@/styles/userProfile/userprofile.css";
import Image from "next/image";
import {
  HtmlHTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import UserDataContext from "./context/context";
import axios from "axios";
import AuthCode from "react-auth-code-input";
import CloseBtn from "./closebtn";
import Switch from "react-switch";

const ProfileFriends = () => {
  return <div>friends</div>;
};

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
      "http://localhost:3000/enable-2fa",
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
        const res = await axios.get("http://localhost:3000/generate-2fa", {
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
            alt="settings"
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
      (btnValue.current as HTMLButtonElement).textContent = "Desabling...";
    }
    const res = await axios.post(
      "http://localhost:3000/disable-2fa",
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

  // if () set2FaStatus(true);
  const handleClick = () => {
    if (RefBtn.current) {
      (RefBtn.current as HTMLElement).click();
    }
  };
  return (
    <>
      <Switch onChange={handleClick} checked={!!TwoFaStatus} />
      <button
        ref={RefBtn}
        className="btn2Fa"
        onClick={() => (TwoFaStatus ? setDisable2Fa(true) : setQrclose(true))}
      >
        {TwoFaStatus ? "Disable 2FA" : "Enable 2FA"}
      </button>
      {Qrclose && <QrCode close={setQrclose} towFa={set2FaStatus} />}
      {disable2Fa && <Disable2Fa close={setDisable2Fa} twoFa={set2FaStatus} />}
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
            className="ImgHeadprofile"
            src={context?.image ? context?.image : "./defaultImg.svg"}
            width={75}
            height={75}
            alt="avatar"
          />
          <div>
            <h2 className="ProfileUserName">
              {context?.userName} <span> #12 </span>
            </h2>
            <h3 className="ProfileUserFName">
              {context?.firstName + " " + context?.lastName}
            </h3>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            width: "50%",
          }}
        >
          <Image
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
          <div
            style={{
              display: "flex",
              padding: "1px",
              justifyContent: "flex-end",
              gap: "5px",
              marginRight: "20%",
            }}
          >
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
        {settings ? <SettingsAnd2Fa /> : <ProfileFriends />}
      </div>
      <div className="profileAwords"></div>
    </div>
  );
};

export default UserProfile;
