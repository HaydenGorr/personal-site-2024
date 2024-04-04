import Head from 'next/head';
import '../styles/global.css';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {

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
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap" rel="stylesheet" />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }