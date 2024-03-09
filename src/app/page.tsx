"use client";
"use strict";
import { useEffect, useState } from 'react';
import '../styles/login/landingPage.css';
import axios from 'axios';
import UserDataContext,{UserData} from '@/components/context/context';
import App from './App';
import { Loding } from './home/Loding';
import { useRouter } from 'next/navigation';
import VerifyTwoFa from '@/components/Qrcode/QRcode';


export default function landingPage()
{
    const [data, setData] = useState<UserData | null>(null);
    const [checkTwoFactor, setCheckTwoFactor] = useState(data?.twofaCheck || false);

    const router = useRouter();

    useEffect(() => {
        if(!data)
        {
            const getdata = async () => {
            try {
                const ApiUrl = process.env.NEST_API;
                const res = await axios.get(ApiUrl + '/profile', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                if (res.data === undefined || res.data === false || res.data === null || res.data.update === undefined || res.data.update === false) {
                    router.push('/login');
                }
                else if (res.data.twoFa === true) {
                    setData(res.data);
                    setCheckTwoFactor(res.data.twofaCheck);
                }
                else if (res.data.twoFa === false) {
                    setData(res.data);
                    setCheckTwoFactor(true);
                }
                else
                    setData(res.data);
                console.log('Data:', res.data, data);
                } catch (error) {
                    // console.log('Error:', error);
                    router.push('/login');
                }
            }
            getdata();
        }
    },[]);
    

    return (
        <>
            <UserDataContext.Provider value={data}>
            {data? checkTwoFactor? <App/> : <VerifyTwoFa close={setCheckTwoFactor}/> : <Loding/>}
            </UserDataContext.Provider>
        </>
    );
}


