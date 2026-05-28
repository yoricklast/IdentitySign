# IdentitySign

A prototype web application for signing PDF-files using a digital identity wallet ([Yivi](https://www.yivi.app/en/)).

> [!CAUTION]
> This application is a prototype and has not been audited! In demo-mode, it does **not** create actual cryptographic signatures! Usage beside research/testing purposes is not recommended!

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

## Publications

Read our papers on IdentitySign in [CHI 2024's extended abstracts](https://dl.acm.org/doi/full/10.1145/3613905.3650977) (initial version) and SOUPS 2026 (redesign, link TBD).

## License

This software is licensed under the [GNU General Public License Version 3](https://www.gnu.org/licenses/gpl-3.0.en.html). See the "LICENSE" file for more information.
