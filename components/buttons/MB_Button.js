import { useState, useEffect } from "react"
import Image from "next/image";
import Link from "next/link";
export default function MB_Button({ given_href="", text="", image_src="", lowercase=false, btnAction = () => {}, colour="bg-transparent"}) {

    const [btnText, setBtnText] = useState('');

    useEffect(() => {
        setBtnText(lowercase ? text : text.toUpperCase())
    });

    const handleClick = (event) => {
        if (!given_href) {
            event.preventDefault(); // Prevent navigation if href is empty
        }
        btnAction(); // Call additional action if provided
    };

    const getParentElement = (child) => {
        if (given_href[0] == '/' ) return <Link onClick={handleClick} className={`${colour} btn-primary h-10 flex shadow-MB w-fit active:MB_clicked active:shadow-MB_clicked active:bg-MB_clicked`} href={given_href}>{child}</Link>
        else return <a onClick={handleClick} className={`${colour} btn-primary h-10 flex shadow-MB w-fit active:MB_clicked active:shadow-MB_clicked active:bg-MB_clicked`} href={given_href} target='_blank'>{child}</a>
    }

    return (
        getParentElement(
            <>
                {image_src && <Image src={image_src} alt="LinkedIn Logo" className="mr-2" width={20} height={20} />}
                <span className="my-auto leading-none font-medium">{btnText}</span>
            </>
        )
    )
}
