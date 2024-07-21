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

                {/* 
                <button
                    id="dropdownDefaultButton"
                    onClick={() => setShowDropdown(!showDropdown)} 
                    data-dropdown-toggle="dropdown" 
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="button">Dropdown button 
                    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </button>

                <div id="dropdown" class={`absolute z-10 bg-white ${showDropdown ? '' : 'hidden'} divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                    </li>
                    <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                    </li>
                    <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                    </li>
                    <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
                    </li>
                    </ul>
                </div> */}

                    {/* <div className="flex space-x-5">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <p className="my-auto leading-none font-medium no-underline not-prose">Engineering CV</p>
                            <MB_Button image_src="/images/svgs/download_logo.svg" text="pdf" given_href="https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/export?format=pdf"></MB_Button>
                            <MB_Button image_src="/images/svgs/download_logo.svg" text="docx" given_href="https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/export?format=docx"></MB_Button>
                            <MB_Button image_src="/images/svgs/link_icon.svg" text="google drive" given_href="https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/edit?usp=sharing"></MB_Button>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <p className="my-auto leading-none font-medium no-underline not-prose">Writing CV</p>
                            <MB_Button image_src="/images/svgs/download_logo.svg" text="pdf" given_href="https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/export?format=pdf"></MB_Button>
                            <MB_Button image_src="/images/svgs/download_logo.svg" text="docx" given_href="https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/export?format=docx"></MB_Button>
                            <MB_Button image_src="/images/svgs/link_icon.svg" text="google drive" given_href="https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/edit?usp=sharing"></MB_Button>
                        </div>
                    </div> */}

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
