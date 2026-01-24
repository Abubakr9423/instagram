"use client";

import { Button } from "@/components/ui/button";
import { instagramFont } from "../font";
import { Facebook } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

interface IFormInput {
    Username: string;
    FullName: string;
    Password: string;
    ConfirmPassword: string;
    Email: string;
}

const Page = () => {
    const { register, handleSubmit } = useForm<IFormInput>();
    const router = useRouter();
    const dispatch = useDispatch();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        if (data.Password !== data.ConfirmPassword) {
            toast.error("Passwords do not match ❌");
            return;
        }

        const payload = {
            username: data.Username,
            fullName: data.FullName,
            password: data.Password,
            confirmPassword: data.ConfirmPassword,
            email: data.Email,
        };

        try {
            const resultAction = await dispatch(registerUser(payload));

            if (registerUser.fulfilled.match(resultAction)) {
                toast.success("Registration successful 🎉");
                router.push("/");
            } else {
                toast.error("Registration failed ❌");
            }
        } catch (error) {
            toast.error("Registration failed ❌");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black flex-col">
            <div className="w-[350px] border border-gray-300 dark:border-gray-700 bg-white dark:bg-black p-6 rounded-md shadow-sm">
                {/* Logo */}
                <p
                    className={`
            ${instagramFont.className}
            text-[52px]
            text-[#262626]
            dark:text-white
            tracking-[-0.06em]
            leading-none
            antialiased
            select-none
            scale-x-[1.03]
            text-center
          `}
                >
                    Instagram
                </p>

                {/* Subtitle */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Sign up to see photos and videos from your friends.
                </p>

                {/* Facebook login */}
                <Button className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Facebook className="w-4 h-4" />
                    Log in with Facebook
                </Button>

                {/* Divider */}
                <div className="flex items-center my-4">
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    <span className="px-2 text-xs text-gray-500 dark:text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                </div>

                {/* Form */}
                <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
                    <input
                        {...register("Email")}
                        type="text"
                        placeholder="Mobile number or email address"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                        {...register("Password")}
                        type="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                        {...register("ConfirmPassword")}
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                        {...register("FullName")}
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                        {...register("Username")}
                        type="text"
                        placeholder="Username"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        People who use our service may have uploaded your contact information to Instagram.{" "}
                        <span className="text-blue-600 dark:text-blue-400">Learn more</span>
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
                    </p>

                    <Button type="submit" className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                        Sign Up
                    </Button>
                </form>
            </div>

            {/* Login link */}
            <div className="w-[350px] border border-gray-300 dark:border-gray-700 bg-white dark:bg-black p-4 mt-4 text-center text-sm">
                Have an account?{" "}
                <span className="text-blue-600 dark:text-blue-400">Log in</span>
            </div>
        </div>
    );
};

export default Page;
