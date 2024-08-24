"use client";
import "./createRoom.css";
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Image from "next/image";
import pic from "@/../public/createRoom/GroupChat.svg";
import { RoomFormat, ROOMTYPE } from "./interfaces";
import SocketContext from "../context/socket";
import UserDataContext from "../context/context";
import toast, { Toaster } from "react-hot-toast";
import axiosApi from "../signComonents/api";
// import { RoomFormat, ROOMTYPE } from "../../app/createRoom/interfaces";

const CreateRoom = () => {
	const [selcType, setSelType] = useState<ROOMTYPE>(ROOMTYPE.PRIVATE);
	const [create, setCreate] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [image, setImage] = useState<string>("");
	const [file, setFile] = useState<File | null>(null);
	const [creating, setCreating] = useState<boolean>(false);
	const socket = useContext(SocketContext);
	const user = useContext(UserDataContext);
	const toastType = new Map([
		["Creating..." , toast.loading],
		["Created !", toast.success],
	]);

  // Select Room Type
	const handleOnClick = (type: ROOMTYPE, e: React.MouseEvent<HTMLElement>) => {
	ROOMTYPE[selcType] === type ? e.preventDefault() : setSelType(type);
	formik.values.type = type;
	if (type !== ROOMTYPE.PROTECTED) formik.values.password = "";
	};

  // Select Room Pic
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

	const createToast = (message :string) => {
		const toastFunc = toastType.get(message);
		const toastId = toastFunc ? toastFunc(message) : toast.error(message);
		setTimeout(() => {
			toast.dismiss(toastId);
		}, 2000);
	}

	const formik = useFormik<RoomFormat>({
		initialValues: {
		name: "",
		type: ROOMTYPE.PRIVATE,
		password: "",
		error: "",
	},
	onSubmit: (value: RoomFormat) => {
		setCreating(true);

		const createRoom = async () => {
			const formData = new FormData();

			if (file) formData.append("file", file);

			formData.append("name", value.name);
			formData.append("type", value.type);
			if (value.type === ROOMTYPE.PROTECTED)
			formData.append("password", value.password);

			const response = await axiosApi.post(process.env.NEST_API + "/user/createRoom", formData,
				{
					headers: {
					Accept: "form-data",
					},
					withCredentials: true,
				}
			);

			// response.data.status ? setCreate(response.data.message) : setError(response.data.message);
			response.data.status ? createToast("Created !") : createToast(response.data.message);
			if (response.data.status)
				socket?.emit('createRoom', {
					ownerId: user?.id,
					roomId: response.data.roomId
			})
			setCreating(false);
			formik.values.password = "";

			setTimeout(() => (response.data.status ? setCreate("") : setError("")), 2000);
		};

		createRoom();
	},
	validationSchema: yup.object().shape({
		name: yup
			.string()
			.transform((value) => value.trim())
			.matches(/^[a-zA-Z0-9]*$/, "Only alphanumeric")
			.required("Required !")
			.min(4, "Too short !")
			.max(10, "Too long !"),

		type: yup.string().oneOf(Object.values(ROOMTYPE)),

		password: yup.string().when("type", (type, schema) => {
		if (type.toString() === ROOMTYPE.PROTECTED)
			return schema
				.required("Required !")
				.min(6, "Too short !")
				.matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w]).*$/,"Weak password !");
			else
				return schema.notRequired();
		}),
		error: yup.string().notRequired(),
	}),
  });

  return (
	// <>
	<div className="createRoom">
		<Toaster containerStyle={{
			marginTop: "100px",
			zIndex: "10"
		}}/>
	  <h1 className="createRoom__header">Chat Room</h1>

	  <div className="createRoom__wrapper">
		<div className="createRoom__picture">
		  <Image
			src={image ? image : pic.src}
			height={70}
			width={70}
			alt="Group_image"
			className="createRoom__image"
		  />

		  <label htmlFor="file" className="createRoom__input--file">
			Add
		  </label>
		  <input
			id="file"
			name="file"
			type="file"
			accept="image/*"
			autoComplete="none"
			onChange={handleFileChange}
		  />
		</div>

		<form className="createRoom__form" onSubmit={formik.handleSubmit}>
		  <div id="div2" className="createRoom__input--wrapper">
			<input
			  type="text"
			  name="name"
			  id="name"
			  placeholder="Name"
			  className="createRoom__input"
			  autoComplete="none"
			  onChange={formik.handleChange}
			  onBlur={formik.handleBlur}
			  value={formik.values.name}
			/>
			<p className="createRoom__formik__check">
			  {formik.touched.name && formik.errors.name
				? formik.errors.name
				: null}
			</p>
		  </div>

		  <div id="div3" className="createRoom__type__wrapper">
			<button
			  id="div4"
			  type="button"
			  className={
				selcType === ROOMTYPE.PRIVATE
				  ? "createRoom__type--pressed"
				  : "createRoom__type"
			  }
			  onClick={(e) => handleOnClick(ROOMTYPE.PRIVATE, e)}
			>
			  Private
			</button>

			<button
			  type="button"
			  className={
				selcType === ROOMTYPE.PUBLIC
				  ? "createRoom__type--pressed"
				  : "createRoom__type"
			  }
			  onClick={(e) => handleOnClick(ROOMTYPE.PUBLIC, e)}
			>
			  Public
			</button>

			<button
			  type="button"
			  className={
				selcType === ROOMTYPE.PROTECTED
				  ? "createRoom__type--pressed"
				  : "createRoom__type"
			  }
			  onClick={(e) => handleOnClick(ROOMTYPE.PROTECTED, e)}
			>
			  Protected
			</button>
		  </div>

		  {selcType === ROOMTYPE.PROTECTED ? (
			<div id="div1" className="createRoom__input--wrapper">
			  <input
				type="password"
				name="password"
				id="password"
				placeholder="Password"
				className="createRoom__input"
				autoComplete="none"
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				value={formik.values.password}
			  />
			  <p className="createRoom__formik__check">
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

		  {error ? (
			<p className="createRoom__response--error">{error}</p>
		  ) : (
			<></>
		  )}
		  {create ? (
			<p className="createRoom__response--create">{create}</p>
		  ) : (
			<></>
		  )}

		  {creating ? (
			<button type="button" className="createRoom__btn" /*style={{padding: "8px 16px"}}*/ >
			  Creating...
			</button>
		  ) : (
			<button type="submit" className="createRoom__btn" /*style={{padding: "8px 16px"}}*/ >
			  Create
			</button>
		  )}
		</form>
	  </div>
	</div>
	// </>
  );
};

export default CreateRoom;
