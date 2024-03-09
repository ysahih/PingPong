import Image from "next/image";
import '@/styles/login/landingPage.css';
import bground from '../../public/homeImages/Backgroundimage.webp';

const BackGround = () => {
    return (
        <div className='bg'>
            <Image
                src={bground}
                alt="background"
                priority={true}
                quality={100}
                fill
                sizes="100vw"
                placeholder="blur"
                style={{
                    objectFit: 'cover',
                    // filter: 'saturate(0.55)',
                    filter: 'brightness(0.70)',
                }} />
         </div>
    );
}

export default BackGround;