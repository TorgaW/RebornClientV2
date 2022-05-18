import React from "react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
    return (
        <div className="w-full h-full flex justify-center px-2 py-10">
            <div className="w-full md:w-[750px] h-[400px] bg-dark-purple-100 bg-opacity-10 shadow-lg mt-10 rounded-xl flex flex-col p-4 text-white items-center justify-center gap-5">
                <h3 className="text-2xl font-semibold">Restore your password</h3>
                <div className="w-full flex flex-col gap-1">
                    <span className="text-gray-300 font-semibold opacity-70 text-sm">New password</span>
                    <input type="password" className="w-full h-10 rounded-md ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none bg-dark-purple-500 p-2" />
                </div>
                <div className="w-full flex flex-col gap-1">
                    <span className="text-gray-300 font-semibold opacity-70 text-sm">Authentication code</span>
                    <input
                        type="text"
                        className="w-full h-10 rounded-md ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none bg-dark-purple-500 p-2"
                    />
                </div>
                <div className="flex flex-col gap-4 items-center mt-7">
                    <button className="h-12 bg-dark-purple-100 bg-opacity-70 hover:bg-opacity-100 animated-100 rounded-md font-semibold w-44">Change password</button>
                    <Link to="/signin">
                        <span className="underline text-teal-400 opacity-70 hover:opacity-100 cursor-pointer animated-100 px-2">Back to sign in</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}