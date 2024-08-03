"use client";
import { updateForm, updateValidationSchema } from "@/components/Formik/Formik";
import { useFormik } from "formik";
import axios from "axios";
import { useRouter } from "next/navigation";
import UpdateUserData from "@/components/context/update.context";
import React from "react";
import axiosApi from "@/components/signComonents/api";

interface UpdateFormProps {
  file: File | null;
}

const UpdateForm = (props: UpdateFormProps) => {
  const file: File | null = props.file;
  const context = React.useContext(UpdateUserData);
  const userName: string | undefined = context?.userName;
  if (userName) {
    updateForm.userName = userName;
  }

  console.log("file: ", file);

  const router = useRouter();
  const sendUpdateRequest = async (values: typeof updateForm) => {
    console.log("values: ", values);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      else formData.append("image", context?.image || "./defaultImg.svg");

      formData.append("userName", values.userName);
      formData.append("Password", values.Password);
      const response = await axiosApi.put(
        process.env.NEST_API + "/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response && !response.data.error) router.push("/");
      if (response.data.error) throw new Error("Error");
    } catch (error: any) {
      // console.error('Error:', error);
      formik.setErrors({ userName: "userName is already used" });
    }
  };

  const formik = useFormik({
    initialValues: updateForm,
    validationSchema: updateValidationSchema,
    onSubmit: () => {
      sendUpdateRequest(formik.values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="input-container">
      <input
        value={formik.values.userName}
        onChange={formik.handleChange}
        name="userName"
        key="userName"
        className={`input ${
          formik.errors["userName"] && formik.touched["userName"]
            ? "InputError"
            : ""
        }`}
        placeholder={userName ? `${"userName : " + userName}` : "Username"}
        type="text"
        autoComplete="yes"
        onBlur={formik.handleBlur}
      />
      {formik.errors.userName && formik.touched.userName ? (
        <p className="ErrorMessage">{formik.errors.userName}</p>
      ) : (
        ""
      )}
      <input
        value={formik.values.Password}
        onChange={formik.handleChange}
        name="Password"
        key="Password"
        className={`input ${
          formik.errors.Password && formik.touched.Password ? "InputError" : ""
        }`}
        placeholder="Password"
        type="password"
        autoComplete="none"
        onBlur={formik.handleBlur}
      />
      {formik.errors.Password && formik.touched.Password ? (
        <p className="ErrorMessage">{formik.errors.Password}</p>
      ) : (
        ""
      )}
      <input
        value={formik.values["Confirm Password"]}
        onChange={formik.handleChange}
        name="Confirm Password"
        key="Confirm Password"
        className={`input ${
          formik.errors["Confirm Password"] &&
          formik.touched["Confirm Password"]
            ? "InputError"
            : ""
        }`}
        placeholder="Confirm Password"
        type="password"
        autoComplete="none"
        onBlur={formik.handleBlur}
      />
      {formik.errors["Confirm Password"] &&
      formik.touched["Confirm Password"] ? (
        <p className="ErrorMessage">{formik.errors["Confirm Password"]}</p>
      ) : (
        ""
      )}
      <button id="singbtn" type="submit">
        Confirm
      </button>
    </form>
  );
};

export default UpdateForm;
