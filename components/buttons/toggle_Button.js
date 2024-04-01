import MB_Button from "./MB_Button";

export default function ToggleButton({ given_href="", text="", image_src="", lowercase=false, btnAction = () => {}, colour="bg-transparent", toggled=false}) {

    const getStyles = () => {
        if (toggled) return `w-fit btn-primary flex bg-MB_clicked shadow-MB_clicked MB_clicked border-2 rounded-md text-black shadow-MB border-black border-2`
        return `w-fit btn-primary flex Neo-Brutal-White`
    }

    return (
        <div className="w-fit"> 
            <MB_Button 
                text={text}
                given_href={given_href}
                image_src={image_src}
                lowercase={lowercase}
                btnAction = {btnAction}
                injected_styles={getStyles()}/>
        </div>
    )
    
}
