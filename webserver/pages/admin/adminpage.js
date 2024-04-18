import ChatBubble from "../../components/chat_bubble";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import Special_Button from "../../components/special_button";
import { get_response } from "../../utils/ai_talk";
// import Container from "../../components/container";
import AdminContainer from "../../components/admin/admin_container";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import ClosableChip from "../../components/closable_chip";

export default function Admin() {

    const [articles, setArticles] = useState([]);
    const [chips, setChips] = useState([]);


    useEffect(() => {
        get_articles();
        // get_chips();
    }, []); 

    const get_articles = async () => {
        // This gets all of the articles, even unpublished ones
        const res = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/get_all_articles`, {
            method:'GET',
            credentials: 'include'
        });
        if (res.ok) {
            console.log("response is OKAY");
            const data = await res.json();
            console.log(data);
            setArticles(data);
        } else {
            console.error('Error:', res.statusText);
        }
    };

    // const get_chips = async () => {
    //     const res = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/get_unique_chips`);
    //     if (res.ok) {
    //         console.log("response is OKAY");
    //         const data = await res.json();
    //         console.log(data);
    //         setChips(data);
    //     } else {
    //         console.error('Error:', res.statusText);
    //     }
    // };

    return (
        <Layout>
            <h1 className='mt-5 mb-2 text-center font-extrabold text-4xl'>ADMIN PAGE</h1>
            <div className="">

            {/* {chips.map((item, index) => (
                <ClosableChip chip_text={item.text}/>
            ))}  */}
            
            <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 1100: 3}}>
                <Masonry gutter="0px">
                    {articles.length > 0 && articles.map((item, index) => (
                        <AdminContainer
                        home_post_obj={item}
                        add_keywords_to_filter={() => {}}
                        remove_keyword_from_filer={() => {}}
                        selectedKeywords={[]}/>
                    ))}
                </Masonry>
            </ResponsiveMasonry>
            </div>
        </Layout>
    );
  }