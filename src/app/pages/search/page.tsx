"use client";
// import '../../style/style.css';
import { useRouter } from 'next/navigation';
import NaveLayout from '../../component/navelayout';
import Image from 'next/image';

export default function Search() {
    const router = useRouter();

    const handelClick = () =>
    {
        router.push("/");
    }
    return (
        <div>
            <NaveLayout/>
            <div className='main' >
                <div className='mainContainer'>
                    <h1>search page</h1>
                </div>
            </div>
        </div>
    );
  }
