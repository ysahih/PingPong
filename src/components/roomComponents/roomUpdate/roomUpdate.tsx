import "./roomUpdate.css";
import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import Image from "next/image";
import pic from "@/../public/createRoom/GroupChat.svg";
import deletePic from "@/../public/RoomSettings/deletePic.svg";
import { RoomFormatUpdate, ROOMTYPE } from "@/components/createRoom/interfaces";
import { Form, useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import SocketContext from "@/components/context/socket";
import axiosApi from "@/components/signComonents/api";

const RoomUpdate: FC<{id: number, type: ROOMTYPE | undefined, setType: Dispatch<SetStateAction<ROOMTYPE | undefined>>, ownerId: number}> = (updateProp) => {
  const [selcType, setSelType] = useState<ROOMTYPE | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [update, setUpdate] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const socket = useContext(SocketContext);

  const formik = useFormik<RoomFormatUpdate>({
    initialValues: {
      name: "",
      type: null,
      error: "",
      password: "",
    },
    onSubmit: (value: RoomFormatUpdate) => {
      setUpdating(true);
      console.log("File:", file);
      console.log("Value:", value);

      const updateRoom = async () => {
        const formData = new FormData();

        if (file) formData.append("file", file);

        if (value.name) formData.append("newName", value.name);

        if (value.type) {
          formData.append("type", value.type);

          if (value.password && value.type === ROOMTYPE.PROTECTED)
            formData.append("password", value.password);
        }

        if (!formData.values().next().done) {
          formData.append("id", updateProp.id.toString());

          const response = await axiosApi.post(
            process.env.NEST_API + "/user/updateRoom",
            formData,
            {
              headers: {
                Accept: "form-data",
              },
              withCredentials: true,
            }
          );

          console.log(response.data);
          // TODO: I have to set that data updated or not message
          if (response.data.status) {

            setImage("");
            setFile(null);
            // if (value.name) {
            //   // Emit the updates of the room like Name and Type
            //   updateProp.setName(value.name);
            // }
            if (value.type) {
              // Emit the updates of the room like Name and Type
              updateProp.setType(value.type);
              socket?.emit('roomTypeChange', {
                adminId: updateProp.ownerId,
                roomId: updateProp.id,
                type: value.type,
              });
            }
          }
        }
        setTimeout(() => setUpdating(false), 300);
      };

      updateRoom();
    },
    validationSchema: yup.object().shape({
      name: yup
        .string()
        .transform((value) => value.trim())
        .matches(/^[a-zA-Z0-9]*$/, "Only alphanumeric")
        .min(4, "Too short !")
        .max(10, "Too long !"),
      type: yup.string().oneOf(Object.values(ROOMTYPE)).notRequired(),
      password: yup.string().when("type", (type, schema) => {
        if (
          type.toString() === ROOMTYPE.PROTECTED &&
          updateProp.type !== ROOMTYPE.PROTECTED
        )
          return schema
            .required("Required !")
            .min(6, "Too short !")
            .matches(
              /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w]).*$/,
              "Weak password !"
            );
        else return schema.notRequired();
      }),
      error: yup.string().notRequired(),
    }),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const readfile: File = e.target.files[0];

      // This is compare just less then one more 1Mb = 1024 * 1024
      if (readfile.size > 5 * 1024 * 1024) {
        setError("File is larger than 5Mb !");
        setTimeout(() => setError(""), 3000);
        // FIXME:
        e.target.files = null;
        return;
      }

      setFile(readfile);

      const reader = new FileReader();

      reader.onload = () => setImage(reader.result as string);

      reader.readAsDataURL(readfile);
    }
  };

  const handleOnClick = (
    type: ROOMTYPE | null,
    e: React.MouseEvent<HTMLElement>
  ) => {
    setSelType(type);
    formik.values.type = type;
    if (type !== ROOMTYPE.PROTECTED) formik.values.password = "";
    if (selcType && ROOMTYPE[selcType] === type) {
      setSelType(null);
      formik.values.type = null;
      formik.values.password = "";
    }
  };

  const handleDeletePic = () => {
    setImage("");
    setFile(null);
  };

  return (
    <div className="roomUpdate__wrapper">
      <h1 className="updateRoom__header"> Updates </h1>
      <div className="roomUpdate__form--wrapper">
        <div className="roomUpdate__input--pic">
          <Image
            src={image ? image : pic}
            height={90}
            width={90}
            alt="Channel image"
            className="roomUpdate__pic"
          />

          <div className="roomUpdate__Pic--wrapper">
            <div className="roomUpdate__deletePic" onClick={handleDeletePic}>
              <Image
                src={deletePic}
                height={10}
                width={10}
                alt="Delete channel image"
              />
            </div>

            <label htmlFor="file" className="roomUpdate__label">
              New
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <form
          className="roomUpdate__input--info"
          onSubmit={formik.handleSubmit}
        >
          <div className="roomUpdate__inpute--wrapper">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              className="roomUpdate__input"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />

            <p className="roomUpdate__inpute--error">
              {formik.touched.name && formik.errors.name
                ? formik.errors.name
                : null}
            </p>
          </div>

          <div id="div3" className="roomUpdate__type__wrapper">
            {/* {
              updateProp.type !== ROOMTYPE.PRIVATE && */}
            <button
              type="button"
              className={selcType === ROOMTYPE.PRIVATE ? "roomUpdate__type--pressed" : "roomUpdate__type"}
              onClick={(e) => handleOnClick(ROOMTYPE.PRIVATE, e)}
              >
              Private
            </button>
            {/* } */}

            {/* {
                            updateProp.type !== ROOMTYPE.PUBLIC && */}
            <button
              type="button"
              className={
                selcType === ROOMTYPE.PUBLIC
                  ? "roomUpdate__type--pressed"
                  : "roomUpdate__type"
              }
              onClick={(e) => handleOnClick(ROOMTYPE.PUBLIC, e)}
            >
              Public
            </button>
            {/* } */}

            {/* {
              updateProp.type !== ROOMTYPE.PROTECTED && */}
            <button
              type="button"
              className={
                selcType === ROOMTYPE.PROTECTED
                  ? "roomUpdate__type--pressed"
                  : "roomUpdate__type"
              }
              onClick={(e) => handleOnClick(ROOMTYPE.PROTECTED, e)}
            >
              Protected
            </button>
            {/* } */}
          </div>

          {selcType === ROOMTYPE.PROTECTED ? (
            <div className="roomUpdate__inpute--wrapper">
              {/* <Image src={show ? showPass : hidePass} width={20} height={20} className="roomUpdate__showLogo" alt='ShowPass Logo'/> */}
              <input
                type="text"
                name="password"
                id="password"
                placeholder="Password"
                className="roomUpdate__input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />

              <p className="roomUpdate__inpute--error">
                {formik.touched.password && formik.errors.password ? (
                  formik.errors.password
                ) : (
                  <></>
                )}
              </p>
            </div>
          ) : (
            <></>
          )}

          {error ? <p className="roomUpdate__inpute--error">{error}</p> : <></>}
          {update ? (
            <p className="roomUpdate__inpute--update">{update}</p>
          ) : (
            <></>
          )}
          {/* {error ? <p className="roomUpdate__inpute--error">{error}</p> : <p className="roomUpdate__inpute--update">{update}</p>} */}
          {updating ? (
            <button type="button" className="roomUpdate__btn">
              Updating...
            </button>
          ) : (
            <button type="submit" className="roomUpdate__btn">
              Update
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default RoomUpdate;
