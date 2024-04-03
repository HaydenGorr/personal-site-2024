import MB_Button from "./MB_Button";

export default function Special_Button({ given_href="", text="", image_src="", lowercase=false, btnAction = () => {}, colour="bg-transparent", error_wiggle = true}) {

    return (
        <div className={`${error_wiggle ? 'wiggle' : ''}`}>
            <MB_Button given_href={given_href} text={text} image_src={image_src} lowercase={lowercase} btnAction = {btnAction} colour={colour}></MB_Button>
        </div>
    )
}
