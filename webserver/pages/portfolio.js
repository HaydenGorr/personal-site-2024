import ChatBubble from "../components/chat_bubble";
import Layout from "../components/layout";
import Image from "next/image";
import LineBreak from "../components/line_break"
import CondensedArticle from "../components/portfolio/condensed_article";
import { useEffect } from "react";
import VeryCondensedArticle from "../components/portfolio/very_condensed_article";

export default function Portfolio({portfolio_articles, setBackgroundColour}) {

  useEffect(() => {
    setBackgroundColour("WhiteBackgroundColour")
  }, [portfolio_articles]); 

    return (
        <Layout>
            <div className="flex flex-col items-center pt-6 px-6">
                <div className="prose md-3 mb-6">
                    <h1>HAYDEN'S WRITING PORTFOLIO</h1>
                </div>

                <div className="mb-6">
                    Hi, I'm Hayden gorringe, an aspiring game writer. Born 1997.
                </div>

                <div className="flex mt-3 flex-col max-w-prose mx-3 w-full space-y-6">
                    {portfolio_articles.map((item, index) => (
                        <VeryCondensedArticle key={index} name={item.title} desc={item.desc} type={item.type} has_best_article={item.has_best_article} source={item.source}/>
                    ))}
                </div>
            </div>                                   
        </Layout>
    );
}

export async function getStaticProps() {
  try {
    const portfolio_articles_response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/get_all_ready_portfolio_articles`);

    if (!portfolio_articles_response.ok) {
      throw new Error('Failed to connect to cms');
    }

    const portfolio_articles_json = await portfolio_articles_response.json();

    if (portfolio_articles_json.error != ""){
      throw new Error(portfolio_articles_json.error);
    }
    return {
      props: {
          portfolio_articles: portfolio_articles_json.data,
      },
      revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE_TIME_SECS),
    };
    
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
          portfolio_articles: []
      },
      // We revalidate every 10 seconds if there'a a failure. A failure is likely due to CMS being down.
      // When it's up getStaticProps will not fail, and the other revalidate above will apply
      revalidate: 10,
    };
  }

}