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
import { useRef, useState } from 'react';
import TableOfContentsButton from '../../components/table_of_contents_button';
import ChangeStyle from '../../components/change_style'
import { getPrimaryColour, getSecondaryColour, getTextColour, getTirtaryColour, updateThemeColor } from '../../utils/colour';
import LineBreak from '../../components/line_break';

const CustomLink = dynamic(() => import('../../components/custom_link'), {
  ssr: false,
});

export default function Article({mdxSource, title, chips, publishDate, wordCount, headers, setBackgroundColour, backgroundColour}) {
  const components = {
      Chip,
      MB_Button,
      Image,
      ImageWrapper,
      // a: CustomLink
      a: ({ href, children }) => <CustomLink href={href} children={children} backgroundColour={backgroundColour} />
  };

  const [fontUsed, setFontUsed] = useState("font-sans");
  const containerRef = useRef(null);

  const scrollToText = (text) => {
    const elements = Array.from(containerRef.current.querySelectorAll('h2, h3, h4, h5, h6'))
      .find(el => el.textContent.includes(text));
    
    if (elements) {
      elements.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      <Layout stickyHeader={false} backgroundColour={backgroundColour}>
        <div className={`flex justify-center pt-3 py-6 px-3 ${fontUsed} ${fontUsed == "font-dys" ? 'font-medium': ''} `}>
          <div className={`prose max-w-prose text`} style={{'--tw-prose-headings' : getSecondaryColour(backgroundColour), color: getTextColour(backgroundColour) }}>
            <h1 className={`mt-3 text-w`} style={{'--tw-prose-headings' : getSecondaryColour(backgroundColour), color: getTextColour(backgroundColour)}}>{title}</h1>

            <div className="flex not-prose w-full justify-center">
              <div className="flex flex-wrap justify-center space-x-3">
                {
                chips.map((chip_text, index) => (
                  <div key={index} className="mt-3">
                    <Chip chip_text={chip_text} backgroundColour={backgroundColour}/>
                  </div>
                ))
                }
              </div>
            </div>
                
            {(wordCount != undefined && wordCount > 1) && <div className='relative flex justify-center mt-8'>
              <div className='relative flex'>
                {/* <Image className='m-0' src={'/images/svgs/stopwatch.svg'} width={20} height={20} /> */}
                <p className='text-xs align-middle self-center ml-1 pb-0.5'>{`${wordCount} words | ${Math.floor(wordCount/200)} min read`}</p>
              </div>
            </div>}

            <hr className={`${(wordCount != undefined && wordCount > 0) ? 'mt-0' : ''}`} style={{color: getTirtaryColour(backgroundColour)}}/>
            
            <div ref={containerRef} className={`${getTextColour(backgroundColour)}`}>
              <MDXRemote {...mdxSource} components={components} />
            </div>

            <div className="flex justify-center position">by Hayden</div>
            <p className="flex justify-center place-content-center font-sm mt-3 text-gray-500 text-xs">{"published: " + getDate(publishDate).toString()}</p>
          </div>
        </div>

        <div className='fixed bottom-4 left-4 lg:left-1/2 lg:transform lg:-translate-x-96 overflow-visible text space-y-3'>
          {headers.length > 0 && <TableOfContentsButton headers={headers} scrollToText={scrollToText}/>}
          <ChangeStyle setFontUsed={setFontUsed} setBackgroundColour={setBackgroundColour} />
        </div>


      </Layout>
  );
}

function getHeaders(text){
  const regex = /^(#+)\s+(.*)$/gm;
  const headers = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const level = match[1].length; // Number of '#' characters
    const text = match[2].trim(); // Header text
    headers.push({ level, text });
  }

  return headers;
}

export async function getStaticProps(context) {
    const { id } = context.params;
    const best_part = id.charAt(id.length - 1) === '_'
    const source_folder = id.slice(0, id.length - (best_part ? 1 : 0))
    const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/CMS/articles/${source_folder}/${best_part ? 'bestpart_' : ''}article.mdx`);
    const mdxContent = await res.text();

    console.log(mdxContent)
    
    // Serialize the MDX content only
    const mdxSource = await serialize(mdxContent);

    // const source_folder = id.match(/^[a-zA-Z0-9]+/)[0]

    const article_meta = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/get_article_meta?articlesrc=${source_folder}`);

    if (!article_meta.ok) {
      console.error(`Failed to fetch from CMS: ${article_meta.statusText}`);
      throw new Error(`Failed to fetch from CMS: ${article_meta.statusText}`);
    }

    const Article_Meta_JSON = await article_meta.json();

    const chips = Article_Meta_JSON.chips
    const title = Article_Meta_JSON.title
    const publishDate = Article_Meta_JSON.publishDate
    const wordCount = countWordsInMDX(mdxContent)
    const headers = getHeaders(mdxContent)

    return { props: { mdxSource, title, chips, publishDate, wordCount, headers }, revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE_TIME_SECS), }; 
}

export async function getStaticPaths() {

    try {
        const homePostsResponse = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/get_all_ready_portfolio_articles`);

        console.log("HEATER ", homePostsResponse)
    
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

        var paths = []
    
        for (const article of hprJSON) {
          if (!article.source) {
            console.warn('Article without a source detected.');
            continue
          }

          paths.push({
            params: { id: article.source.toString() }
          });

        }

    
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