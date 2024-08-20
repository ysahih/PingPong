import "@/styles/userProfile/userFriend.css";
import { use, useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import UserDataContext from "../context/context";
import axiosApi from "../signComonents/api";

const UpdatePassword = () => {
  const [user, setUser] = useState({
    CurrentPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
  });

  const [error, setError] = useState({ iserror: false, message: "" });
  const [errorP, setErrorP] = useState(false);
  const [activeToast, setActiveToast] = useState(false);

  const validateNewPassword = async (NewPassword: string) => {
    const schema = Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase")
      .matches(/[a-z]/, "Password must contain at least one lowercase")
      .matches(/[0-9]/, "Password must contain at least one number");

    try {
      await schema.validate(NewPassword);
      setError({ iserror: false, message: "" });
    } catch (err: any) {
      setError({ iserror: true, message: err?.message });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "NewPassword") {
      value.length > 0 && validateNewPassword(value);
      value.length === 0 && setError({ iserror: false, message: "" });
    }

    if (name === "ConfirmPassword") {
      if (value !== user.NewPassword) {
        setErrorP(true);
      } else {
        setErrorP(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (error.iserror) {
      return;
    }

    if (
      user.NewPassword !== user.ConfirmPassword ||
      user.NewPassword === "" ||
      user.ConfirmPassword === "" ||
      user.CurrentPassword === ""
    ) {
      setErrorP(true);
      return;
    }

    const toastId = toast.loading("Waiting...");
    setActiveToast(true);

    const send = async () => {
      try {
        const res = await axiosApi.post(
          process.env.NEST_API + "/user/UpdatePassword",
          {
            CurrentPassword: user.CurrentPassword,
            NewPassword: user.NewPassword,
          },
          {
            withCredentials: true,
          }
        );

        if (res?.data?.message) {
          toast.dismiss(toastId);
          toast.error(res.data.message, { icon: "⚠️" });
          setActiveToast(false);
          return;
        }

        toast.dismiss(toastId);
        toast.success("Update Successfully!");
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("An error occurred");
      } finally {
        setActiveToast(false);
      }
    };

    send();
  };

  return (
    <form
      className="flex mt-[15px] flex-col gap-3 w-[100%] text-[14px] justify-center formClass"
      onSubmit={handleSubmit}
    >
      <Toaster
        containerStyle={{
          marginTop: "100px", // Negative margin top
        }}
      />
      <input
        name="CurrentPassword"
        type="password"
        className="w-[200px] text-black FormInput"
        placeholder="Current Password"
        autoComplete="off"
        onChange={handleChange}
      />
      <input
        type="password"
        name="NewPassword"
        className="w-[200px] text-black FormInput"
        placeholder="New Password"
        autoComplete="off"
        onChange={handleChange}
      />
      {error.iserror && (
        <p className="text-[13px] mt-[-20px] sm:mt-[-13px] text-[red] ml-[4px]">
          {error.message}
        </p>
      )}
      <input
        name="ConfirmPassword"
        type="password"
        className="w-[200px] text-black FormInput"
        placeholder="Confirm Password"
        autoComplete="off"
        onChange={handleChange}
      />
      {errorP && (
        <p className="text-[13px] mt-[-20px] sm:mt-[-13px] text-[red] ml-[4px]">
          Passwords do not match
        </p>
      )}
      <button
        type="submit"
        name="submit"
        className="update-botton w-[100px] h-[40px]"
      >
        Submit
      </button>
    </form>
  );
};

export default UpdatePassword;
