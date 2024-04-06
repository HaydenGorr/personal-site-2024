import Head from 'next/head';
import Layout from '../components/layout';
import Container from '../components/container';
import { useState } from 'react'; // Import useState and useEffect if not already imported
import ClosableChip from '../components/closable_chip';
import SuggestionTextBox from '../components/suggestion_text_box';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import ToggleButton from '../components/toggle_button';
import Image from 'next/image';
import { get_response } from '../utils/ai_talk';
import assert from 'assert';

export async function getStaticProps() {
  
  try {
    const home_posts_response = await fetch(`${process.env.NEXT_PUBLIC_CMS_ROUTE}/meta_resources/home_posts`);
    const unique_chips_response = await fetch(`${process.env.NEXT_PUBLIC_CMS_ROUTE}/meta_resources/unique_chips`);

    if (!home_posts_response.ok || !unique_chips_response.ok) {
      throw new Error('Failed to fetch data');
    }

    const home_posts = await home_posts_response.json();
    const unique_chips = await unique_chips_response.json();

    return {
      props: {
        home_posts,
        unique_chips
      },
      revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE_TIME_SECS),
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        home_posts: [],
        unique_chips: []
      },
      revalidate: 60,
    };
  }
}

export default function Home({home_posts, unique_chips}) {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [matchAnyChip, setMatchAnyChip] = useState(true);
  const [aiSearching, setAISearching] = useState(false)

  const add_to_keywords = (inText) => {
    if (selectedKeywords.includes(inText)) return;  
    setSelectedKeywords([...selectedKeywords, inText])
  }

  const remove_keywords = (inText) => {
    setSelectedKeywords(selectedKeywords.filter(keyword => keyword !== inText));
  }

  const filter_posts_out = () => {
    if (matchAnyChip) {
      return home_posts.filter(post => selectedKeywords.some(keyword => post.chips.includes(keyword)))
    }
    else {
      return home_posts.filter(post => selectedKeywords.every(keyword => post.chips.includes(keyword)))
    }
  }

  const getTagsFromAI = async (userMSG) => {
    if (!userMSG.startsWith('/')) return

    setAISearching(true)

    const response = await get_response({ ai: "TF", message: userMSG });

    try {
      let jp = JSON.parse(response); 

      assert(!!jp.viable_tags, "viable_tags is not defined in the response")
      assert(!!jp.filter_type, "filter_type is not defined in the response")

      console.log(jp)

      let matched_tags = []

      jp.viable_tags.map((item, index) => {
        console.log(item)
        unique_chips.map((citem, cindex) => {
          citem.toLowerCase() == item.toLowerCase() ? matched_tags.push(citem) : null;
        })
      })
  
      setSelectedKeywords(matched_tags);
      setMatchAnyChip(jp.filter_type == "any")
    }
    catch (e) {
      console.log(e)
    }

    setAISearching(false)

  };

  // Assuming selectedKeywords is meant to be an array
  const filteredPosts = selectedKeywords.length > 0
  ? filter_posts_out() : home_posts;

  return (
    <Layout home>
      <Head>
        <title>{"Hayden's Personal Site"}</title>
      </Head>

      <section>

        {selectedKeywords.length > 0 && (
          <div className="mt-3 mx-3">
            <div className="flex flex-wrap justify-center">
              {/* <div>contains any</div> */}
              {selectedKeywords.map((item, index) => (
                <div className="mr-3 mt-3"> 
                  <ClosableChip key={index} chip_text={item} remove_keywords={remove_keywords} svg_path={"images/svgs/cancel.svg"} />
                </div>
              ))}
            </div>
            <div className='flex justify-center items-center mt-6'>
              <div className='m3-1'>
                {"match"}
              </div>

              <div className='mx-1 w-fit over'>
                <ToggleButton text={"any"} lowercase="true" btnAction={() => {setMatchAnyChip(true)}} toggled={matchAnyChip==true}/>
              </div>
              <div className='mx-1'>
                <ToggleButton text={"all"} lowercase="true" btnAction={() => {setMatchAnyChip(false)}} toggled={matchAnyChip==false}/>
              </div>

              <div className='ml-1'>
                {"of the tags"}
              </div>
              
            </div>
          </div>
        )}

        <div className="w-100% mx-3">
          <div className="mt-6 mb-3 h-10 max-w-prose mx-auto">
            <SuggestionTextBox 
              aiSearching={aiSearching}
              filter_keywords={getTagsFromAI}
              add_to_keywords={add_to_keywords}
              chipsText={unique_chips}
              selectedChips_text={selectedKeywords}
              defaultText={"get ai to help with \" /<your search>\""}/>
          </div>
        </div>

        <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 1100: 3}}>
          <Masonry gutter="0px">
            {filteredPosts.map((item, index) => (
              <div className='my-3 flex justify-center mx-3'>
                <Container
                  home_post_obj={item}
                  add_keywords_to_filter={add_to_keywords}
                  remove_keyword_from_filer={remove_keywords}
                  selectedKeywords={selectedKeywords}/>
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>

        {filteredPosts.length == 0 && 
          <div className='flex justify-center items-center flex-col mt-10'>
            {'I\'ve got nothing for you :\('}
              <Image
                src="/images/empty.gif"
                alt="Description of GIF"
                width={500}
                height={300}
                className="your-tailwind-classes"
              />
          </div>
        }


      </section>
    </Layout>
  );
}