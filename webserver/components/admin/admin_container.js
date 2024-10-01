import Container from "../container";
import AdminSetting from "./admin_setting";
import { useState } from "react";
import MB_Button from "../MB_Button";
import { ResponsiveMasonry } from "react-responsive-masonry";
import Masonry from "react-responsive-masonry";
import DatePicker from "react-datepicker";
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import ClosableChip from "../closable_chip";
import SuggestionTextBox from "../suggestion_text_box";
import { Checkbox } from "@headlessui/react"

export default function AdminContainer({ home_post_obj, btnAction = () => {}, colour="bg-transparent", add_keywords_to_filter, selectedKeywords, remove_keyword_from_filer, all_chips, refreshArticlesCallback={}}) {

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


    const [in_edit, set_in_edit] = useState(false)
    const [isChecked, setIsChecked] = useState(home_post_obj.ready)


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
        <div className={`mb-10 ${!ready ? "opacity-40" : ""}`}>
            <div className="flex justify-center mx-3 ">
                <div flex className="flex-col Neo-Brutal-White px-3 pb-3 h-auto flex shadow-MB w-fit container-max-width">
                    <Container override={true} chips={chips} home_post_obj={home_post_obj} btnAction={btnAction} colour={colour} add_keywords_to_filter={add_keywords_to_filter} selectedKeywords={selectedKeywords} remove_keyword_from_filer={remove_keyword_from_filer}></Container>
                
                   {in_edit && <div className="w-100%">
                        <div className="mt-6 mb-3 h-10 max-w-prose mx-auto">
                            <SuggestionTextBox 
                                aiSearching={false}
                                filter_keywords={() => {}}
                                add_to_keywords={adjustChips}
                                chipsText={all_chips}
                                selectedChips_text={chips}
                                defaultText={"add and remove chips"}
                                page_title_callback={()=>{}}/>
                        </div>
                    </div>}

                    <div class="bg-gray-300 h-px mt-4"/>

                    <div className="mt-3 self-center flex space-x-3">
                        <MB_Button
                            text= {in_edit ? "save" : "edit"}
                            btnAction={async () => { 
                                if (in_edit) {
                                    await commit_changes_to_server();
                                    await refreshArticlesCallback()
                                }
                                set_in_edit(!in_edit)
                            }}
                        />
                        {in_edit && <MB_Button
                            text= {"cancel"}
                            btnAction={() => reset()}
                        />}
                    </div>

                    { in_edit && <div className="flex flex-col mt-3 space-y-2">
                        <AdminSetting title={"published"}>
                            <div className=""> 
                                <Checkbox className="data-[checked]:bg-blue-500"></Checkbox>
                                <input 
                                    type="checkbox"
                                    id="myCheckbox"
                                    className="flex form-checkbox h-5 w-5 text-blue-600"
                                    checked={ready}
                                    onChange={() => setReady(!ready)}/>
                            </div>
                        </AdminSetting>

                        <AdminSetting title={"Portfolio"}>
                            <div className=""> 
                                <input 
                                    type="checkbox"
                                    id="myPortfolioCheckbox"
                                    className="flex form-checkbox h-5 w-5 text-blue-600"
                                    checked={portfolioReady}
                                    onChange={() => setPortfolioReady(!portfolioReady)}/>
                            </div>
                        </AdminSetting>

                        <div className="">
                            Container Image
                            <input
                                type="file"
                                id="image"
                                accept=".png"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="Neo-Brutal w-full p-3 shadow-MB border-white border-2 focus:outline-none focus:rounded-none"
                            />      
                        </div>

                        <div className="">
                            Article file
                            <input
                                type="file"
                                id="file1"
                                accept=".mdx"
                                onChange={(e) => setArticleFile(e.target.files[0])}
                                className="Neo-Brutal w-full p-3 shadow-MB border-white border-2 focus:outline-none focus:rounded-none"
                            />      
                        </div>

                        {portfolioReady && <div className="">
                            Best bit?
                            <input
                                type="file"
                                id="file2"
                                accept=".mdx"
                                onChange={(e) => setBestArticleFile(e.target.files[0])}
                                className="Neo-Brutal w-full p-3 shadow-MB border-white border-2 focus:outline-none focus:rounded-none"
                            />      
                        </div>}

                        <div className="">
                            Title
                            <input
                                className="Neo-Brutal w-full p-3 shadow-MB border-white border-2 focus:outline-none focus:rounded-none"
                                type="text"
                                value={title}
                                onChange={updateTitleBox}
                            />         
                        </div>

                        <div className="">
                            Description
                            <input
                                className="Neo-Brutal w-full p-3 text-wrap shadow-MB border-white border-2 focus:outline-none focus:rounded-none"
                                type="text"
                                value={desc}
                                onChange={updateDescBox}
                            />         
                        </div>

                        <div className="">
                            Source
                            <input
                                className="Neo-Brutal w-full p-3 text-wrap shadow-MB border-white border-2 focus:outline-none focus:rounded-none"
                                type="text"
                                value={source}
                                onChange={updateSourceBox}
                            />         
                        </div>

                        <div className="">
                            Views
                            <input
                                className="Neo-Brutal w-full p-3 text-wrap shadow-MB border-white border-2 focus:outline-none focus:rounded-none"
                                type="text"
                                value={views}
                                onChange={updateViewsBox}
                            />         
                        </div>

                        {portfolioReady && <div className="">
                            type
                            <input
                                className="Neo-Brutal w-full p-3 text-wrap shadow-MB border-white border-2 focus:outline-none focus:rounded-none"
                                type="text"
                                value={portfolioType}
                                onChange={updateTypeBox}
                            />         
                        </div>}

                        <div className="">
                            Publish Date
                            <DayPicker
                                className="Neo-Brutal p-3 w-full shadow-MB border-white border-2 focus:outline-none focus:rounded-none w-full"
                                mode="single"
                                selected={publishDate}
                                onSelect={setPublishDate}
                                footer={"pick a day"}/>
                        </div>
                        

                        <div className="">
                            <MB_Button text="delete article" btnAction={async () => {await delete_article(); refreshArticlesCallback();}}>

                            </MB_Button>
                        </div>


                    </div>}
                
                </div>
            
            </div>
        </div>
    );

  }