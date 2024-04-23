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

export default function AdminContainer({ home_post_obj, btnAction = () => {}, colour="bg-transparent", add_keywords_to_filter, selectedKeywords, remove_keyword_from_filer, all_chips}) {

    const [title, setTitle] = useState(home_post_obj.title)
    const [desc, setDesc] = useState(home_post_obj.desc)
    const [infoText, setInfoText] = useState(home_post_obj.infoText)
    const [chips, setChips] = useState(home_post_obj.chips) // This is just the chip names, no description included
    const [source, setSource] = useState(home_post_obj.source)
    const [views, setViews] = useState(home_post_obj.views)
    const [publishDate, setPublishDate] = useState(new Date(home_post_obj.publishDate))
    const [ready, setReady] = useState(home_post_obj.ready)

    const reset = () => {
        setTitle(home_post_obj.title)
        setDesc(home_post_obj.desc)
        setInfoText(home_post_obj.infoText)
        setChips(home_post_obj.chips)
        setSource(home_post_obj.source)
        setViews(home_post_obj.views)
        setPublishDate(new Date(home_post_obj.publishDate))
        setReady(home_post_obj.ready)

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

    // Add or remove chips from the article
    const adjustChips = (chipText) => {
        if (chips.includes(chipText)) {
            setChips(chips.filter(keyword => keyword !== chipText));
        }
        else {
            setChips([...chips, chipText])
        }
    };


    return (
        <div className="mb-10">
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
                                defaultText={"add and remove chips"}/>
                        </div>
                    </div>}

                    <div class="bg-gray-300 h-px mt-4"/>

                    <div className="mt-3 self-center flex space-x-3">
                        <MB_Button
                            text= {in_edit ? "save" : "edit"}
                            btnAction={() => set_in_edit(!in_edit)}
                        />
                        {in_edit && <MB_Button
                            text= {"cancel"}
                            btnAction={() => reset()}
                        />}
                    </div>

                    { in_edit && <div className="flex flex-col mt-3 space-y-2">
                        <AdminSetting title={"published"}>
                            <div className=""> 
                                <input 
                                    type="checkbox"
                                    id="myCheckbox"
                                    className="flex form-checkbox h-5 w-5 text-blue-600"
                                    checked={ready}
                                    onChange={() => setReady(!ready)}/>
                            </div>
                        </AdminSetting>

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
                            Publish Date
                            <DayPicker
                                className="Neo-Brutal p-3 w-full shadow-MB border-white border-2 focus:outline-none focus:rounded-none w-full"
                                mode="single"
                                selected={publishDate}
                                onSelect={setPublishDate}
                                footer={"pick a day"}/>
                        </div>




                    </div>}
                
                </div>
            
            </div>
        </div>
    );

  }