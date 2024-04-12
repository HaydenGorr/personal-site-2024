import { useState, useEffect } from "react"
import Image from "next/image";
import Link from "next/link";
import path from "path";

export default function MB_Button({ given_href="", text="", image_src="", lowercase=false, btnAction = () => {}, colour="bg-transparent", injected_styles="", from_cms=false}) {

    const [btnText, setBtnText] = useState('');

    const getFavicon = !image_src && given_href.startsWith('https://')

    useEffect(() => {
        setBtnText(lowercase ? text : text.toUpperCase())
    });

    const handleClick = (event) => {
        if (given_href== "") {
            event.preventDefault();
        }
        btnAction();
    };

    const getStyles = () => {
        if (injected_styles) return injected_styles;
        else return `${colour} w-fit btn-primary flex Neo-Brutal-White active:MB_clicked active:shadow-MB_clicked active:bg-MB_clicked`
    }

    const getParentElement = (child) => {
        
        if (given_href == "") { 
            return <button onClick={handleClick} className={getStyles()}>{child}</button> 
        }

        else if (given_href.startsWith('/')) return <Link onClick={handleClick} className={getStyles()} href={given_href}>{child}</Link>
        else return <a onClick={handleClick} className={getStyles() + " no-underline"} href={given_href} target='_blank'>{child}</a>
    }

    const getImageURL = () => {

        console.log("given_href")
        console.log(getFavicon)
        console.log("\n")

        if (getFavicon) {
            const url = new URL(given_href);
            const faviconUrl = `${url.origin}/favicon.ico`;
            return faviconUrl.toString();
        }

        return from_cms ? `${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/${image_src}`: image_src
    }

    return (
        getParentElement(
            < >
                <div className="flex items-center justify-center">
                    {(getFavicon || image_src) && <Image 
                        /**
                         * If from_cms is true the image request is needed for an article (which comes from cms).
                         * in that case, we need to append the User Access CMS link to the image_src
                         */
                        src={getImageURL()}
                        alt="logo"
                        className="mr-2 my-0"
                        width={24}
                        height={24} />}

                    <span className="my-auto leading-none font-medium no-underline not-prose">{btnText}</span>
                </div>
            </>
        )
    )
}
