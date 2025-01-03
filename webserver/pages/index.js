import Head from 'next/head';
import Layout from '../components/layout';
import NewContainer from '../components/newContainer';
import { useState, useEffect, useRef, memo } from 'react'; // Import useState and useEffect if not already imported
import Image from 'next/image';
import NewClosableChip from '../components/new_closable_chip'
import AiChat from '../components/ai_chat';
import recursive_filtering from '../utils/content_filtering'
const recommended_searches = require('../utils/suggested_searches.json')
import { getFormattedDate } from '../utils/date_utils';

export async function getStaticProps() {
  try {
	console.log("joy")
    const home_posts_response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_ACCESS_CMS}/get_all_ready_articles`);
	console.log(home_posts_response)
    if (!home_posts_response.ok) {
      	throw new Error('Failed to connect to cms');
    }

    const home_posts_JSON = await home_posts_response.json();

    if (home_posts_JSON.error.has_error){
      	throw new Error(home_posts_JSON.error.error_message);
    }

    var home_posts_DATA = home_posts_JSON.data;

	var organised_content = {}

	home_posts_DATA.forEach(function(post) {
		var category = post.category || '';
		if (!organised_content[category]) {
			organised_content[category] = [];
		}
		organised_content[category].push(post);
	});
    
	console.log("\n\n\n\n\n", home_posts_DATA)

    return {
		props: {
			home_posts: home_posts_DATA,
			unique_chips: [],
			organised_content: organised_content
		},
      	revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE_TIME_SECS),
    };
  	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			props: {
				home_posts: [],
				unique_chips: [],
				organised_content: {}
			},
			// We revalidate every 10 seconds if there'a a failure. A failure is likely due to CMS being down.
			// When it's up getStaticProps will not fail, and the other revalidate above will apply
			revalidate: 10,
		};
  	}

}

export default function Home({home_posts, unique_chips, organised_content, setBackgroundColour, backgroundColour}) {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [pageTitle, setPageTitle] = useState("ALL ENTRIES")
  const [userText, setUserText] = useState("")
  const [userTextBackup, setUserTextBackup] = useState(userText)
  const [filterPosts, setFilterPosts] = useState(home_posts)
  const [filter_name, set_filter_name] = useState("all content")
  const [sort_by, set_sort_by] = useState("date")
  const [sort_by_clicked, set_sort_by_clicked] = useState(false)
  const [categorised_content, set_categorised_content] = useState(organised_content)

  const [expand, set_expand] = useState(false)
  const [rounded_corners, set_rounded_corners] = useState(!expand)

  const [bottomSearchBox, setBottomSearchBox] = useState(false);
  const bottomSearchBoxRef = useRef(null);

	const add_chip_to_filter = (inText) => {

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

	const filter_Posts = (filter) => {
		const qweqwe = recursive_filtering(home_posts, home_posts, filter)
		setFilterPosts(qweqwe)
		let organised_content = {}
		qweqwe.forEach(function(post) {
			var category = post.category || '';
			if (!organised_content[category]) {
				organised_content[category] = [];
			}
			organised_content[category].push(post);
		});
		set_categorised_content(organised_content)
	}


	useEffect(() => {
        if (userText!="") setUserTextBackup(userText)
    }, [userText]);


	useEffect(() => {
		setBackgroundColour("DarkGreyBackgroundColour")

		const bottomSearchBoxObserver = new IntersectionObserver(
			([entry]) => {
				setBottomSearchBox(!entry.isIntersecting)
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

	return (
		<Layout backgroundColour={backgroundColour}>
		<Head>
			<title>{"HG97 2.0"}</title>
		</Head>
		<section className='flex flex-col items-center h-screen w-screen'>

		<div className="h-screen flex items-center justify-center" onClick={()=>{set_expand(!expand); setTimeout(()=>{set_rounded_corners(!rounded_corners)}, !rounded_corners ? 0 : 1500)}}>
			<div className={`relative ease-in-out transition-all duration-[1500ms] overflow-hidden rounded-xl
				${expand ? 'h-96 w-96 rounded-none' : 'h-4 w-4 rounded-xl'} ${rounded_corners ? 'rounded-xl' : 'rounded-xl'}`}>
				<div className="absolute top-0 left-0 h-screen w-screen">
				<Image
					className="object-cover absolute top-0 left-0"
					fill
					src="https://i.ds.at/8iETrw/rs:fill:750:0/plain/2021/12/27/Eheymb5XYAA-839.jpg"
				/>
				</div>
			</div>
		</div>




			{/* {filter_name != "all content" && <div className='flex justify-center items-center z-50 mt-4 fixed w-full max-w-7xl'>
				<div className='bg-dr-600 px-4 rounded-full flex items-center mx-4'>
					<Image className='h-3 w-3 mr-2 cursor-pointer' src="/images/error_new.png" width={10} height={10} onClick={() => {setFilterPosts(home_posts); set_categorised_content(organised_content); set_filter_name("all content")}}></Image>
					<span className='translate-y-0.5'>{filter_name}</span>
				</div>
			</div>} */}


			{/** SECTION 1 */}
			{/* <div className={`section-1 h-screen w-full flex flex-col items-center overflow-visible max-h-screen`}>
				
				<div className='header-container md:mt-20 mt-8 text-center mx-8 flex flex-col items-center'>
					<h1 className='header font-extrabold text-5xl text-neutral-100'>{ selectedKeywords.length > 0 ? pageTitle.toUpperCase() : "Hayden's portfolio" }</h1>
					<p className='description font-normal text-sm my-4 max-w-96 text-neutral-100'>{ selectedKeywords.length > 0 ? pageTitle.toUpperCase() : "This site contains reviews of code projects, short stories, non-fiction articles and more, all created by me, Hayden" }</p>
				</div>

				<div  ref={bottomSearchBoxRef} className='w-full h-full flex justify-center'>
					<div className={
						bottomSearchBox ? `fixed -bottom-60 z-50 -translate-y-64 transition-transform duration-500 max-w-prose px-4 w-full`
										: `AIChat-container h-full w-full max-w-prose justify-center flex items-end pb-40 md:pb-0 px-4` }>
						<AiChat
							show_suggestions={bottomSearchBox}
							set_filter_name={set_filter_name}
							landing_page_mode={!bottomSearchBox} // '!' because he search box not at the bottom means we're on the landing page
							recursive_filtering={filter_Posts}
							all_chips={unique_chips}/>
					</div>
				</div>

				<div className='h-0 md:h-full'/>

			</div> */}
{/* 
			<div className='flex items-center justify-center w-full h-full'>
				<div className='rounded-xl bg-clip-content w-44 h-24 overflow-hidden'>
					<Image className="object-cover w-full h-full" src={"http://localhost:3007/images/bc59ce76.png"} width={300} height={300}></Image>

				</div>
			</div> */}

			{/* <div className='DarkGreyBackgroundColour rounded-xl fixed flex self-center bg-clip-content w-4 h-4 overflow-hidden transition-all ease-in-out duration-1000'> */}
				{/** SECTION 2 */}
				{/* <div className='section-2 absolute w-screen h-screen flex flex-col'>

					<div className='header-container md:mt-20 mt-8 text-center mx-8 flex flex-col items-center'>
						<h1 className='header font-extrabold text-5xl text-neutral-100'>{ selectedKeywords.length > 0 ? pageTitle.toUpperCase() : "Hey I'm Hayden" }</h1>
						<p className='description font-normal text-sm my-4 max-w-96 text-neutral-100'>{ selectedKeywords.length > 0 ? pageTitle.toUpperCase() : "This site contains reviews of code projects, short stories, non-fiction articles and more, all created by me, Hayden" }</p>
					</div>

					<div className='w-full flex flex-col items-center mb-4'>
						<p className='text-xs text-neutral-100 opacity-95'>psst... content down here</p>

						<div className='mt-2 bg-dg-300 p-1 rounded-md space-x-2 text-xs h-10 flex justify-center'>
							<button className={`bg-dg-700 py-1 px-2 rounded-full ${sort_by=="category" ? 'bg-dy-500 text-dy-300 border-dashed border-2 border-dy-900' : ''}`} onClick={() => set_sort_by("category")}>category</button>
							<button className={`bg-dg-700 py-1 px-2 rounded-full ${sort_by=="date" ? 'bg-dy-500 text-dy-300 border-dashed border-2 border-dy-900' : ''}`} onClick={() => set_sort_by("date")}>date</button>
						</div>

					</div> */}

					{/** THE ARTICLE CONTAINERS */}
					{/* {filterPosts.length > 0 && <div className={`flex w-full justify-center ${sort_by == "date" ? '' : 'hidden'}`}>
						<div className="grid grid-cols-1 mds:grid-cols-2 mdl:grid-cols-3 gap-4 max-w-fit">
							{filterPosts.map((item, index) => (
							<div key={index} className='m-3 flex flex-col items-center'>
								<NewContainer
								incolour={"dpi"}
								home_post_obj={item}
								add_keywords_to_filter={add_chip_to_filter}
								remove_keyword_from_filer={remove_keywords}
								selectedKeywords={selectedKeywords}/>
							</div>
							))}
						</div>
					</div>}
					
					{filterPosts.length > 0 && <div className={`flex w-full justify-center ${sort_by == "category" ? '' : 'hidden'}`}>
						<div className="w-full">
							{Object.entries(categorised_content).map(([key, value]) => (
								<div className='mt-8'>
									<div className='w-full flex justify-center px-4'>
										<h3 className='w-full text-center max-w-prose text-lg font-semibold'>{`${key || "uncategoriesd"} [${value.length}]`}</h3>
									</div>
									
									<div className='flex overflow-x-scroll'>
										{value.map((item, index) => (
										<div key={index} className='m-3 flex items-center' >
											<NewContainer
											incolour={"dpi"}
											home_post_obj={item}
											add_keywords_to_filter={add_chip_to_filter}
											remove_keyword_from_filer={remove_keywords}
											selectedKeywords={selectedKeywords}/>
										</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>} */}
					
				
				{/** IF THERE ARE NO ARTICLES THEN THIS GIF PLAYS */}
				{/* {filterPosts.length == 0 && 
				<div className='flex justify-center items-center flex-col mt-10'>
					{'I\'ve got nothing for you :\('}
					<Image
					src="/images/empty.gif"
					alt="Description of GIF"
					width={500}
					height={300}
					className="rounded-md shadow-strong-drop"
					/>
				</div>
				}
				
			</div>

		</div> */}

	</section>
    </Layout>
  );
}