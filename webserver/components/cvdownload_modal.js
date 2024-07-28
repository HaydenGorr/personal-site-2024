import MB_Button from "./MB_Button"
import { useState } from "react"
import Dropdown from "./dropdown";

export default function CVDownloadModal({  }) {

    const [showWritingDropdown, setShowWritingDropdown] = useState(false);
    const [showTechDropdown, setShowTechDropdown] = useState(false);

    const handleDropdownOptionClick = (dropdown, option) => {
        let chosenURL = ""
        if (dropdown == "Software Engineering CV") {
            if (option == "pdf") chosenURL = "https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/export?format=pdf"
            if (option == "docx") chosenURL = "https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/export?format=docx"
            if (option == "Google Drive") chosenURL = "https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/edit?usp=sharing"
        }
        else if (dropdown == "Writing CV") {
            if (option == "pdf") chosenURL = "https://docs.google.com/document/d/1Xtxncxk4H4s3rwkkFBic-G8DlOcJOn2dnNYsmCu0jj0/export?format=pdf"
            if (option == "docx") chosenURL = "https://docs.google.com/document/d/1Xtxncxk4H4s3rwkkFBic-G8DlOcJOn2dnNYsmCu0jj0/export?format=docx"
            if (option == "Google Drive") chosenURL = "https://docs.google.com/document/d/1Xtxncxk4H4s3rwkkFBic-G8DlOcJOn2dnNYsmCu0jj0/edit?usp=sharing"
        }

        if (chosenURL == "") return;

        window.open(chosenURL, "_blank"); // Open in a new tab
    }

    return (
        <div>
            <dialog id="cv_download_modal" className="modal modal-bottom sm:modal-middle shadow-MB p-6 Neo-Brutal-White  overflow-visible">
                <div className="modal-box">

                <div className="flex space-x-10">
                    <Dropdown title={"Software Engineering CV"} dropdownOptions={["Google Drive", "docx", "pdf"]} callback={handleDropdownOptionClick}/>
                    <Dropdown title={"Writing CV"} dropdownOptions={["Google Drive", "docx", "pdf"]} callback={handleDropdownOptionClick}/>
                </div>

                    <div className="modal-action flex justify-center mt-6">
                        <form method="dialog">
                            <MB_Button text="close" btnAction={()=>document.getElementById('cv_download_modal').close()}></MB_Button>
                        </form>
                    </div>
                    
                </div>
            </dialog>
        </div>

    )
}
