import CloseBtn from "../closebtn";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { HtmlContext } from "next/dist/server/future/route-modules/app-page/vendored/contexts/entrypoints";
import { useRouter } from "next/navigation";
import "@/styles/userProfile/userprofile.css";
import OTPInput from "react-otp-input";

interface VerifyTwoFaProps {
  close: (val: boolean) => void;
}

const VerifyTwoFa = (props: VerifyTwoFaProps) => {
  const [input, setInput] = useState("");
  const btnValue = useRef(null);
  const [enable2Fa, setEnable2Fa] = useState(true);
  const router = useRouter();


  const Logout = async () => {
    try {
      const res = await axios.get(process.env.NEST_API + "/logout", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data) {
        // //console.log('Success:', data);

        router.push("/login");
      }
    } catch (error) {
      //console.error('Error:', error);
    }
  };
  const DisableTwoFaWithToken = async () => {
    if (btnValue && btnValue.current) {
      (btnValue.current as HTMLButtonElement).textContent = "Verify...";
    }
    const res = await axios.post(
      process.env.NEST_API +"/verify-2fa",
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
        <div className="closeBTN" onClick={Logout}>
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
        <OTPInput
          numInputs={6}
          // renderSeparator={<span>-</span>}
          value={input}
          renderInput={(props, index) => (
            <input {...props} id={index.toString()} />
          )}
          inputStyle={`inputwith ${!enable2Fa && "InputError"} `}
          onChange={(res: string) => {
            console.log("==========",res);
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
          Verify
        </button>
        <h3 className="Qrtext">or</h3>
        <button className="btn2Fa" onClick={Logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default VerifyTwoFa;
