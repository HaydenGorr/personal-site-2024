import MB_Button from "../buttons/MB_Button"

export default function CVDownloadModal({  }) {
    return (
        <div>
            <dialog id="cv_download_modal" className="modal modal-bottom sm:modal-middle shadow-MB px-10 py-6">
                <div className="modal-box">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <MB_Button image_src="/images/svgs/download_logo.svg" text="pdf" colour="bg-yellow-200" given_href="https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/export?format=pdf"></MB_Button>
                        <MB_Button image_src="/images/svgs/download_logo.svg" text="docx" colour="bg-lime-200" given_href="https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/export?format=docx"></MB_Button>
                        <MB_Button image_src="/images/svgs/link_icon.svg" text="google drive" colour="bg-emerald-200" given_href="https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/edit?usp=sharing"></MB_Button>
                    </div>

                    <div className="h-1 bg-black mt-6 mb-6 mx-6"></div>

                    <div className="modal-action flex justify-center">
                        <form method="dialog">
                            <MB_Button text="close" btnAction={()=>document.getElementById('cv_download_modal').close()}></MB_Button>
                        </form>
                    </div>
                    
                </div>
            </dialog>
        </div>

    )
}
