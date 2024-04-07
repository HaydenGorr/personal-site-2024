import ChatBubble from "../components/chat_bubble";
import Layout from "../components/layout";
import { useEffect, useState } from "react";
import Special_Button from "../components/special_button";
import { get_response } from "../utils/ai_talk";

export default function Chat() {
    const [chatMessages, setChatMessages] = useState([{incoming: true, text: "Hey feel free to ask anything about Hayden"}]);
    const [inputValue, setInputValue] = useState('');
    const [displayError, setDisplayError] = useState(false);

    useEffect(() => {
        let timer;
        // Check if displayError is true
        if (displayError) {
            timer = setTimeout(() => {
                setDisplayError(false);
            }, 500);
        }
        return () => clearTimeout(timer);
    }, [displayError]); 

    const send_message = async () => {
        if(inputValue == "") {
            setDisplayError(true)
            console.log("Empty message")
            return
        };
        const userMessage = inputValue
        const messagesBackup = chatMessages

        // Store and clear use input
        setChatMessages([...chatMessages, {incoming: false, text: userMessage}])
        setInputValue('')

        // Get response from ai
        const answer = await get_response({ai: "CQ", message: userMessage})
        setChatMessages([...messagesBackup, ...[{incoming: false, text: userMessage}, {incoming: true, text: answer}]])
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <Layout>
            <div className="flex place-content-center h-full ">
                <div className="flex flex-col max-w-prose gap-2 w-full m-3">
                    {chatMessages.map((message, index) => (
                        <ChatBubble key={index} incoming={message.incoming} inText={message.text}></ChatBubble>
                    ))}
                </div>

                <div className="flex absolute bottom-0 max-w-prose w-full mb-3 px-3 h-10">
                    <Special_Button image_src="/images/svgs/send.svg" btnAction = {() => send_message()} error_wiggle={displayError}/>
                    <input
                        className="Neo-Brutal h-full w-full ml-3 px-3 shadow-MB border-white border-2 focus:outline-none focus:rounded-none"
                        type="text"
                        value={inputValue} // Bind the input value to the component's state
                        onChange={handleInputChange} // Update the state every time the input changes
                    />         
                </div>

            </div>
        </Layout>
    );
  }