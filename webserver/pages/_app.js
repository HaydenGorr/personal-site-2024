import Head from 'next/head';
import '../styles/global.css';
import { useEffect, useState } from 'react';
import Blob from '../components/blob'

export default function MyApp({ Component, pageProps }) {

  const [backgroundColour, setBackgroundColour] = useState('DarkGreyBackgroundColour');

  useEffect(() => {
    const handleTabClose = (event) => {
      sessionStorage.clear();
    };
    window.addEventListener('beforeunload', handleTabClose);
    return () => window.removeEventListener('beforeunload', handleTabClose);
  }, []);


    return (
      <>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet"></link>
        </Head>
        <div className={`${backgroundColour} h-full min-h-screen transition-colors ease-in-out duration-500 font-Josefin`}>
          {/* <Blob /> */} {/** Thought wrongly that this would be a cool background effect */}
          <Component {...pageProps} setBackgroundColour={setBackgroundColour} backgroundColour={backgroundColour}/>
        </div>
      </>
    );
  }