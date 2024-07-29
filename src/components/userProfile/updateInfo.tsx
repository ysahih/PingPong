import "@/styles/userProfile/userFriend.css";
import { use, useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import UserDataContext from "../context/context";
import axiosApi from "../signComonents/api";

const Info = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    userName: "",
  });
  const [error, setError] = useState({ iserror: false, message: "" });
  const [errorP, setErrorP] = useState(false);
  const userData = useContext(UserDataContext);
  const [activeToast, setActiveToast] = useState(false);

  const validateUserName = async (name: string) => {
    const schema = Yup.string()
      .trim()
      .min(4, "Too Short!")
      .max(20, "Too Long!")
      .matches(/^[a-zA-Z0-9-_]+$/, "No spaces or special characters allowed");

    try {
      await schema.validate(name);
      setError({ iserror: false, message: "" });
    } catch (err: any) {
      setError({ iserror: true, message: err?.message });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "userName") {
      e.target.value.length > 0 && validateUserName(e.target.value);
      e.target.value.length == 0 && setError({ iserror: false, message: "" });
      setUser({ ...user, userName: e.target.value });
    }
    if (e.target.name === "firstName") {
      setUser({ ...user, firstName: e.target.value });
    }
    if (e.target.name === "lastName") {
      setUser({ ...user, lastName: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error.iserror) {
      return;
    }
   

    const toastId = toast.loading("Waiting...");
    setActiveToast(true);
    console.log(user);
    const send = async () => {
      const res = await axiosApi.post(process.env.NEST_API + '/user/updateInfo', 
        {
          userName: user?.userName || '',
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
        },
        {
          withCredentials: true,
        }
      );
      if (res?.data?.message) {
        toast.dismiss(toastId);
        toast.error(res?.data?.message, {icon: '⚠️'});
        setActiveToast(false);
        return;
      }
      toast.dismiss(toastId);
      setActiveToast(false);
      toast.success("update Successfully !");
      if (userData) {
        userData?.setFirstName(!user?.firstName ?  userData?.firstName : user?.firstName);
        userData?.setLastName(!user?.lastName ?  userData?.lastName : user?.lastName);
        userData?.setUserName(  !user?.userName ?  userData?.userName : user?.userName);
      }
    };
    send();
  };

  return (
    <form
      className="flex mt-[30px] flex-col gap-3 w-[100%] text-[14px] justify-center formClass"
      action=""
      onSubmit={handleSubmit}
    >
      <Toaster
        containerStyle={{
          marginTop: "100px", // Negative margin top
        }}
      />
      <input
        name="userName"
        type="text"
        className="w-[200px] text-black FormInput"
        placeholder="userName"
        autoComplete="true"
        onChange={handleChange}
      />
      {error?.iserror && (
        <p className="text-[13px] mt-[-13px] text-[red] ml-[4px]">
          {error.message}
        </p>
      )}
      <input
        type="text"
        name="firstName"
        className="w-[200px] text-black FormInput"
        placeholder="First Name"
        autoComplete="true"
        onChange={handleChange}
      />

      <input
        name="lastName"
        type="text"
        className="w-[200px] text-black FormInput"
        placeholder="last Name"
        autoComplete="true"
        onChange={handleChange}
      />
      
      <button
        type="submit"
        name="submit"
        className="update-botton  w-[100px] h-[40px]"
      >
        submit
      </button>
    </form>
  );
};

export default Info;
