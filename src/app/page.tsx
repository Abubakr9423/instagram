"use client";

import Image from 'next/image';
import { SubmitHandler, useForm } from 'react-hook-form';
import { loginUser } from '../lib/features/log/logapi';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface IFormInput {
  username: string;
  password: string;
}

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const resultAction = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(resultAction)) {
      toast.success("Login successful 🎉");
      router.push('/home');
    } else {
      toast.error("Invalid username or password ❌");
    }
  };

  return (
    <div className="flex justify-evenly items-center p-20">
      <Image src="/landing-2x.png" alt="logo" width={521} height={450} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-100 p-6 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md shadow-sm"
      >
        <input
          {...register("username")}
          type="text"
          placeholder="Phone number, username, or email"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
        >
          Log in
        </button>

        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 text-blue-700 font-medium text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988h-2.54V12h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
          Log in with Facebook
        </button>

        <a href="#" className="mt-3 text-xs text-blue-500 hover:underline text-center">
          Forgot password?
        </a>
        <Button className="mt-3 text-xs text-blue-500 hover:underline text-center">
          <Link href={'/register'}>
            Sign in
          </Link>
        </Button>
      </form>
    </div>
  );
};

export default Page;