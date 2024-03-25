import Head from 'next/head';
import Layout from '../components/layout';
import { getSortedPostsData } from '../lib/posts'
import Container from '../components/container/container';
import home_posts from '../home_posts.json'
import { useState, useEffect } from 'react'; // Import useState and useEffect if not already imported
import ClosableChip from '../components/closable_chip';


export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home() {
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  const add_to_keywords = (inText) => {
    setSelectedKeywords([...selectedKeywords, inText])
  }

  const remove_keywords = (inText) => {
    setSelectedKeywords(selectedKeywords.filter(keyword => keyword !== inText));
  }
 
  // Assuming selectedKeywords is meant to be an array
  const filteredPosts = selectedKeywords.length > 0
  ? home_posts.filter(post => selectedKeywords.some(keyword => post.chips.includes(keyword))) : home_posts;

  return (
    <Layout home>
      <Head>
        <title>{"Hayden's Personal Site"}</title>
      </Head>

      <section>

      {selectedKeywords.length > 0 && (
        <div className="flex flex-wrap mx-6 mt-3">
          {selectedKeywords.map((item, index) => (
            <ClosableChip key={index} chip_text={item} remove_keywords={remove_keywords} />
          ))}
        </div>
      )}


        <div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-content-around">
          {filteredPosts.map((item, index) => (
            <div className='my-6 flex justify-center mx-6'>
              <Container title={item.title} body_text={item.desc} image_src={item.image} chips={item.chips} add_keywords_to_filter={add_to_keywords}/>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}