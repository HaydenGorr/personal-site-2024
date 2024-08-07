import ChatBubble from "../components/chat_bubble";
import Layout from "../components/layout";
import { useEffect, useState, useRef } from "react";
import Special_Button from "../components/special_button";
import { get_response } from "../utils/ai_talk";
import ChangeStyle from "../components/change_style";

export default function Chat( { setBackgroundColour, backgroundColour } ) {

    const opening_message = "Hey I'm an AI, powered by Claude Sonnet. I'm here to answer any questions you might have about Hayden and his work!";
    const [chatMessages, setChatMessages] = useState([{incoming: true, text: opening_message}]);
    const [inputValue, setInputValue] = useState('');
    const [displayError, setDisplayError] = useState(false);
    const [useSerif, setUseSerif] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {

        setBackgroundColour("WhiteBackgroundColour")

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

        // Check if displayError is true
        if (displayError) {
            let timer;
            timer = setTimeout(() => {
                setDisplayError(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [displayError, chatMessages]); 


    const send_message = async () => {
        if(inputValue == "") {
            setDisplayError(true)
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
        <Layout backgroundColour={backgroundColour}>
            <div className="flex place-content-center">

                <div className="flex flex-col max-w-prose gap-2 w-full m-3 overflow-scroll px-1" style={{ height: 'calc(100vh - 170px)' }}>
                    {chatMessages.map((message, index) => (
                        <ChatBubble key={index} incoming={message.incoming} inText={message.text}></ChatBubble>
                    ))}
                    <div ref={messagesEndRef} /> {/* Invisible element at the end of the messages */}
                </div>

                <div className="flex absolute bottom-0 max-w-prose w-full mb-3 px-3 h-10">
                    <Special_Button image_src="/images/svgs/send.svg" btnAction = {() => send_message()} error_wiggle={displayError}/>
                    <input
                        className="Neo-Brutal h-full w-full ml-3 px-3 shadow-MB border-white border-2 focus:outline-none focus:rounded-none"
                        type="text"
                        value={inputValue} // Bind the input value to the component's state
                        onChange={handleInputChange} // Update the state every time the input changes
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                send_message();
                                e.preventDefault(); // Prevents the default action of the enter key (e.g., form submission)
                            }
                        }}
                    />         
                </div>

            </div>

        </Layout>
    );
}