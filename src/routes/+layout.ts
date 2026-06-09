// Disable server side rendering
export const ssr = false;
export const prerender = true;
export const trailingSlash = "always";

//@ts-ignore
import type { LayoutLoad } from './types';
import { getProductionVersion, getDemoMode } from "../scripts/ts-util";

export const load: LayoutLoad = async () => {
    let productionVersion = localStorage.getItem("productionVersion");
    let demoMode = localStorage.getItem("demoMode");
    let changed = false;
    if (demoMode == null) {
        await getDemoMode().then((result) => {
            if (result != null) {
                demoMode = `${result}`;
                localStorage.setItem("demoMode", demoMode);
                changed = true;
            }
        });
    }
    if (productionVersion == null) {
        await getProductionVersion().then((result) => {
            if (result != null) {
                productionVersion = `${result}`;
                localStorage.setItem("productionVersion", productionVersion);
                changed = true;
            }
        });
    }
    //@ts-ignore
    if (changed == true) {
        console.log("RELOAD")
        window.location.reload();
    }
    return {
        message: "Loading successful!"
    };
};