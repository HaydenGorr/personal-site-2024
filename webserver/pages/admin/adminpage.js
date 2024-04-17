import ChatBubble from "../../components/chat_bubble";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import Special_Button from "../../components/special_button";
import { get_response } from "../../utils/ai_talk";

export default function Admin() {

    const [articles, setArticles] = useState('');


    useEffect(() => {
        get_articles()
    }, []); 

    const get_articles = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/get_all_articles`);
        if (res.ok) {
          console.log("response is OKAY");
          const data = await res.json();
          console.log(data);
          setArticles(data);
        } else {
          console.error('Error:', res.statusText);
        }
      };

    return (
        <Layout>
            <div className="flex place-content-center h-full ">
                articles
                {articles}
            </div>
        </Layout>
    );
  }