import Layout from '../../components/layout';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import Chip from '../../components/chip';
import MB_Button from '../../components/MB_Button';
import Image from 'next/image';
import ImageWrapper from '../../components/image_wrapper';
import dynamic from 'next/dynamic';
import getDate from '../../utils/date_utils'
import { useEffect, useRef, useState } from 'react';
import TableOfContentsButton from '../../components/table_of_contents_button';
import ChangeStyle from '../../components/change_style'
import { getPrimaryColour, getSecondaryColour, getTextColour, getTirtaryColour, getDarkerColour } from '../../utils/colour';
import LineBreak from '../../components/line_break';
import PopUpMain from '../../components/pop_up_settings/pop_up_main';
import Cookies from 'js-cookie'
import StyleCustomiser from '../../components/pop_up_settings/content/style_customiser';
import StyleCustomiserHeader from '../../components/pop_up_settings/headers/style_customiser_header';
import ArticleIndexHeader from '../../components/pop_up_settings/headers/article_index_header';
import ArticleIndex from '../../components/pop_up_settings/content/article_index'
import { Read_MDX_file } from '../../utils/read_mdx'

const CustomLink = dynamic(() => import('../../components/custom_link'), {
  ssr: false,
});

export default function Article({mdxSource, title, chips, publishDate, wordCount, headers, setBackgroundColour, backgroundColour}) {
	const components = {
		Chip,
		MB_Button,
		Image,
		ImageWrapper,
		pre: (props) => <pre {...props} style={{ backgroundColor: "#383838" }} />,
		// a: CustomLink
		a: ({ href, children }) => <CustomLink href={href} children={children} backgroundColour={backgroundColour} />,
		p: (props) => <p {...props} style={{ color: getTextColour(backgroundColour), textAlign: 'left' }} />,
		strong: (props) => <strong {...props} style={{ color: getTextColour(backgroundColour) }} />,
	};

	const [opened_customise_menu, set_opened_customise_menu] = useState(false);
	const [fontUsed, setFontUsed] = useState("font-Josefin");
	const containerRef = useRef(null);

	const scrollToText = (text) => {
		const elements = Array.from(containerRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6'))
			.find(el => el.textContent.includes(text));

		console.log("bucket ", elements)
		
		if (elements) {
			elements.scrollIntoView({ behavior: 'smooth' });
		}
	};

	useEffect(() => {
		setBackgroundColour(Cookies.get('backgroundColour'))
	}, []);

	
    const [button_colour, set_button_colour] = useState(null);
    const [check, setCheck] = useState(false);
    useEffect(() => {
        // Get the background colour from the cookie
        const bgColor = Cookies.get('backgroundColour');
        if (bgColor) {
			// Set the state with the darker colour
			set_button_colour(getDarkerColour(bgColor));
        } else {
			// Optionally set a default color if the cookie is not set
			set_button_colour(getDarkerColour('GreyBackgroundColour')); // Replace with your default color
        }
      }, [check]);

	return (
		<Layout stickyHeader={false} backgroundColour={backgroundColour}>
			<div className={`flex justify-center p-6 ${fontUsed} ${fontUsed == "font-dys" ? 'font-medium': ''} `}>
				<div className={`prose max-w-prose text flex flex-col items-center transition-all duration-500`} style={{'--tw-prose-headings' : getTextColour(backgroundColour), color: getTextColour(backgroundColour) }}>
					<h1 className={`md:mt-4 mt-8 mb-6 font-extrabold text-5xl text-neutral-100 w-full`}
						style={{'--tw-prose-headings' : getTextColour(backgroundColour), color: getTextColour(backgroundColour)}}>{title}</h1>
						
					{(wordCount != undefined && wordCount > 1) && <div className='relative flex justify-center space-x-2 mb-8'>
						{/** Word count */}
						<div className='relative flex bg-dg-800 rounded-md h-fit'>
							<p className='text-xs align-middle self-center m-2 text-dg-200'>{`${wordCount} words`}</p>
						</div>
						{/** Hold long to read */}
						<div className='relative flex bg-dpi-800 rounded-md h-fit'>
							<p className='text-xs align-middle self-center m-2 text-dpi-200'>{Math.floor(wordCount/200) + " min to read"}</p>
						</div>
					</div>}

					<hr className={`${(wordCount != undefined && wordCount > 0) ? 'mt-0' : ''}`} style={{color: getTirtaryColour(backgroundColour)}}/>
					
					<div ref={containerRef} className={`leading-8 ${getTextColour(backgroundColour)}`}>
						<MDXRemote {...mdxSource} components={components} />
					</div>

					<div className="flex justify-center position">by Hayden</div>
					<p className="flex justify-center place-content-center font-sm mt-3 text-gray-500 text-xs">{"published: " + getDate(publishDate).toString()}</p>
				</div>
				<div className='misc-button-container fixed bottom-4 w-full flex justify-center'>
					<div className='w-full max-w-[calc(50rem)] max-h-screen pt-4 overflow-y-scroll space-y-4' onClick={() => { setCheck(!check) }}>
						<PopUpMain colour={button_colour} >
							<StyleCustomiserHeader/>
							<StyleCustomiser setBackgroundColour={setBackgroundColour} setFontUsed={setFontUsed}/>
						</PopUpMain>
						<PopUpMain colour={button_colour} >
							<ArticleIndexHeader/>
							<ArticleIndex headers={headers} scrollToTextCallback={scrollToText}/>
						</PopUpMain>
					</div>
						
				</div>
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/mdx/${id}.mdx`);


    const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/mdx/${id}.mdx`);
    const mdxContent = await res.text()

    console.log(mdxContent)
    console.log("id", id)

    // Serialize the MDX content only
    const mdxSource = await serialize(mdxContent);

    const chips = res_JSON.data.chips
    const title = res_JSON.data.title
    const publishDate = res_JSON.data.publishDate
    // const wordCount = countWordsInMDX(mdxContent)
    const wordCount = 100
    // const headers = getHeaders(mdxContent)
    const headers = []

    return { props: { mdxSource, title, chips, publishDate, wordCount, headers }, revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE_TIME_SECS), }; 
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
          const filename = article.article.split('/').pop();
          return {
            params: { id: filename },
          };
        })
    
        return { paths, fallback: 'blocking' };
      } catch (error) {
        console.error(`Error in getStaticPaths: ${error.message}`);
    
        return { paths: [], fallback: 'blocking' };
      }

  }

function countWordsInMDX(content) {
  console.log("\n\n\n\n\n\n", content)

  // Remove lines that are code (import statements, JSX tags, etc.)
  const codeLinePattern = /^\s*(import|<.*>|{|})/;
  const lines = content.split('\n');
  const textLines = lines.filter(line => !codeLinePattern.test(line));
  
  // Join the text lines and split by whitespace to count words
  const textContent = textLines.join(' ');
  const words = textContent.match(/\b\w+\b/g);
  
  return words ? words.length : 0;
}