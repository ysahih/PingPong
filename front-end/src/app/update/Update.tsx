"use client";
import React, { useContext } from "react";
import "@/styles/login/styles.css";
import "@/styles/update/update.css";
import Image from "next/image";
import { useState } from "react";
import UpdateForm from "./UpdateForm";
import UpdateUserData from "@/components/context/update.context";

const UpdatePage = () => {
  const context = useContext(UpdateUserData);
  const [imageSrc, setImageSrc] = useState(
    context?.image ? context.image : "./defaultImg.svg"
  );
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file?.type.includes("image")) {
      setImageSrc(file ? URL.createObjectURL(file) : context?.image? context.image : imageSrc);
      setFile(file || null);
    }
  };

  return (
    <>
      <main className="main_1">
        <div className="update-container">
          <div className="flex items-center gap-2 mb-4  p-4">
            <Image
              className="max-w-[50px] max-h-[50px]"
              src={"./Vector.svg"}
              alt="logo"
              width={50}
              height={50}
              priority={true}
              style={{
                height: "auto",
                width: "auto",
                maxWidth: "100%",
              }}
            />
            <h1 className="logoName">
              P<span>O</span>NGy
            </h1>
          </div>
          <div className="update-row">
            <UpdateForm file={file} />

            <div className="update-row-image">
              <Image
                className="UpdatedPhoto"
                src={imageSrc}
                alt="Pongy"
                width={100}
                height={100}
                priority={true}
              />
              <Image
                className="updateLogo"
                src="./update.svg"
                alt="upload"
                width={10}
                height={10}
                priority={true}
              />
              <input
                type="file"
                id="ImageInput"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="ImageInput" className="update-botton">
                Update
              </label>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default UpdatePage;
