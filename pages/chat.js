import ChatBubble from "../components/chat_Bubble";
import Layout from "../components/layout";

export default function Chat() {
    return (
        <Layout>
            <div className="flex justify-center">
                <div className="max-w-prose">
                    <ChatBubble></ChatBubble>
                    <ChatBubble></ChatBubble>
                    <ChatBubble></ChatBubble>
                    <ChatBubble></ChatBubble>
                </div>
            </div>
        </Layout>
    );
  }