import ChatBubble from "../components/chat_bubble";
import Layout from "../components/layout";
import Image from "next/image";
import LineBreak from "../components/line_break"
import CondensedArticle from "../components/portfolio/condensed_article";
import { useEffect, useState } from "react";
import VeryCondensedArticle from "../components/portfolio/very_condensed_article";
import { getTypeTitle, getTypeImage, getTypeColour } from '../utils/portfolio_utils'

export default function Portfolio({portfolio_articles, setBackgroundColour}) {
  
  const [sortedArticles, setSortedArticles] = useState({});

  useEffect(() => {
    setBackgroundColour("WhiteBackgroundColour")

    let titles = {};
    console.log(portfolio_articles)

    const SA = {};

    for (const article of portfolio_articles) {
      const type = getTypeTitle(article.type || "misc.");
      
      if (!SA[type]) {
        SA[type] = [];
      }
      
      SA[type].push(article);
    }

    setSortedArticles(SA)

  }, [portfolio_articles]); 

    return (
        <Layout>
            <div className="flex flex-col items-center pt-6 px-6">
                <div className="prose md-3 mb-6">
                    <h1>HAYDEN'S WRITING PORTFOLIO</h1>
                </div>

                <div className="mb-3">
                    Hey, I'm still buidling this page out, but right where this text is, will be my bio.
                </div>

                <div className="flex mt-3 flex-col max-w-prose mx-3 w-full space-y-12">
                    {Object.entries(sortedArticles).map(([type, articles]) => (
                      <div>
                        <div className="flex mb-4 mt-2 items-center justify-center flex-col">
                          <Image 
                            className="" 
                            width={50} 
                            height={50} 
                            src={getTypeImage(type)}
                            alt={`${type} icon`}
                          />
                          <h1 className={"flex font-semibold text-lg p-1 px-4"} >{type}</h1>
                        </div>
                        <div className="space-y-3">
                          {articles.map((item, index) => (
                            <div>
                              <VeryCondensedArticle key={index} name={item.title} desc={item.desc} type={item.type} has_best_article={item.has_best_article} source={item.source}/>
                              {index != articles.length-1 && <div class="bg-gray-300 h-px mb-4 my-5"></div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {}
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