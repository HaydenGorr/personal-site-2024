import { useState, useEffect } from "react"
import Link from "next/link";
import MB_Button from "./MB_Button";

export default function ToggleButton({ given_href="", text="", image_src="", lowercase=false, btnAction = () => {}, colour="bg-transparent", toggled=false}) {

    return (
        <div>
            <MB_Button 
            given_href={given_href}
            text={text}
            image_src={image_src}
            lowercase={lowercase}
            btnAction = {btnAction}
            colour={colour}
            injected_styles={`${toggled ? 'btn-primary rounded-md MB_clicked shadow-MB_clicked bg-MB_clicked' : 'btn-primary Neo-Brutal-White'}`}/>
        </div>
    )
}
