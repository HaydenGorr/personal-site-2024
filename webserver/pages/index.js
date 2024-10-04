import Head from 'next/head';
import Layout from '../components/layout';
import NewContainer from '../components/newContainer';
import { useState, useEffect, useRef } from 'react'; // Import useState and useEffect if not already imported
import SuggestionTextBox from '../components/suggestion_text_box';
import Image from 'next/image';
import { get_response } from '../utils/ai_talk';
import assert from 'assert';
import NewClosableChip from '../components/new_closable_chip'
import AiResponseChatbox from '../components/ai_response_chatbox'
import BottomTextBox from '../components/bottom_text_box';

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
  const [tagSearchingAI, setTagSearchingAI] = useState(false)
  const [messageQueryingAI, setMessageQueryingAI] = useState(false)
  const [pageTitle, setPageTitle] = useState("ALL ENTRIES")
  const [userText, setUserText] = useState("")
  const [responseText, setResponseText] = useState("");
  const [userTextBackup, setUserTextBackup] = useState(userText)

  const [bottomSearchBox, setBottomSearchBox] = useState(false);
  const bottomSearchBoxRef = useRef(null);

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

		// if (!userMSG.startsWith('/')) return

		setTagSearchingAI(true)
		setUserText("")

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
		//   setMatchAnyChip(jp.filter_type == "any")
		}
		catch (e) {
		console.log(e)
		}

		setTagSearchingAI(false)

	};

  	const SendMessageToAI = async () => {
	if(userText == "") {
		setDisplayError(true)
		return
	};

	setMessageQueryingAI(true)
	setUserText("")

	// Get response from ai
	const answer = await get_response({ai: "CQ", message: userText})
	setResponseText(answer)

	setMessageQueryingAI(false)
	};

	useEffect(() => {
        if (userText!="") setUserTextBackup(userText)
    }, [userText]);

	useEffect(() => {
		setBackgroundColour("DarkGreyBackgroundColour")

		const bottomSearchBoxObserver = new IntersectionObserver(
			([entry]) => {
				setBottomSearchBox(entry.isIntersecting)
			},
			{ threshold: 0 }
		);

		if (bottomSearchBoxRef.current) {
			bottomSearchBoxObserver.observe(bottomSearchBoxRef.current);
		}

		return () => {
			if (bottomSearchBoxRef.current) {
				bottomSearchBoxObserver.unobserve(bottomSearchBoxRef.current);
			}
		};

		
	}, []); 


	// Assuming selectedKeywords is meant to be an array
	const filteredPosts = selectedKeywords.length > 0
	? filter_posts_out() : home_posts;

	return (
		<Layout backgroundColour={backgroundColour}>
		<Head>
			<title>{"Hayden's Personal Site"}</title>
		</Head>
		<section className='flex flex-col'>

			{/** SECTION 1 */}
			<div className={`h-screen w-full flex flex-col items-center overflow-visible max-h-screen px-4`}>

				<div className='mt-20 text-center '>
					<h1 className='font-extrabold text-5xl text-neutral-100'>{ selectedKeywords.length > 0 ? pageTitle.toUpperCase() : "Hayden's Portfolio" }</h1>
					<p className='font-normal text-sm mt-4 max-w-96 text-neutral-100'>{ selectedKeywords.length > 0 ? pageTitle.toUpperCase() : "This site contains reviews of code projects, short stories, non-fiction articles and more, all created by me, Hayden" }</p>
				</div>

				<div className='w-full h-full flex flex-col items-center mb-36 justify-center'>
					
					<AiResponseChatbox largeBox={true} textToDisplay={responseText} loading={"aiResponseLoading"}/>

					{/** THE TEXT INPUT COMPONENT WITH THE BUTTON COMPONENTS */}
					<div className='w-full max-w-prose'>
						<div className="mt-6 mb-3 h-10 " ref={bottomSearchBoxRef}>
							<SuggestionTextBox 
							messageQueryingAI={messageQueryingAI}
							tagSearchingAI={tagSearchingAI}
							getTagsFromAI={getTagsFromAI}
							add_to_keywords={add_to_keywords}
							chipsText={unique_chips}
							selectedChips_text={selectedKeywords}
							page_title_callback={(x) => setPageTitle(x)}
							defaultText={""}
							SendMessageToAI={SendMessageToAI}
							userText={userText}
							setUserText={setUserText} />
						</div>	
					</div>
					
					<div className='relative z-50 flex justify-center'>
						<div className={`max-w-prose fixed mb-8 bottom-0 w-full px-4 transition-all duration-500 ${!bottomSearchBox ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'}`}>
							{responseText && <div className='mb-4'>
								<AiResponseChatbox textToDisplay={responseText} loading={"aiResponseLoading"}/>
							</div>}
							<SuggestionTextBox 
								messageQueryingAI={messageQueryingAI}
								tagSearchingAI={tagSearchingAI}
								getTagsFromAI={getTagsFromAI}
								add_to_keywords={add_to_keywords}
								chipsText={unique_chips}
								selectedChips_text={selectedKeywords}
								page_title_callback={(x) => setPageTitle(x)}
								defaultText={""}
								SendMessageToAI={SendMessageToAI}
								userText={userText}
								setUserText={setUserText}/>
						</div>
					</div>


				</div>

			</div>

			{/** SECTION 2 */}
			<div className='relative flex flex-col -translate-y-24'>

				<div className='w-full flex flex-col items-center mb-2'>
					<p className='text-xs text-neutral-100 opacity-95'>psst... content down here</p>
					<div className='h-2 w-2 rounded-full bg-dg-400 mt-4'/>
				</div>

				{/* {selectedKeywords.length > 0 && (
					<div className={`z-20 sticky top-1 z-50 -mt-2 w-full`}>
						<div className={`flex space-x-4`}>
						{selectedKeywords.map((item, index) => (
							<NewClosableChip
							key={index}
							chip_text={item}
							remove_keywords={remove_keywords}
							svg_path={`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/TAG_SVGS/${item.toLowerCase()}.svg`}
							>
								<Image 
								className="ml-2"
								src={"images/svgs/cancel.svg"}
								width={20}
								height={20}/>
							</NewClosableChip>
						))}
						</div>
					</div>
				)} */}

				{/** THE ARTICLE CONTAINERS */}
				<div className={`flex w-full justify-center`}>
					<div className="grid grid-cols-1 mds:grid-cols-2 mdl:grid-cols-3 gap-4 max-w-fit">
						{filteredPosts.map((item, index) => (
						<div className='m-3 flex flex-col items-center'>
							<NewContainer
							incolour={"dpi"}
							home_post_obj={item}
							add_keywords_to_filter={add_to_keywords}
							remove_keyword_from_filer={remove_keywords}
							selectedKeywords={selectedKeywords}/>
						</div>
						))}
					</div>
			</div>
			
			{/** IF THERE ARE NO ARTICLES THEN THIS GIF PLAYS */}
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
			
		</div>

	</section>
    </Layout>
  );
}