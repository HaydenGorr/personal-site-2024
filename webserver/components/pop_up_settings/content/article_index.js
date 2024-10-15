import { useEffect, useState } from 'react';
import { colour_array, updateThemeColor } from '../../../utils/colour';
import Cookies from 'js-cookie'

export default function ArticleIndex({ headers, scrollToTextCallback }) {

    const [highlight, set_highlight] = useState(null)



    useEffect(() => {
		console.log(headers)
	}, []);

    return (
        <div className={`flex flex-col justify-between transition-opacity duration-300 space-y-2 overflow-y-scroll p-4 w-32`}>
            {headers.map((val, index) => {
                return(
                    <div className={`rounded-md cursor-pointer ${highlight==index ? 'bg-dg-500' : ''}`} key={index} onMouseOver={() => set_highlight(index)}>
                        <p onClick={()=>{scrollToTextCallback(val.text)}}>{val.text}</p>
                    </div>
                )
            })}
        </div>
    );

  }