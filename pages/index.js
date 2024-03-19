import Head from 'next/head';
import Layout from '../components/layout';
import { getSortedPostsData } from '../lib/posts'
import Container from '../components/container/container';
import home_posts from '../home_posts.json'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{"Hayden's Personal Site"}</title>
      </Head>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-content-around">
          {home_posts.map((item, index) => (
            <div className='my-6 flex justify-center mx-6'>
              <Container title={item.title} body_text={item.desc} image_src={item.image} chips={item.chips}/>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}