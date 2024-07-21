import { useState, useEffect } from "react"
import Image from "next/image";
import Link from "next/link";

export default function MB_Button({ given_href="", text="", image_src="", lowercase=false, btnAction = () => {}, colour="bg-transparent", injected_styles="", additional_styles="", from_cms=false, type="button" }) {

    const [btnText, setBtnText] = useState('');

    const getFavicon = !image_src && given_href.startsWith('https://')

    const [faviconUrl, setFaviconUrl] = useState(getFavicon ||  !image_src ? "/images/svgs/link_icon.svg" : image_src );

    useEffect(() => {
        setBtnText(lowercase ? text : text.toUpperCase())

        const fetchFavicon = async () => {
            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/favicon?href=${encodeURIComponent(given_href)}`);
              const data = await res.json();
              if (data.faviconUrl) setFaviconUrl(data.faviconUrl);
            } catch (e) {
              console.log(e);
            }
        };
      
        if (getFavicon) fetchFavicon();
    });

    const handleClick = (event) => {
        if (given_href== "") {
            event.preventDefault();
        }
        btnAction();
    };

    const getStyles = () => {
        if (injected_styles) return injected_styles;
        else return `${colour} w-fit btn-primary flex Neo-Brutal-White active:MB_clicked active:shadow-MB_clicked active:bg-MB_clicked ` + additional_styles
    }

    const getParentElement = (child) => {
        
        if (given_href == "") { 
            return <button type={type} onClick={handleClick} className={getStyles()}>{child}</button> 
        }

        else if (given_href.startsWith('/')) return <Link onClick={handleClick} className={getStyles()} href={given_href}>{child}</Link>
        else return <a onClick={handleClick} className={getStyles() + " no-underline"} href={given_href} target='_blank'>{child}</a>
    }

    return (
        getParentElement(
            < >
                <div className="flex items-center justify-center">
                    {(getFavicon || image_src) && <Image
                        src={faviconUrl}
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
