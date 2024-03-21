import ChatBubble from "../components/chat_Bubble";
import Layout from "../components/layout";
import { get_messages, store_chat_message, clear } from "../utils/session_stoage_util";
import { useEffect, useState } from "react";
import MB_Button from "../components/buttons/MB_Button";
import Special_Button from "../components/buttons/special_button";

export default function Chat() {
    const [chatMessages, setChatMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [displayError, setDisplayError] = useState(false);

    useEffect(() => {
        setChatMessages(get_messages());
    }, []);


    useEffect(() => {
        let timer;
        // Check if displayError is true
        if (displayError) {
            // Set a timer to turn off displayError after 5 seconds
            timer = setTimeout(() => {
                setDisplayError(false);
            }, 500);
        }
    
        // Cleanup function to clear the timer if the component unmounts
        // or if displayError changes before the timer completes
        return () => clearTimeout(timer);
    }, [displayError]); // This effect depends on displayError

    const send_message = () => {
        if(inputValue == "") {
            setDisplayError(true)
            console.log("Empty message")
            return
        };
        store_chat_message({is_incoming: false, message: inputValue})
        setChatMessages(get_messages());
        setInputValue('')
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <Layout>
            <div className="flex place-content-center h-full ">

                <div className="flex flex-col max-w-prose gap-2 w-full m-3">
                    {chatMessages.map((message, index) => (
                        <ChatBubble incoming={message.incoming} inText={message.text}></ChatBubble>
                    ))}
                </div>

                <div className="flex absolute bottom-0 max-w-prose w-full mb-3 px-3 h-10">
                    <Special_Button image_src="/images/svgs/send.svg" btnAction = {() => send_message()} error_wiggle={displayError}/>
                    <input
                        className="bg-black h-full w-full ml-3 text-white px-3 shadow-MB border-white border-2 focus:outline-none focus:rounded-none"
                        type="text"
                        value={inputValue} // Bind the input value to the component's state
                        onChange={handleInputChange} // Update the state every time the input changes
                    />         
                </div>

            </div>
        </Layout>
    );
  }