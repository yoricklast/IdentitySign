import { getDevMode, devLog, getDefaultYiviUrl } from "../scripts/util";

export async function issuePopup() {
  let yiviUrl = null;
  const devmode = getDevMode;

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
                "@context": "https://irma.app/ld/request/issuance/v2",
                credentials: [
                  {
                    credential: "irma-demo.gemeente.personalData",
                    attributes: {
                      initials: "R.",
                      firstnames: "Robin",
                      prefix: "",
                      familyname: "Stevens",
                      fullname: "Robin Stevens",
                      gender: "",
                      surname: "Stevens",
                      dateofbirth: "01-01-1990",
                      cityofbirth: "Exampleton",
                      countryofbirth: "",
                      over12: "yes",
                      over16: "yes",
                      over18: "yes",
                      over21: "yes",
                      over65: "no",
                      bsn: "",
                      digidlevel: "",
                    },
                  },
                  {
                    credential: "irma-demo.gemeente.address",
                    attributes: {
                      street: "Main Street",
                      houseNumber: "14",
                      zipcode: "1724 ZT",
                      municipality: "Exampleton",
                      city: "Exampleton",
                    },
                  },
                  {
                    credential: "irma-demo.sidn-pbdf.email",
                    attributes: {
                      email: "robin.stevens@example.com",
                    },
                  },
                ],
              }),
            },
          },
        });

        popup
          .start()
          .then(() => {
            resolve(null);
          })
          .catch((error) => console.error("Issue unsuccessful.", error));
      }, 100);
    } else {
      alert("Yivi URL not set! Please configure this in setup first!");
      resolve(null);
    }
  });
}
