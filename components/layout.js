import MB_Button from './buttons/MB_Button.js';
import CVDownloadModal from './download_modal/cvdownload_modal.js';
import { useRouter } from 'next/router';



export default function Layout({ children, home }) {
  const { pathname } = useRouter();
  const isChatPage = pathname === '/chat'; // Adjust '/chat' as needed for your chat page's path
  const isHomePage = pathname === '/'; // Adjust '/chat' as needed for your chat page's path

  return (
    <div>
      {/** The modal for downloading my cv. hidden by default. Shown on a button click*/}
      <CVDownloadModal></CVDownloadModal>

      <header className='flex flex-col items-center default_colour sticky top-0'>
        <div className="flex justify-between w-full">
        <h1 className='my-auto ml-10 text-xl font-bold hideonmobile'>Hayden</h1>
          <div className='flex justify-center md:justify-end flex-grow my-3'>
            <div className={`${isHomePage ? 'hidden md:block' : ''} mr-4`}>
              <MB_Button text={"HOME"} given_href={"/"} image_src={'/images/svgs/home.svg'}/>
            </div>
            <div className='mr-4'>
              <MB_Button text={"CV"} image_src={'/images/svgs/cv_light.svg'} btnAction={()=>document.getElementById('cv_download_modal').showModal()}/>
            </div>
            <div className='mr-4'>
              <MB_Button text={"LINKDIN"} given_href={"https://www.linkedin.com/in/hayden-gorringe-980753191/"} image_src={'/images/svgs/linkdin.svg'}/>
            </div>
            <div className={`${isChatPage ? 'hidden md:block' : ''} mr-4`}>
              <MB_Button text={"CHAT"} given_href={"/chat"} image_src={'/images/svgs/chat.svg'}/>
            </div>
          </div>
        </div>

        <div className='bg-black w-lvw h-1'/>
        
      </header>

      {/** The black bar at the top of the page. This is used to show a message*/}
      <div class="bg-black w-auto h-9 flex items-center justify-center">
        <p class="text-white text relative bottom-0.5">Hi Emma :)</p>
      </div>

      <main>{children}</main>

    </div>
  );
}