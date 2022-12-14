/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
import locale from 'locale';

const supportedLanguages = new locale.Locales(['en', 'es', 'de']);
const languages = {
	en: require('../../shared/locales/en').default as any,
};

const getLangFile = (header: string | undefined, category: string, page: string) => {
	const locales = new locale.Locales(header);
	const langCode: string = locales.best(supportedLanguages).code;

	// @ts-ignore
	const langFile: any = languages[langCode][category][page];
	return langFile;
};

const copyToClipboard = (window: any, document: any, text: string) => {
	if (window.clipboardData && window.clipboardData.setData) {
		return window.clipboardData.setData("Text", text);

	}
	else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
		const textarea = document.createElement("textarea");
		textarea.textContent = text;
		textarea.style.position = "fixed";
		document.body.appendChild(textarea);
		textarea.select();
		
		try {
			return document.execCommand("copy");
		}
		catch (ex) {
			console.warn("Copy to clipboard failed.", ex);
			return prompt("Copy to clipboard: Ctrl+C, Enter", text);
		}
		finally {
			document.body.removeChild(textarea);
		}
	}
}

export { getLangFile, copyToClipboard };
