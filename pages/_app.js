import Head from 'next/head';
import '../styles/global.css';

export default function MyApp({ Component, pageProps }) {
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