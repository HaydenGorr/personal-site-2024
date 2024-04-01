import ChatBubble from "../components/chat_Bubble";
import Layout from "../components/layout";
import Image from "next/image";

export default function MissingArticle() {
    return (
        <Layout>
            <div className="flex flex-col items-center pt-6 px-6">
                <div className="pb-6 text-2xl font-bold text-center">This article has been banished to the shadow realm</div>
                <Image src={"/images/missing-article.gif"} width={500} height={500}/>
                <div className="pt-6 text-2xl font-bold items-center">I'm hunting it down and it'll be up again... eventually</div>
            </div>
        </Layout>
    );
  }