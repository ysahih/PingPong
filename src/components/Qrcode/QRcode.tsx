import AuthCode from "react-auth-code-input";
import CloseBtn from "../closebtn";
import { useRef, useState } from "react";
import axios from "axios";

interface VerifyTwoFaProps {
    close: (val: boolean) => void;
}

const VerifyTwoFa = (props: VerifyTwoFaProps) => {
    const [input, setInput] = useState("");
    const btnValue = useRef(null);
    const [enable2Fa, setEnable2Fa] = useState(true);
  
    const DisableTwoFaWithToken = async () => {
      if (btnValue && btnValue.current) {
        (btnValue.current as HTMLButtonElement).textContent = "Verify...";
      }
      const res = await axios.post(
        "http://localhost:3000/verify-2fa",
        { token: input },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data !== undefined) {
        setEnable2Fa(res.data);
        if (res.data === true) {
          props.close(true);
        }
      }
      if (btnValue && btnValue.current) {
        (btnValue.current as HTMLButtonElement).textContent = "Verify";
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
          To continue, enter the One-Time Password (OTP) from: <br />
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
            Verify
          </button>
        </div>
      </div>
    );
};

export default VerifyTwoFa
