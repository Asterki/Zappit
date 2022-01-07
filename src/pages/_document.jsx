import Document, { Html, Head, Main, NextScript } from 'next/document';

class MainDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head>
                    {/* General tags */}
                    <meta name="language" content="English" />
                    <meta name="title" content="Zappit" />
                    <meta name="description" content="// !! Change this description later" />
                    <meta
                        name="keywords"
                        content="// !! add more tags social, posting, sharing, accounts, texting, secure"
                    />
                    <meta name="author" content="Asterki" />

                    {/* Bots */}
                    <meta name="rating" content="general" />
                    <meta name="robots" content="index, follow" />
                    <meta name="revisit-after" content="3 days" />
                    <meta name="distribution" content="global" />

                    {/* OG  */}
                    <meta property="og:title" content="Zappit" />
                    <meta property="og:site_name" content="Zappit" />
                    <meta property="og:url" content="https://zappit.gg" />
                    <meta property="og:description" content="//!! Change this description later" />
                    <meta property="og:type" content="website" />
                    <meta property="og:image" content="/assets/images/icon.png" />

                    {/* Browsers */}
                    <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=7" />
                    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                    <meta name="HandheldFriendly" content="true" />
                    <meta name="MobileOptimized" content="320" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <body>
                    <noscript>You need to enable JavaScript to run this app.</noscript>

                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MainDocument;
