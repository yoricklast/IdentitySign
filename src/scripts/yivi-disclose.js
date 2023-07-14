import { getDevMode, devLog, getDefaultYiviUrl } from "../scripts/util";

export const DISCLOSE_ADDRESS = [
  "irma-demo.gemeente.address.street",
  "irma-demo.gemeente.address.houseNumber",
  "irma-demo.gemeente.address.zipcode",
  "irma-demo.gemeente.address.city",
];
export const DISCLOSE_FULL_NAME = ["irma-demo.gemeente.personalData.fullname"];
export const DISCLOSE_EMAIL = ["irma-demo.sidn-pbdf.email.email"];

/**
 * Disclose attributes using Yivi.
 * @param sessionBody Message body containing the attributes used for disclosure.
 * @returns Disclosed attributes.
 */
export async function disclose(attributes) {
  let yiviUrl = null;
  const devmode = getDevMode();

  // Try to get Yivi URL from localStorage of, if not found, from the default settings.
  const localstorageYiviUrl = localStorage.getItem("yiviUrl");
  if (localstorageYiviUrl != null && localstorageYiviUrl != "") {
    yiviUrl = localstorageYiviUrl;
    devLog(`Loaded yivi URL "${yiviUrl}" from localStorage.`);
  } else {
    await getDefaultYiviUrl().then((result) => {
      const defaultUrl = result;
      if (defaultUrl != null) {
        yiviUrl = defaultUrl;
        devLog(`Loaded Yivi URL "${yiviUrl}" from default settings.`);
      }
    });
  }

  return new Promise((resolve) => {
    if (yiviUrl != null) {
      setTimeout(() => {
        // eslint-disable-next-line
        const web = yivi.newWeb({
          debugging: devmode,
          element: "#yivi-web-form",
          language: "en",

          session: {
            url: yiviUrl,
            start: {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                "@context": "https://irma.app/ld/request/disclosure/v2",
                disclose: [[attributes]],
              }),
            },
          },
        });

        web
          .start()
          .then((result) => {
            const resultToResolve = result.disclosed[0];
            if (devmode) {
              console.log("Disclosure successful!", result);
            } else {
              console.log("Disclosure successful!");
            }
            resolve(resultToResolve);
          })
          .catch((error) => console.error("Dislose unsuccessful.", error));
      }, 100);
    } else {
      alert("Yivi URL not set! Please configure this in setup first!");
      resolve(null);
    }
  });
}

/**
 * Disclose attributes using Yivi.
 * @param sessionBody Message body containing the attributes used for disclosure.
 * @returns Disclosed attributes.
 */
export async function disclosePopup(attributes) {
  let yiviUrl = null;
  const devmode = getDevMode();

  // Try to get Yivi URL from localStorage of, if not found, from the default settings.
  const localstorageYiviUrl = localStorage.getItem("yiviUrl");
  if (localstorageYiviUrl != null && localstorageYiviUrl != "") {
    yiviUrl = localstorageYiviUrl;
    devLog(`Loaded yivi URL "${yiviUrl}" from localStorage.`);
  } else {
    await getDefaultYiviUrl().then((result) => {
      const defaultUrl = result;
      if (defaultUrl != null) {
        yiviUrl = defaultUrl;
        devLog(`Loaded Yivi URL "${yiviUrl}" from default settings.`);
      }
    });
  }

  return new Promise((resolve) => {
    if (yiviUrl != null) {
      setTimeout(() => {
        // eslint-disable-next-line
        const popup = yivi.newPopup({
          debugging: devmode,
          language: "en",

          session: {
            url: yiviUrl,
            start: {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                "@context": "https://irma.app/ld/request/disclosure/v2",
                disclose: [[attributes]],
              }),
            },
          },
        });

        popup
          .start()
          .then((result) => {
            const resultToResolve = result.disclosed[0];
            if (devmode) {
              console.log("Disclosure successful!", result);
            } else {
              console.log("Disclosure successful!");
            }
            resolve(resultToResolve);
          })
          .catch((error) => console.error("Dislose unsuccessful.", error));
      }, 100);
    } else {
      alert("Yivi URL not set! Please configure this in setup first!");
      resolve(null);
    }
  });
}
