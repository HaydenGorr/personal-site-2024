import Head from 'next/head';
import '../styles/global.css';
import { useEffect, useState } from 'react';

export default function MyApp({ Component, pageProps }) {

  const [backgroundColour, setBackgroundColour] = useState('CreamBackgroundColour');

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
        </Head>
        <div className={`${backgroundColour} h-screen`}>
          <Component {...pageProps} setBackgroundColour={setBackgroundColour} backgroundColour={backgroundColour}/>
        </div>
      </>
    );
  }