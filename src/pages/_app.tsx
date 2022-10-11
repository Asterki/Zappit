import Head from "next/head";
import * as React from "react";

import "../styles/globals.scss";
import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
    React.useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/serviceWorker.js")
                .then((reg) => console.log("Registered service worker"))
                .catch((err) => console.log("Failure: ", err));
        }
    }, []);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=1" />
                <meta name="theme-color" content="#6770EF" />

                {/* <!-- Primary Meta Tags --> */}
                <title>Zappit</title>
                <meta name="title" content="Zappit" />
                <meta name="description" content="Lorem ipsum dolor sit amet consectetur adipisicing elit." />
                <link rel="manifest" href="manifest.json" />

                {/* <!-- Open Graph / Facebook --> */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://zappitapp.xyz/" />
                <meta property="og:title" content="Zappit" />
                <meta property="og:description" content="Lorem ipsum dolor sit amet consectetur adipisicing elit." />
                <meta property="og:image" content="/banner.png" />

                {/* <!-- Twitter --> */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://zappitapp.xyz/" />
                <meta property="twitter:title" content="Zappit" />
                <meta property="twitter:description" content="Lorem ipsum dolor sit amet consectetur adipisicing elit." />
                <meta property="twitter:image" content="/banner.png" />
            </Head>
            <Component {...pageProps} />
        </>
    );
};

export default App;
