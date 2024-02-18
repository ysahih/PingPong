import Image from "next/image";
import NaveLayout from "./component/navelayout";

export default function Home() {
  return (
    <div>
      <NaveLayout/>
      <div className='main' >
        <div className='home'>
          <div className="home-top">

            <div className="home-top-content">
              <div  className="homeGameMode">
                <h1 className="text-image">DARK VALLEY</h1>
                <button className="button-image">Play Now</button>
              </div>
              <div className="GameColorMode">
                <a type='image' className="alertebuttonDeny"  >
                      <Image  src="/homeImages/blackcircle.svg" alt="blackcircle"    width={15} height={15}  />
                </a>
                <a type='image' className="alertebuttonAccept"  >
                      <Image  src="/homeImages/blackcircle.svg"  alt="whitecircel" width={15} height={15} />
              </a>
              </div>
            </div>
            <div className="home-top-image">
              <Image  src="/homeImages/prototypelight.png"  alt="ligh" width={1500} height={500} />
             </div>
          </div>
          <div className="home-botton">
            <h1>hello</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

