import Head from 'next/head';
import Layout from '../components/layout';
import Container from '../components/container';
import { useState, useEffect } from 'react'; // Import useState and useEffect if not already imported
import ClosableChip from '../components/closable_chip';
import SuggestionTextBox from '../components/suggestion_text_box';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import ToggleButton from '../components/toggle_button';
import Image from 'next/image';
import { get_response } from '../utils/ai_talk';
import assert from 'assert';
import MB_Button from '../components/MB_Button';
import Link from 'next/link';

export async function getStaticProps() {
  try {
    const home_posts_response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/get_all_ready_articles`);
    const unique_chips_response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/get_unique_chips`);

    if (!home_posts_response.ok || !unique_chips_response.ok) {
      throw new Error('Failed to connect to cms');
    }

    const home_posts_JSON = await home_posts_response.json();
    const unique_chips_JSON = await unique_chips_response.json();

    if (home_posts_JSON.error != "" || unique_chips_JSON.error != ""){
      throw new Error(home_posts_JSON.error + " " + unique_chips_JSON.error);
    }

    var home_posts_DATA = home_posts_JSON.data;
    var unique_chips_DATA = unique_chips_JSON.data;

    const chips = unique_chips_DATA.map( (item, index) => {return item.name} )

    // Sort by date
    home_posts_DATA.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    
    return {
      props: {
        home_posts: home_posts_DATA,
        unique_chips: chips
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
      // We revalidate every 10 seconds if there'a a failure. A failure is likely due to CMS being down.
      // When it's up getStaticProps will not fail, and the other revalidate above will apply
      revalidate: 10,
    };
  }

}

export default function Home({home_posts, unique_chips, setBackgroundColour, backgroundColour}) {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [matchAnyChip, setMatchAnyChip] = useState(true);
  const [aiSearching, setAISearching] = useState(false)
  const [pageTitle, setPageTitle] = useState("ALL ENTRIES")

  const add_to_keywords = (inText) => {

    // Check if inText is not an array and make it an array 
    if (!Array.isArray(inText)) {
      var array = [inText];
    }
    else { var array = inText; }

    array.forEach(kw => {
      if (!selectedKeywords.includes(kw)) {
        setSelectedKeywords(prevKeywords => [...prevKeywords, kw]);
      }
    });
  };

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

      let matched_tags = []

      jp.viable_tags.map((item, index) => {
        unique_chips.map((citem, cindex) => {
          if (matched_tags.includes(citem)) return;
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

  useEffect(() => {
    setBackgroundColour("WhiteBackgroundColour")
  }, []); 


  // Assuming selectedKeywords is meant to be an array
  const filteredPosts = selectedKeywords.length > 0
  ? filter_posts_out() : home_posts;

  return (
    <Layout backgroundColour={backgroundColour}>
      <Head>
        <title>{"Hayden's Personal Site"}</title>
      </Head>
      <section>


        <h1 className='mt-5 text-center font-extrabold text-4xl'>{ selectedKeywords.length > 0 ? pageTitle.toUpperCase() : "ALL ENTRIES" }</h1>

        <div className="bg-gray-300 h-px my-4 prose mx-auto mx-3" />

        {selectedKeywords.length == 0 && <div className='flex space-x-4 justify-center mx-3'>

          <div
            style={{
              backgroundImage: `url(${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/image/tech-desat.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            className={`p-4 text-wrap flex font-medium cursor-pointer Neo-Brutal-White bg-slate-800 text-center`}
            onClick={() => {
              setSelectedKeywords(["Creative Writing", "Short Story"]);
              setPageTitle("Technical Work")
              }}>
            Technical Work
          </div>

          <Link     
            style={{
              backgroundImage: `url(${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/image/writing-desat.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            className={`p-4 text-wrap flex font-medium cursor-pointer Neo-Brutal-White bg-slate-800 text-center`}
            href={"/portfolio"}>
            Curated Writing Portfolio
          </Link>

          <div 
            style={{
              backgroundImage: `url(${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/image/photos-desat.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            className={`p-4 text-wrap flex font-medium cursor-pointer Neo-Brutal-White bg-slate-800 text-center`}
            onClick={() => {
              setSelectedKeywords(["Photography", "Gallery"]);
              setPageTitle("Photo Galleries")
            }}>
            Photo Galleries
          </div>
          
        </div>}

        {selectedKeywords.length > 0 && (
          <div className="mx-3">
            <div className=" h-px prose mx-auto" />
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
              page_title_callback={(x) => setPageTitle(x)}
              defaultText={"refine your search. Use \/ to search in natural language"}/>
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