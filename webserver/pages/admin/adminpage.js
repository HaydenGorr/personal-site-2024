import ChatBubble from "../../components/chat_bubble";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import Special_Button from "../../components/special_button";
import { get_response } from "../../utils/ai_talk";

export default function Admin() {

    useEffect(() => {
    }, []); 

    return (
        <Layout>
            <div className="flex place-content-center h-full ">
                admin page
            </div>
        </Layout>
    );
  }