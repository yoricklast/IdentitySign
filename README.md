# IdentitySign Prototype

A prototype web application for signing PDF-files using a digital identity wallet ([Yivi](https://www.yivi.app/en/)).

> [!CAUTION]
> This application is a prototype and does **not** create actual cryptographic signatures!

## Requirements

This application relies on NodeJS and NPM being installed. (See NodeJS' [download page](https://nodejs.org/en/download) for installation details)

## How to build/run

Before running the application, install its dependencies using `npm install`. Afterwards, run the application using `npm run dev`.

### Production version

To build a production version of the application, run `npm run build`. You can preview the production version using `npm run preview`.

### Formatting

[Prettier](https://prettier.io/) can be used for code formatting by running `npx prettier --write .` from the project's root directory.

### Linting

[ESLint](https://eslint.org/) can be used for code analysis by running `npx eslint .` from the project's root directory.

_To run code formatting and linting together, you can instead use `npm run format`._

## License

This software is licensed under the [GNU General Public License Version 3](https://www.gnu.org/licenses/gpl-3.0.en.html). See the "LICENSE" file for more information.

## Credit

### Web framework

**Title**: Svelte\
**Author**: [The Svelte Contributors](https://github.com/sveltejs/svelte/graphs/contributors)\
**License**: [MIT](https://github.com/sveltejs/svelte/blob/master/LICENSE.md)\
**Source**: [https://github.com/sveltejs/svelte](https://github.com/sveltejs/svelte)

### Styling

**Title**: Bootstrap\
**Author**: The Bootstrap Authors\
**License**: [MIT](https://github.com/twbs/bootstrap/blob/main/LICENSE)\
**Source**: [https://github.com/twbs/bootstrap](https://github.com/twbs/bootstrap)

### PDF reading

**Title**: PDF.js\
**Author**: Mozilla and individual authors\
**License**: [Apache License 2.0](https://github.com/mozilla/pdf.js/blob/master/LICENSE)\
**Source**: [https://github.com/mozilla/pdf.js/](https://github.com/mozilla/pdf.js/)

### PDF editing

**Title**: PDF-LIB\
**Author**: Andrew Dillon\
**License**: [MIT](https://github.com/Hopding/pdf-lib/blob/master/LICENSE.md)\
**Source**: [https://github.com/Hopding/pdf-lib](https://github.com/Hopding/pdf-lib)

### Yivi

**Title**: Yivi frontend packages\
**Author**: SIDN\
**License**: [Apache License 2.0](https://github.com/privacybydesign/yivi-frontend-packages/blob/master/LICENCE)\
**Source**: [https://github.com/privacybydesign/yivi-frontend-packages](https://github.com/privacybydesign/yivi-frontend-packages)

### Font

**Title**: Open Sans\
**Author**: The Open Sans Project Authors\
**License**: [OFL](https://scripts.sil.org/OFL)\
**Source**: [https://github.com/googlefonts/opensans](https://github.com/googlefonts/opensans)
