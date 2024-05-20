import ChatBubble from "../../components/chat_bubble";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import Special_Button from "../../components/special_button";
import { get_response } from "../../utils/ai_talk";
import Cookies from 'js-cookie';
import router from "next/router";

export default function Login() {

    const [failedMessage, setFailedMessage] = useState('');
    const [Uusername, setUsername] = useState('');
    const [Upassword, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    useEffect(() => {
        are_we_logged_in()
    }, []); 

    const are_we_logged_in = async () =>{
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/loggedIn`, {
            method:'GET',
            credentials: 'include'
        });
        if (response.ok) {
            const resJson = await response.json()
            if (resJson.loggedIn) {
                router.push('/admin/adminpage')
            }
        } else {
            console.error('Error:', res.statusText);
        }
    }

    const send_sign_up_request = async (username, password) =>{
        setFailedMessage('')
        console.log(username, password)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/signup`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("signed up sucessfully");
                console.log(data.message);
            } else {
                console.error('Signup error:', response.statusText);
            }
        } catch (e) {
            console.log(e)
            setFailedMessage("failed to sign up")
            return
        }
    }

    const send_login_request = async (username, password) =>{
        setFailedMessage('')
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/login`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                console.log("response is OKAY")
                const { token } = await response.json();
                await Cookies.set('token', token);
                router.push('/admin/adminpage')
            } else {
                console.error('Signup error:', response.statusText);
            }
        } catch (e) {
            console.log(e)
            setFailedMessage("failed to log in")
            return
        }

        return
    }

    return (
        <Layout>
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter your password"
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="flex justify-center">
                    <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-3"
                            onClick={() => {send_login_request(Uusername, Upassword)}}
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </Layout>
    );
}