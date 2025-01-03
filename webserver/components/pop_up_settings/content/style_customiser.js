import { colour_array, updateThemeColor, getPrimaryColour } from '../../../utils/colour';
import Cookies from 'js-cookie'

export default function StyleCustomiser({ setBackgroundColour, setFontUsed }) {

    const change_background_style_callback = async (colour) => {
        Cookies.set('backgroundColour', colour)
        setBackgroundColour(colour)
        updateThemeColor(getPrimaryColour(colour))
    }

    const setFontCallback = (font) => {
        setFontUsed(font); 
        Cookies.set('user_font', font);
    }

    return (
        <div className={`w-fit px-8 py-4`}>
            <div className={`flex w-72 flex-col transition-opacity duration-300`}>
                <div className='flex flex-col h-full w-full space-y-8'>
                    <div className="flex flex-col">
                        <div className="flex justify-between min-w-fit line-clamp-1 space-x-4 overflow-visible">
                            <div className={`h-5 font-Josefin font-medium text-xl cursor-pointer translate-y-0.5`} onClick={() => {setFontCallback("font-Josefin")}}>Sans-Serif</div>
                            <div className={`h-5 font-serif font-medium text-xl cursor-pointer`} onClick={() => {setFontCallback("font-serif")}}>Serif</div>
                            <div className={`h-5 font-dys font-medium text-xl cursor-pointer`} onClick={() => {setFontCallback("font-dys")}}>Dyslexic</div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            {colour_array.map((CSScolour, index) => {
                                return <div key={index} className={`h-10 w-10 rounded-md ${CSScolour} cursor-pointer`} onClick={() => {change_background_style_callback(CSScolour)}}/>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

  }