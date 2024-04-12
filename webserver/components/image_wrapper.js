import Image from "next/image";

export default function ImageWrapper({ src }) {
    return (
        <div>
            <Image className={"Neo-Brutal-White"} src={`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/${src}`} width={1000} height={1000}/>
        </div>
    )
}
