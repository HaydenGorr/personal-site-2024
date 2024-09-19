import { useState } from "react"
import Container from "../container"
import Image from "next/image";

export default function EditArticleModal({refreshArticles, closeModalCallback, inID, home_post_obj=null}) {

    const [databaseID, setID] = useState(home_post_obj._id)
    const [title, setTitle] = useState(home_post_obj.title)
    const [desc, setDesc] = useState(home_post_obj.desc)
    const [infoText, setInfoText] = useState(home_post_obj.infoText)
    const [chips, setChips] = useState(home_post_obj.chips) // This is just the chip names, no description included
    const [source, setSource] = useState(home_post_obj.source)
    const [views, setViews] = useState(home_post_obj.views)
    const [publishDate, setPublishDate] = useState(new Date(home_post_obj.publishDate))
    const [ready, setReady] = useState(home_post_obj.ready)
    const [portfolioReady, setPortfolioReady] = useState(home_post_obj.portfolioReady)
    const [portfolioType, setPortfolioType] = useState(home_post_obj.type)
    const [image, setImage] = useState(null)
    const [articleFile, setArticleFile] = useState(null)
    const [bestArticleFile, setBestArticleFile] = useState(null)

    const reset = () => {
        setTitle(home_post_obj.title)
        setDesc(home_post_obj.desc)
        setInfoText(home_post_obj.infoText)
        setChips(home_post_obj.chips)
        setSource(home_post_obj.source)
        setViews(home_post_obj.views)
        setPublishDate(new Date(home_post_obj.publishDate))
        setReady(home_post_obj.ready)
        setPortfolioReady(home_post_obj.portfolioReady)
        setPortfolioType(home_post_obj.type)
        setImage(null)
        setArticleFile(null)
        setBestArticleFile(null)
        set_in_edit(false)
    }

    const updateTitleBox = (event) => {
        setTitle(event.target.value);
    };

    const updateDescBox = (event) => {
        setDesc(event.target.value);
    };

    const updateSourceBox = (event) => {
        setSource(event.target.value);
    };

    const updateViewsBox = (event) => {
        setViews(event.target.value);
    };

    const updateTypeBox = (event) => {
        setPortfolioType(event.target.value);
    };

    // Add or remove chips from the article
    const adjustChips = (chipText) => {
        if (chips.includes(chipText)) {
            setChips(chips.filter(keyword => keyword !== chipText));
        }
        else {
            setChips([...chips, chipText])
        }
    };

    /**
     * Delete an article from the DB
     */
    const delete_article = async () => {
        const formData = new FormData();
        formData.append('databaseID', databaseID);
        formData.append('source', source);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/delete_article`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ databaseID: databaseID, source: source }),
                credentials: 'include'
            });

            if (response.ok) {
                console.log('Chip uploaded successfully');
            } else {
                console.error('Error uploading chip');
            }
        } catch (error) {
            console.error('Error uploading chip', error);
        }
    };

    const commit_changes_to_server = async () => {
        
        const formData = new FormData();

        formData.append('databaseID', databaseID);
        formData.append('title', title);
        formData.append('desc', desc);
        formData.append('infoText', infoText);
        chips.forEach(chip => {
            formData.append('chips[]', chip);
        });
        formData.append('source', source);
        formData.append('views', views);
        formData.append('type', portfolioType);
        formData.append('publishDate', publishDate);
        formData.append('ready', ready);
        formData.append('image', image);
        formData.append('mdx', articleFile);
        formData.append('best_mdx', bestArticleFile);
        formData.append('portfolioReady', portfolioReady);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/update_article`, {
              method: 'POST',
              body: formData,
              credentials: 'include'
            });
        
            if (response.ok) {
              // Handle successful response
              console.log('Chip uploaded successfully');
            } else {
              // Handle error response
              console.error('Error uploading chip');
            }

            await get_chips();

            refreshCallback()
        } catch (error) {
            console.error('Error uploading chip', error);
        }
    };

    return (
        <div className="flex flex-col overflow-scroll pr-1">
            <Image 
                className="mx-auto rounded-md"
                src={`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/CMS/articles/${home_post_obj["source"]}/container.png`}
                width={300}
                height={300}/>

            {/** Title */}
            <div className="flex flex-col mt-5">
                <p className="font-medium w-full text-center">Title</p>
                <input
                    className="Neo-Brutal w-full p-3 shadow-MB border-white border-2 focus:outline-none focus:rounded-none w-96"
                    type="text"
                    value={title}
                    onChange={updateTitleBox}
                />     
            </div>

            {/** Description */}
            <div className="flex flex-col mt-6">
                <p className="font-medium w-full text-center">Description</p>
                <textarea
                    className="Neo-Brutal w-full p-3 text-wrap shadow-MB border-white border-2 focus:outline-none focus:rounded-none line"
                    rows="4"
                    type="text"
                    value={desc}
                    onChange={updateDescBox}
                />         
            </div>
            
            <div className="">
                {/** Source box */}
                <div className="flex flex-col mt-6">
                    <p className="font-medium w-full text-center">Source</p>
                    <input
                        className="Neo-Brutal w-full p-3 text-wrap shadow-MB border-white border-2 focus:outline-none focus:rounded-none"
                        type="text"
                        value={source}
                        onChange={updateSourceBox}
                    />     
                </div>

                {/** Source box */}
            </div>

            {/* <Container override={true} chips={chips} home_post_obj={home_post_obj} btnAction={()=>{}} colour={"bg-transparent"} add_keywords_to_filter={()=>{}} selectedKeywords={[]} remove_keyword_from_filer={()=>{}}></Container> */}
            
        </div>
    )
}