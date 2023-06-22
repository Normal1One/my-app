'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const schema = yup
    .object({
        name: yup.string(),
        email: yup.string().email(),
        password: yup.string(),
    })
    .required();

type formValues = {
    name: string;
    email: string;
    password: string;
};

export default function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<formValues>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: formValues) => {
        axios
            .post('/api/register', JSON.stringify(data))
            .then(() => toast.success('Registered successfully!'))
            .catch(() => toast.error('Something went wrong!'));
    };

    return (
        <>
            <div>
                <Toaster />
            </div>
            <div className='flex align-middle h-screen'>
                <form
                    className='flex flex-col m-auto p-7 rounded shadow-xl gap-4 bg-gray-300'
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <input
                        className='appearance-none leading-tight focus:outline-none rounded border-none'
                        type='text'
                        placeholder='Name'
                        {...register('name')}
                    ></input>
                    <p className='text-red-500'>{errors.name?.message}</p>
                    <input
                        className='appearance-none w-full leading-tight focus:outline-none rounded border-none'
                        type='email'
                        placeholder='Email'
                        {...register('email')}
                    ></input>
                    <p className='text-red-500'>{errors.email?.message}</p>
                    <input
                        className='appearance-none w-full leading-tight focus:outline-none rounded border-none'
                        type='password'
                        autoComplete='on'
                        placeholder='Password'
                        {...register('password')}
                    ></input>
                    <p className='text-red-500'>{errors.password?.message}</p>
                    <button
                        className='font-bold focus:outline-none m-auto text-white bg-gray-500 rounded pt-3 pb-3 hover:opacity-75 w-full'
                        type='submit'
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </>
    );
}
