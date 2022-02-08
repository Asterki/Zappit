import locale from 'locale';

// * Import language files and add them to supported
const supportedLangs: any = {
	supported: ['es', 'en'],
	es: require('../../locales/es.js'),
	en: require('../../locales/en.js'),
};

const getLang = (header: string) => {
	const supported = new locale.Locales(supportedLangs.supported);
	const locales = new locale.Locales(header);
	let bestMatch = locales.best(supported);

	return supportedLangs[bestMatch.language.toString()];
};

export { getLang };
