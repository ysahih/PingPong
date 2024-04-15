import '@/styles/login/styles.css';
import '@/styles/login/loding.css'
import Image from "next/image";

export const Loding = () => {
  return (
      // <div className="loader"></div> 
      <div className='containerLoding'>
        <Image
          className="lodingImg"
          src='./Vector.svg'
          alt="logo"
          width={50}
          height={50}
          style={{
            height: "auto",
            width: "auto",
            maxWidth: "100%",
          }} />
      </div>
  );
};