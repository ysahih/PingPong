"use client";
"use strict";
import { useEffect, useState } from 'react';
import '../styles/login/landingPage.css';
import axios from 'axios';
import UserDataContext,{UserData} from '@/components/context/context';
import Home from './home/Home';
import { Loding } from './home/Loding';
import { useRouter } from 'next/navigation';
// import '@/styles/globals.css';

export default function landingPage()
{
    const [data, setData] = useState<UserData | null>(null);
    
    const router = useRouter();

    useEffect(() => {
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
                else
                    setData(res.data);
                } catch (error) {
                    console.log('Error:', error);
                    router.push('/login');
                }
        }
        getdata();
    },[]);
    
    return (
        <>
            <UserDataContext.Provider value={data}>
            {data? <Home/> : <Loding/>}
            </UserDataContext.Provider>
        </>
    );
}
// req.password