import MB_Button from './MB_Button.js';
import CVDownloadModal from './cvdownload_modal.js';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {getPrimaryColour} from '../utils/colour'

export default function Layout({ children, home, stickyHeader=true, setBackgroundColour, backgroundColour }) {

  const headerText = ["Hayden", "2.5.0"]
  const [headerPtr, setHeaderPtr] = useState(0);

  const incrementHeaderLayers = () => {
    if (headerPtr == 2) {
      setHeaderPtr(0)
      return
    }
    setHeaderPtr(headerPtr+1)
  }


  // Effect to reset the variable after 5 seconds
  useEffect(() => {
    if (headerPtr > 0) {
        const timer = setTimeout(() => {
          setHeaderPtr(0);
        }, 1000);
        return () => clearTimeout(timer);
    }
  }, [headerPtr]);

  return (
    <div className=''>
      {/** The modal for downloading my cv. hidden by default. Shown on a button click*/}
      <CVDownloadModal></CVDownloadModal>

      <header className={`flex flex-col items-center default_colour ${ stickyHeader ? 'sticky' : ''} top-0 z-40 transition-colors duration-500 ${backgroundColour ? backgroundColour : ''}`}>
        
        <div className="flex md:justify-between w-full">
            {headerPtr==2 && <div className="my-auto ml-10 text-xl font-bold hideonmobile"><MB_Button text="login" given_href="/admin/login"></MB_Button></div>}
            {headerPtr<3 && <h1 className='my-auto ml-10 text-xl font-bold hideonmobile' onClick={() => {incrementHeaderLayers()}}>{ headerText[headerPtr] }</h1>}
            <div className='flex p-3 overflow-x-scroll'>
                <div className={`mr-4 min-w-fit`}>
                    <MB_Button text={"HOME"} given_href={"/"} image_src={'/images/svgs/home.svg'}/>
                </div>
                <div className='mr-4 min-w-fit'>
                    <MB_Button text={"CV"} image_src={'/images/svgs/cv_light.svg'} btnAction={()=>document.getElementById('cv_download_modal').showModal()}/>
                </div>
                <div className='mr-4 min-w-fit'>
                    <MB_Button text={"CHAT"} given_href={"/chat"} image_src={'/images/svgs/chat.svg'}/>
                </div>
                <div className='mr-4 min-w-fit'>
                    <MB_Button text={"GITHUB"} given_href={"https://github.com/HaydenGorr/"}/>
                </div>
                <div className='mr-4 min-w-fit'>
                    <MB_Button text={"INSTA"} given_href={"https://www.instagram.com/haydengo_/"} image_src={'/images/svgs/instagram.svg'}/>
                </div>
                <div className={`min-w-fit`}>
                    <MB_Button text={"LINKEDIN"} given_href={"https://www.linkedin.com/in/hayden-gorringe-980753191/"} image_src={'/images/svgs/linkdin.svg'}/>
                </div>
            </div>
        </div>

        <div className='bg-black w-lvw h-1'/>
        
      </header>

      <main className='max-w-7xl mx-auto'>{children}</main>

    </div>
  );
}