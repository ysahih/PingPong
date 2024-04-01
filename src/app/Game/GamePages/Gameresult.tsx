import '@/app/globals.css'
import "@/styles/game/Gameplay.css";
import {  useEffect } from 'react';


const Gameresult : React.FC<{ result : string , stopGame : () => void} > = (props) => {

  useEffect(() => {
      setTimeout(() => {
        props.stopGame();
      }, 2000);
  }, []);


    return (
      <div className="w-[100vw] h-[100vh] absolute z-50 flex justify-center  items-center backdrop-blur-sm">
       
        <div className="  w-[400px] max-w-[700px] rounded-full h-[400px]  flex justify-center items-center border-[15px] border-blue-500 shadow-[0_0_20px_10px_#3B82F6]" >
          <div className=" result  w-[270px]  rounded-full h-[270px]  flex justify-cente items-center border-[15px] border-blue-500 shadow-[0_0_20px_10px_#3B82F6]" >
            <h1 className="font-sans font-semibold text-white text-6xl text-center" >{props.result}</h1> 
          </div>
        </div>
      </div>
  
    )
  }

export default Gameresult;



//   import '@/app/globals.css'
// import "@/styles/game/Gameplay.css";
// import { useEffect } from 'react';
// import toast, { Toaster } from 'react-hot-toast';


// const Gameresult : React.FC<{ result : string , rungame : boolean} > = (props) => {


  

//   useEffect(() => {
//     // Call the toast function here
//     toast.success(props.result);
//   }, []); 
//     return (   
//       <div>
//         <Toaster/>
//       </div>
//     )
//   }

//   export default Gameresult;
