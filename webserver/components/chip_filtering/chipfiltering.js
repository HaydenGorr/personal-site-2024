import { useState } from 'react';
import ClosableChip from '../closable_chip';
import ToggleButton from '../toggle_button';

export default function ChipFiltering({selectedKeywords, remove_keywords, setMatchAnyChip, matchAnyChip}) {
    
    return (
        <div className={``}>
            {selectedKeywords.length > 0 && (
            <div className="mx-3">

                <div className=" h-px prose mx-auto" />

                <div className="flex flex-wrap justify-center">
                    {selectedKeywords.map((item, index) => (
                        <div className="mr-3 mt-3"> 
                        <ClosableChip key={index} chip_text={item} remove_keywords={remove_keywords} svg_path={"images/svgs/cancel.svg"} />
                        </div>
                    ))}
                </div>

                <div className='flex justify-center items-center mt-6'>

                <div className='m3-1'>
                    {"match"}
                </div>

                <div className='mx-1 w-fit over'>
                    <ToggleButton text={"any"} lowercase="true" btnAction={() => {setMatchAnyChip(true)}} toggled={matchAnyChip==true}/>
                </div>

                <div className='mx-1'>
                    <ToggleButton text={"all"} lowercase="true" btnAction={() => {setMatchAnyChip(false)}} toggled={matchAnyChip==false}/>
                </div>

                <ChipFiltering selectedKeywords={selectedKeywords}/>

                <div className='ml-1'>
                    {"of the tags"}
                </div>
                
                </div>
            </div>
            )}

        </div>
    );

}