import MB_Button from "../buttons/MB_Button"

export default function CVDownloadModal({  }) {
    return (
        <div>
            <dialog id="cv_download_modal" className="modal modal-bottom sm:modal-middle shadow-MB p-6 Neo-Brutal-White">
                <div className="modal-box">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <MB_Button image_src="/images/svgs/download_logo.svg" text="pdf" given_href="https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/export?format=pdf"></MB_Button>
                        <MB_Button image_src="/images/svgs/download_logo.svg" text="docx" given_href="https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/export?format=docx"></MB_Button>
                        <MB_Button image_src="/images/svgs/link_icon.svg" text="google drive" given_href="https://docs.google.com/document/d/1qjuSGcBqMS6au8LINZyMAJ78tyAIuswAtCYRpwhZrYE/edit?usp=sharing"></MB_Button>
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
