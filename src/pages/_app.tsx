/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head';
import * as React from 'react';
import locale from 'locale';

import { store } from '../store';
import { Provider } from 'react-redux';
import { setLanguage } from '../store/pageSlice';
// import { PersistGate } from 'redux-persist/integration/react';
// import { persistStore } from 'redux-persist';
// import { setSessionID, setUser } from '../store/userSlice';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.scss';

import type { AppProps } from 'next/app';
import LangPack from '../../shared/types/lang';

// const persistor = persistStore(store);

const CustomApp = ({ Component, pageProps }: AppProps) => {
	React.useEffect(() => {
		// Start service worker
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/serviceWorker.js')
				.then(() => console.log('Registered service worker'))
				.catch((err) => console.log('Failure: ', err));
		}

		if ('language' in navigator) {
			// Language files
			const languages = {
				en: require('../../shared/locales/en').default as typeof LangPack,
				es: require('../../shared/locales/es').default as typeof LangPack,
			};

			// Get the supported language files and the languages that the browser supports
			const supported = new locale.Locales(
				(process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES as string).split(',')
			);
			const locales = new locale.Locales(navigator.language);

			// Get the language file using the best match, then load it into the state
			const language: string = locales.best(supported).language;
			store.dispatch(setLanguage(languages[language as 'en' | 'es']));
		}
	}, []);

	return (
		<Provider store={store}>
			{/* <PersistGate loading={null} persistor={persistor}> */}
				<Head>
					<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=1' />
					<meta name='theme-color' content='#6770EF' />

					{/* <!-- Primary Meta Tags --> */}
					<title>Zappit</title>
					<meta name='title' content='Zappit' />
					<meta name='description' content='Placeholder description' />
					<link rel='manifest' href='manifest.json' />

					{/* <!-- Open Graph / Facebook --> */}
					<meta property='og:type' content='website' />
					<meta property='og:url' content='https://zappitapp.xyz/' />
					<meta property='og:title' content='Zappit' />
					<meta property='og:description' content='Placeholder description' />
					<meta property='og:image' content='/banner.png' />

					{/* <!-- Twitter --> */}
					<meta property='twitter:card' content='summary_large_image' />
					<meta property='twitter:url' content='https://zappitapp.xyz/' />
					<meta property='twitter:title' content='Zappit' />
					<meta property='twitter:description' content='Placeholder description' />
					<meta property='twitter:image' content='/banner.png' />
				</Head>
				<Component {...pageProps} />
			{/* </PersistGate> */}
		</Provider>
	);
};

export default CustomApp;
