'use client'
import Image from "next/image";
import { useState } from "react";
import { send_login_request, send_sign_up_request } from "../../../api/sign_in";
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const [failedMessage, setFailedMessage] = useState('');
  const [Uusername, setUsername] = useState('');
  const [Upassword, setPassword] = useState('');
  const [mKey, setmKey] = useState('');

  const handleUsernameChange = (event: any) => {
      setUsername(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
};

const handleMasterKeyChange = (event: any) => {
    setmKey(event.target.value);
};

  const on_login = () => {
    router.push('/admin');
  }

  const on_fail_to_login = (e: string) => {
    console.log("failed", e)
  }

  const on_signup = () => {
    router.push('/admin');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded shadow-md">
                {failedMessage&& <div className="text-center">{failedMessage}</div>}
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                            placeholder="Enter your username"
                            onChange={handleUsernameChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                            placeholder="Enter your password"
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Master Key
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                            placeholder="Enter your password"
                            onChange={handleMasterKeyChange}
                        />
                    </div>
                    <div className="flex justify-center">
                    <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-3"
                            onClick={() => {send_login_request(Uusername, Upassword, on_login, on_fail_to_login)}}
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-3"
                            onClick={() => {send_sign_up_request(Uusername, Upassword, mKey, on_signup, on_fail_to_login)}}
                        >
                            sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
  );
}
