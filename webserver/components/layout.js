import MB_Button from './buttons/MB_Button.js';
import CVDownloadModal from './download_modal/cvdownload_modal.js';
import { useRouter } from 'next/router';



export default function Layout({ children, home }) {

  return (
    <div>
      {/** The modal for downloading my cv. hidden by default. Shown on a button click*/}
      <CVDownloadModal></CVDownloadModal>

      <header className='flex flex-col items-center default_colour sticky top-0 z-40'>
        
        <div className="flex md:justify-between w-full">
            <h1 className='my-auto ml-10 text-xl font-bold hideonmobile'>Hayden</h1>
            <div className='flex p-3 overflow-x-scroll'>
                <div className={`mr-4 min-w-fit`}>
                    <MB_Button text={"HOME"} given_href={"/"} image_src={'/images/svgs/home.svg'}/>
                </div>
                <div className='mr-4 min-w-fit'>
                    <MB_Button text={"CV"} image_src={'/images/svgs/cv_light.svg'} btnAction={()=>document.getElementById('cv_download_modal').showModal()}/>
                </div>
                <div className='mr-4 min-w-fit'>
                    <MB_Button text={"LINKDIN"} given_href={"https://www.linkedin.com/in/hayden-gorringe-980753191/"} image_src={'/images/svgs/linkdin.svg'}/>
                </div>
                <div className={`min-w-fit`}>
                    <MB_Button text={"CHAT"} given_href={"/chat"} image_src={'/images/svgs/chat.svg'}/>
                </div>
            </div>
        </div>

        <div className='divider w-lvw h-1'/>
        
      </header>

      <main className='max-w-7xl mx-auto'>{children}</main>

    </div>
  );
}