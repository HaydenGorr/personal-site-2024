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

export default function Article({mdxSource, title, chips, publishDate, wordCount}) {
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
                      <div className="flex flex-wrap justify-center space-x-3">
                        {
                        chips.map((chip_text, index) => (
                          <div key={index} className="mt-3">
                            <Chip chip_text={chip_text} />
                          </div>
                        ))
                        }
                      </div>
                    </div>

                    {(wordCount && wordCount > 0) && <div className='relative flex justify-center mt-8'>
                      <div className='relative flex'>
                        {/* <Image className='m-0' src={'/images/svgs/stopwatch.svg'} width={20} height={20} /> */}
                        <p className='text-xs align-middle self-center ml-1 pb-0.5'>{`${wordCount} words | ${Math.floor(wordCount/200)} min read`}</p>
                      </div>
                    </div>}

                    <hr className={`${(wordCount && wordCount > 0) ? 'mt-0' : ''}`}/>

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

    const chips = Article_Meta_JSON.chips
    const title = Article_Meta_JSON.title
    const publishDate = Article_Meta_JSON.publishDate
    const wordCount = countWordsInMDX(mdxContent)

    return { props: { mdxSource, title, chips, publishDate, wordCount }, revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE_TIME_SECS), }; 
}

export async function getStaticPaths() {

    try {
        const homePostsResponse = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/get_all_ready_articles`);
    
        if (!homePostsResponse.ok) {
          console.error(`Failed to fetch from CMS: ${homePostsResponse.statusText}`);
          throw new Error(`Failed to fetch from CMS: ${homePostsResponse.statusText}`);
        }
    
        const hprJSONs = await homePostsResponse.json();
        const hprJSON = hprJSONs.data;
        
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

  function countWordsInMDX(content) {
    // Remove lines that are code (import statements, JSX tags, etc.)
    const codeLinePattern = /^\s*(import|<.*>|{|})/;
    const lines = content.split('\n');
    const textLines = lines.filter(line => !codeLinePattern.test(line));
    
    // Join the text lines and split by whitespace to count words
    const textContent = textLines.join(' ');
    const words = textContent.match(/\b\w+\b/g);
    
    return words ? words.length : 0;
  }