"use client";
// import '../style/style.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// import '../globals.css'



export default function Slidebar ()  {
    const router = useRouter();

    const handelClick = ( url:string) =>
    {
        router.push(url);
    };
    return (  
        <div>
            <div className='selidbarparent'>
                <div className='selidbar'>
                <div className='slibarelementTop'>
                    <button className='Sidebutton' onClick={() => handelClick("/")} >
                        <Image className='butoonImage' src="/homeImages/HomeIcon.svg" alt="Home icon" width={22} height={22} />
                        <p className='ButoonSlideText' >Home</p> 
                    </button>
                    <button className='Sidebutton' onClick={() => handelClick("/pages/games")} >
                        <Image className='butoonImage' src="/homeImages/Games.svg" alt="Games icon" width={22} height={22} />
                        <p className='ButoonSlideText' >Games</p> 
                    </button>
                    <button className='Sidebutton' onClick={() => handelClick("/pages/ranking")}>
                        <Image className='butoonImage' src="/homeImages/rank.svg" alt="Ranking icon" width={22} height={22}/>  
                        <p className='ButoonSlideText' >Ranking</p>  
                    </button>
                    <button className='Sidebutton' onClick={() => handelClick("/pages/search")}>
                        <Image className='butoonImage' src="/homeImages/search.svg" alt="Search icon" width={22} height={22}/>     
                        <p className='ButoonSlideText' >Search</p>  
                    </button>
                </div>
                <div className='slibarelementBotton'>
                    <figure className='sidebarprofile'>
                        <Image src="/homeImages/profilesidebar1.svg" alt="profile image" width={40} height={40}/>
                        <figcaption  className='usernametext'>
                        Username
                        </figcaption>
                        <button className='slidebarprofilebutton'>
                        logout
                        </button>
                    </figure>
                </div>
                </div>
            </div>
        </div>
    );
}
 
