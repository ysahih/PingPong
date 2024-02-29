"use client";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import UpdateUserData from "@/components/context/update.context";
import { useRouter } from "next/navigation";

export default function Signin() {

    const [error, setError] = useState(false);
    const inputRef = useRef(null);
    const context = useContext(UpdateUserData);
    const router = useRouter();
    useEffect(() => {
        if (inputRef.current) {
            (inputRef.current as HTMLInputElement)?.focus();
        }
    }, []);

    function singRequest(e: React.FormEvent<HTMLFormElement>)
    {
        e.preventDefault();
        const signin = async () => {
            const data = {
                userName: (document.getElementsByName("Email or UserName")[0] as HTMLInputElement).value,
                email: (document.getElementsByName("Email or UserName")[0] as HTMLInputElement).value,
                password: (document.getElementsByName("Password")[0] as HTMLInputElement).value
            };
            try {
                const response = await axios.post(process.env.NEST_API + '/signin', JSON.stringify(data) , {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                console.log(response.data);
                const responseData = response.data;
                if (responseData.login === undefined || responseData.login === false || responseData.login === null) {
                    setError(true);
                } else {
                    if(responseData.update === false)
                        context?.setNeedUpdate(true);
                    else
                        router.push('/');
                    context?.setUser(response.data);
                }
            } catch (error) {
                setError(true);
            }
        }
        signin();
    }

    return (
        <form className='input-container' onSubmit={singRequest}>
            <input ref={inputRef} name="Email or UserName" type="text" className={`input ${error ? 'InputError' : ""}`}  placeholder="Email or UserName"/>
            <input name="Password" type="password" autoComplete="none" className={`input ${error ? 'InputError' : ""}`}  placeholder="Password" />
            {error && <p className="ErrorMessage">Invalid userName or password</p>}
            <button type="submit" id="singbtn">Sign in</button>
        </form>
    )
}

//req.password