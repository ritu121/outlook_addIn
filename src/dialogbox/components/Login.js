import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import logo from "./../../../assets/selltis-logo.gif";

import { Signin_URL } from './../../env-constants';

const Login = ({onAuthCompleted, onCancel}) => {
    // form validation rules 
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('User Name is required'),
        password: Yup.string().required('Password is required'),
        domain: Yup.string().required('Domain is required')
    });
    const formOptions = { 
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
     };

    const { 
        register, 
        setError, 
        handleSubmit, 
        formState 
    } = useForm(formOptions);

    const { errors, isSubmitting, isDirty, isValid } = formState;

    const onSubmit = async ({ username, password, domain }) => {
        return new Promise(async (resolve) => {
            const rawResponse = await fetch(Signin_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'userName': username,
                    'pwd': password,
                    'hostName': domain
                })
            }).catch((error) => {
                setError("root.serverError", { type: 'manual', message: 'Invalid credentials.' });
                resolve();
            });
    
            const responseJson = await rawResponse.text().catch((error) => {
                setError("root.serverError", { type: 'manual', message: 'Invalid credentials.' });
                resolve();
            });
            if(responseJson !== ''){
                const profileMessage = {
                    userName: username,
                    hostDomainName: domain,
                    authToken: responseJson
                };
                onAuthCompleted(profileMessage);
            } else {
                setError("root.serverError", { type: 'manual', message: 'Invalid credentials.' });
                resolve();
            }
        });
    }

    return (
        <div className="flex h-screen flex-col justify-center items-center pt-10 pl-10 pr-10 pb-6">
            <div className="pt-6 pb-8 px-6 rounded-2xl shadow-xl z-20 border border-gray-200 bg-gray-100">
                <div className="flex justify-center">
                    <img width="200" height="100" src={logo} alt="Selltis" title="Selltis" />
                </div>
                <h2 className="mt-6 text-2xl text-slt-blue font-bold text-center mb-4">Login</h2>
                <div className="">
                    <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <input autoFocus className="block text-sm py-3 px-4 rounded-lg w-full border outline-none" maxLength={50} placeholder="User Name" name="username" type="text" {...register('username')} />
                        <input className="block text-sm py-3 px-4 rounded-lg w-full border outline-none" maxLength={50} placeholder="Password" name="password" type="password" {...register('password')} />
                        <input className="block text-sm py-3 px-4 rounded-lg w-full border outline-none" maxLength={50} placeholder="Domain" name="domain" type="text" {...register('domain')} />
                        <button type="submit" className="py-3 w-64 text-xl text-white  bg-slt-blue hover:bg-slt-blue-light disabled:bg-gray-400 rounded-2xl" disabled={isSubmitting || !isDirty || !isValid}>
                            {
                                isSubmitting &&
                                <div className="flex items-center justify-center">
                                    <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white-700 border-4"></div>
                                    <div className="ml-2">Sign In... </div>
                                </div>
                            }
                            {!isSubmitting && <span>Sign In</span>}
                        </button>
                        <button onClick={onCancel} className="py-3 w-64 text-xl text-white  bg-gray-600 hover:bg-gray-500 disabled:bg-gray-400 rounded-2xl" disabled={isSubmitting}>
                            {
                                isSubmitting &&
                                <div className="flex items-center justify-center">
                                    <div className="ml-2">Cancel</div>
                                </div>
                            }
                            {!isSubmitting && <span>Cancel</span>}
                        </button>
                    </form>
                    {
                        errors.root && errors.root.serverError &&
                        <div className="text-xs text-red-500 bg-red-50 p-3 mt-3 rounded-lg">{errors.root.serverError.message}</div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Login;
