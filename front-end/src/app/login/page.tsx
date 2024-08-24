"use client";
// "use strict";
import '@/styles/login/styles.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Loding } from '../home/Loding';
import UpdateUserData from '@/components/context/update.context';
import Login from './login';
import Update from '../update/Update';
import '@/app/globals.css'
import axiosApi from '@/components/signComonents/api';


function main()
{
  const router = useRouter(); 
  
  const [online, setonline] = useState(true);
  const [userData, setUser] = useState({userName: '', image: ''});
  const [needUpdate, setNeedUpdate] = useState(false);

    useEffect(() => {
        const getdata = async () => {
            try {
                const ApiUrl: string | undefined =  process.env.NEST_API;
                //console.log('ApiUrl:', ApiUrl , process.env);
                const res = await axiosApi.get(ApiUrl + '/profile',
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
                );
                if (res.data && res.data.update !== undefined) {
                  if (typeof window !== 'undefined') {
                    if (res.data.update === true) {
                      router.push('/');
                    } 
                    else {
                      setUser(res.data);
                      setNeedUpdate(true);
                    }
                  }
                }
                else
                  setonline(false);
            } catch (error) {
                setonline(false);
            } 
        }
        getdata();

    },[]);

    const value = {
      userName: userData?.userName,
      image: userData?.image,
      setNeedUpdate: setNeedUpdate,
      setUser: setUser as React.Dispatch<React.SetStateAction<{ userName: string; image: string; }>>,
    };

    return (
      <>
        <UpdateUserData.Provider value={value}>
          {needUpdate ? <Update /> : online ? <Loding /> : <Login />}
        </UpdateUserData.Provider>
      </>
    );
}

export default main;