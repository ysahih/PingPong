"use client";
"use strict";
import { useEffect, useState } from 'react';
import '../styles/login/landingPage.css';
import axios from 'axios';
import UserDataContext,{UserData} from '@/components/context/context';
import App from './App';
import { Loding } from './home/Loding';
import { useRouter } from 'next/navigation';


export default function landingPage()
{
    const ddata: UserData = {
        id: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        userName: "ucef",
        email: "",
        image: "",
        firstName: "",
        lastName: "",
        online: false,
    };

    const [data, setData] = useState<UserData | null>(ddata);
    
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
                    // router.push('/login');
                }
                else
                    setData(res.data);
                } catch (error) {
                    // console.log('Error:', error);
                    // router.push('/login');
                }
        }
        getdata();
    },[]);
    
    return (
        <>
            <UserDataContext.Provider value={data}>
            {data? <App/> : <Loding/>}
            {/* <App/> */}
            </UserDataContext.Provider>
        </>
    );
}
// req.password

