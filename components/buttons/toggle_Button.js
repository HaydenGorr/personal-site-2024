import MB_Button from "./MB_Button";

export default function ToggleButton({ given_href="", text="", image_src="", lowercase=false, btnAction = () => {}, colour="bg-transparent", toggled=false}) {

    // return (
    //     <div className="w-fit">
    //         <MB_Button 
    //         given_href={given_href}
    //         text={text}
    //         image_src={image_src}
    //         lowercase={lowercase}
    //         btnAction = {btnAction}
    //         colour={colour}
    //         injected_styles={`${toggled ? 'btn-primary rounded-md MB_clicked shadow-MB_clicked bg-MB_clicked' : 'btn-primary Neo-Brutal-White'}`}/>
    //     </div>
    // )

    const getStyles = () => {
        if (toggled) return `w-fit btn-primary flex bg-MB_clicked shadow-MB_clicked MB_clicked border-2 rounded-md text-black shadow-MB border-black border-2`
        return `w-fit btn-primary flex Neo-Brutal-White`
    }

    return (
        <div className="w-fit"> 
            <MB_Button 
                text={text}
                btnAction = {btnAction}
                injected_styles={getStyles()}/>
        </div>
    )
}
