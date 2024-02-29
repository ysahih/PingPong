import * as Yup from 'yup'



export const SignupForm =  {
        Email: '',
        FirstName: '',
        LastName: '',
}

export const updateForm =  {
    userName: '',
    Password: '',
    "Confirm Password": '',
}


export const signupValidationSchema = Yup.object().shape({
    LastName: Yup.string()
        .transform((value) => value.trim())
        .min(2, 'Too Short!')
        .max(20, 'Too Long!')
        .required('Required'),
    FirstName: Yup.string()
        .transform((value) => value.trim())
        .min(2, 'Too Short!')
        .max(20, 'Too Long!')
        .required('Required'),
    Email: Yup.string().email('Invalid email').required('Required'),
});

export const updateValidationSchema = Yup.object().shape({
    userName: Yup.string()
        .transform((value) => value.trim())
        .min(4, 'Too Short!')
        .max(20, 'Too Long!')
        .required('Required')
        .matches(/^[a-zA-Z0-9-_]+$/, 'No spaces or special characters allowed'),
    Password: Yup.string()
        .min(6, 'Too Short!')
        .max(50, 'Too Long!')
        .matches(/[a-z]/, 'Needs a lowercase letter')
        .matches(/[A-Z]/, 'Needs a uppercase letter')
        .matches(/[0-9]/, 'Needs a number')
        .required('Required'),
    "Confirm Password": Yup.string()
        .oneOf([Yup.ref('Password')], 'Passwords must match')
        .required('Required')
});

