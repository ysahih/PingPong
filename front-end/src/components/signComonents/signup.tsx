"use client";
import axios from "axios";
import {useFormik } from "formik";
import { SignupForm, signupValidationSchema } from "@/components/Formik/Formik";
import '@/styles/login/styles.css';
import UpdateUserData from "@/components/context/update.context";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [singin , setsing] = useState(false);

    const context = useContext(UpdateUserData);
    const router = useRouter();
    const signupRequest = async (values: typeof SignupForm) => {
        
        try {
            if (values.FirstName === "" || values.LastName === "" || values.Email === "" || singin === true) {
                return;
            }
            setsing(true);
            const response = await axios.post(process.env.NEST_API + '/signup', {
                firstName: values.FirstName,
                email: values.Email,
                lastName: values.LastName,
            }, {
                withCredentials: true
            });
            if (!response || response.data.error)
            throw new Error('Error');
            context?.setUser({ userName: response?.data?.userName || '', image: response?.data?.image || '' });
            context?.setNeedUpdate(true);
            setsing(false);
        } catch (error: any) {
                formik.setErrors({ Email: 'Email is already used or invalide' });
                setsing(false);
        }
    }
    
    const formik = useFormik(
        {
            initialValues: SignupForm,
            validationSchema: signupValidationSchema,
            onSubmit: signupRequest
        }
    );

    return (
        <form onSubmit={formik.handleSubmit} className="input-container">
            <input value={formik.values.FirstName}  onChange={formik.handleChange} name="FirstName" key="FirstName" className={`input ${formik.errors.FirstName && formik.touched.FirstName ? 'InputError' : ''}`} placeholder="First name" type="text" autoComplete="yes" onBlur={formik.handleBlur}/>
            {formik.errors.FirstName && formik.touched.FirstName ? <p className="ErrorMessage">{formik.errors.FirstName}</p> : ''}
            <input onChange={formik.handleChange} value={formik.values.LastName} name="LastName" key="LastName" className={`input ${formik.errors.LastName && formik.touched.LastName ? 'InputError' : ''}`} placeholder="Last name" type="text" autoComplete="yes" onBlur={formik.handleBlur}/>
            {formik.errors.LastName && formik.touched.LastName ? <p className="ErrorMessage">{formik.errors.LastName}</p> : ''}
            <input  value={formik.values.Email} onChange={formik.handleChange} name="Email" key="Email" className={`input ${formik.errors.Email && formik.touched.Email ? 'InputError' : ''}`} placeholder="Email" type="email" autoComplete="yes" onBlur={formik.handleBlur}/>
            {formik.errors.Email && formik.touched.Email ? <p className="ErrorMessage">{formik.errors.Email}</p> : ''}
            <button id="singbtn" type="submit">Sign up</button>
        </form>
    )
}
