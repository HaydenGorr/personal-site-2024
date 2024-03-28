import Head from 'next/head';
import Layout from '../components/layout';
import { getSortedPostsData } from '../lib/posts'
import Container from '../components/container/container';
import home_posts from '../home_posts.json'
import { useState, useEffect } from 'react'; // Import useState and useEffect if not already imported
import ClosableChip from '../components/closable_chip';
import SuggestionTextBox from '../components/suggestion_text_box';
import { generateUniqueChips } from '../utils/generate_unique_posts';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import ToggleButton from '../components/buttons/toggle_button';
import Image from 'next/image';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  var chipsText = generateUniqueChips(home_posts);

  // Sort the chipsText array alphabetically
  chipsText.sort((a, b) => a.localeCompare(b));
  
  return {
    props: {
      allPostsData,
      chipsText,
    },
  };
}

export default function Home({chipsText}) {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [matchAnyChip, setMatchAnyChip] = useState(true);

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

              <div className='mx-1'>
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
            <SuggestionTextBox add_to_keywords={add_to_keywords} chipsText={chipsText} selectedChips_text={selectedKeywords} defaultText={"search tags"}/>
          </div>
        </div>

        <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 1100: 3}}>
          <Masonry gutter="0px">
            {filteredPosts.map((item, index) => (
              <div className='my-3 flex justify-center mx-3'>
                <Container home_post_obj={item} add_keywords_to_filter={add_to_keywords} remove_keyword_from_filer={remove_keywords} selectedKeywords={selectedKeywords}/>
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
                width={500} // Specify the width
                height={300} // And the height
                // Uncomment the line below if you want the GIF to take up the entire container space
                // layout="fill"
                className="your-tailwind-classes" // Tailwind classes can still be applied
              />
          </div>
        }


      </section>
    </Layout>
  );
}