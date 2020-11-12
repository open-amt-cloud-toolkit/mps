## Localize the strings

- Create a directory under **public/locales** with the directory name as per the [language](https://developers.google.com/admin-sdk/directory/v1/languages) 
 - Add the translation.json to **public/locales/en/translation.json** file under the new language directory. 
 - Customize the required field in the translation.json file. 
 - **Example**: To support for Kannada language, 
		 - Add the directory  **kn** to **public/locales**. 
		 - Copy the translation.json file from **public/locales/en**  to **public/locales/kn** 
		 - Update the **public/locales/kn/translation.json** file as per kanada langauage 
 - Modify the **/i18n.ts** file to import the newly added **public/locales/Language/translation.json** file and
   update the 'const resources' to include the new file. 
 - **Example** : To support for Kannada language modified **/i18n.ts** as below.
```
	import translationKN from './public/locales/kn/translation.json';
	const resources = {
	  en: {
		translations: translationEN
	  },
	  kn: {
		translations: translationKN
	  }
	};
```

Note: Rebuild and generate a new bundle before testing the changes.

Language can be changed in the browser under langauage section of the browser settings. English is the default if no customized translation file provided for the langauage.

## Get the localised strings for the web consoles with localization enabled.

if users web console is already enabled with localization please make sure to add the translations located in `public/locales/en/translation.json` of UI-controls into your web consoles translations file.
