import Image from "next/image";
import Signup from '@/components/signComonents/signup';
import { useRouter } from "next/navigation";
import Signin from '@/components/signComonents/signin';
import { useState } from "react";


const Login = () => {
    const router = useRouter(); 
    const [insignin, setsign] = useState(true);
    
return  (
    <div className='main'>
        <div className='container' >
          <div className='row'>
              <div className="logo">
                <Image
                    className="logoImg"
                    src='./Vector.svg'
                    alt="logo"
                    width={50}
                    height={50}
                    style={{
                        maxWidth: "100%",
                    }} />
                <h1 className="logoName">P<span>O</span>NGy</h1>
              </div>
              <div id='loginBtn'>
                  <a href='#' className={`${insignin ? 'inactive_sing' : 'active_sing' }`} onClick={()=>{
                    setsign(false)
                  }}>Sign up</a>

                  <a href='#' className={`${insignin ? 'active_sing' : 'inactive_sing'}`} onClick={()=>{
                    setsign(true);
                  }}>Login</a>
                  <div>
                    {insignin ? <Signin/> : <Signup/>}
                  </div>
              </div>
            </div>
          <div className='row1'>
              <div id='div-row1'>
                  <div  className='btnAuth' onClick={()=>{
                    router.push(process.env.NEST_API + '/api/auth/intra');
                  }}>
                    <Image
                        src="./IntraLogo.svg"
                        alt=""
                        width={'100'}
                        height={'100'}
                        style={{
                            maxWidth: "100%",
                            height: "auto"
                        }} />
                    <span>Intra</span>
                  </div>
                  <div  className='btnAuth' onClick={
                    ()=>{
                      router.push(process.env.NEST_API + '/api/auth/google');
                    }
                  }>
                    <Image
                        src='./GoogleLogo.svg'
                        alt=""
                        width={'100'}
                        height={'100'}
                        style={{
                            maxWidth: "100%",
                            height: "auto"
                        }} />
                    <span>Google</span>
                  </div>
              </div>
          </div>
      </div>
    </div>
    );
};

export default Login;