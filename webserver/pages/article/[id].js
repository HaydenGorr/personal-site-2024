import Layout from '../../components/layout';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import Chip from '../../components/chip';
import MB_Button from '../../components/MB_Button';
import Image from 'next/image';
import ImageWrapper from '../../components/image_wrapper';
// import CustomLink from '../../components/custom_link';
import dynamic from 'next/dynamic';
import getDate from '../../utils/date_utils'


const CustomLink = dynamic(() => import('../../components/custom_link'), {
  ssr: false,
});

export default function Article({mdxSource, title, chips, publishDate}) {
    const components = {
        Chip,
        MB_Button,
        Image,
        ImageWrapper,
        a: CustomLink
    };

    return (
        <Layout>
            <div className='flex justify-center pt-3 py-6 px-3'>
                <div className="prose max-w-prose">
                    <h1 className='mt-3'>{title}</h1>
                    <div className="flex not-prose w-full justify-center">
                      <div className="flex flex-wrap justify-center">
                        {
                        chips.map((chip_text, index) => (
                          <div key={index} className="mr-3 mt-3">
                            <Chip chip_text={chip_text} />
                          </div>
                        ))
                        }
                      </div>
                    </div>
                    <hr/>

                    <MDXRemote {...mdxSource} components={components}/>
                    <div className="flex justify-center position">by Hayden</div>
                    <p className="flex justify-center place-content-center font-sm mt-3 text-gray-500 text-xs">{"published: " + getDate(publishDate).toString()}</p>
                </div>
            </div>
        </Layout>
    );
}

export async function getStaticProps(context) {
    const { id } = context.params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/CMS/articles/${id}/article.mdx`);
    const mdxContent = await res.text();
    
    // Serialize the MDX content only
    const mdxSource = await serialize(mdxContent);

    const article_meta = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/get_article_meta?articlesrc=${id}`);

    if (!article_meta.ok) {
      console.error(`Failed to fetch from CMS: ${article_meta.statusText}`);
      throw new Error(`Failed to fetch from CMS: ${article_meta.statusText}`);
    }

    const Article_Meta_JSON = await article_meta.json();

    const chips = Article_Meta_JSON.chips;
    const title = Article_Meta_JSON.title;
    const publishDate = Article_Meta_JSON.publishDate;

    return { props: { mdxSource, title, chips, publishDate }, revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE_TIME_SECS), }; 
}

export async function getStaticPaths() {

    try {
        const homePostsResponse = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/get_all_ready_articles`);
    
        if (!homePostsResponse.ok) {
          console.error(`Failed to fetch from CMS: ${homePostsResponse.statusText}`);
          throw new Error(`Failed to fetch from CMS: ${homePostsResponse.statusText}`);
        }
    
        const hprJSON = await homePostsResponse.json();
        
        if (!Array.isArray(hprJSON)) {
          console.error('Expected an array from the CMS response');
          throw new Error('Invalid format for home_posts response.');
        }
    
        const paths = hprJSON.map(article => {
          if (!article.source) {
            console.warn('Article without a source detected.');
          }
          return {
            params: { id: article.source ? article.source.toString() : '' },
          };
        })
    
        return { paths, fallback: 'blocking' };
      } catch (error) {
        console.error(`Error in getStaticPaths: ${error.message}`);
    
        return { paths: [], fallback: 'blocking' };
      }

  }