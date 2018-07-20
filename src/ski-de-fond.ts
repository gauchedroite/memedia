
import { computeSunrise, formatMMSS } from "./soleil";
import { ILocation, getLocation } from "./data"

export interface ISkiData {
    updated: string
    wax: string
    p8: string
    snow24: string
    comments: string
    weekSun: string
}

export const fetchSdf = (locid: string) => {
    return new Promise<ISkiData>(function (resolve, reject) {
        let location = getLocation(locid)
        let sdf = <ISkiData>{}
        sdf.weekSun = formatMMSS(computeSunrise(new Date(), location.latitude, location.longitude).semaine)
        resolve(sdf)
    });
/*
    if (localStorage.getItem("sdf") == null) {
        return window.fetch(`https://services2.arcgis.com/WLyMuW006nKOfa5Z/arcgis/rest/services/GP_CROSS_COUNTRY_SKI_INFO_PUBLIC/FeatureServer/0/query?where=1%3D1&returnGeometry=false&outFields=*&f=pgeojson`)
        .then(res => res.json())
        .then((sdf: ISkiData) => {
            sdf.weekSun = "+42:42"
            localStorage.setItem("sdf", JSON.stringify(sdf))
            return sdf
        });
    } else {
        return new Promise<ISkiData>(function (resolve, reject) {
            let sdf = <ISkiData>JSON.parse(localStorage.getItem("sdf"))
            resolve(sdf)
        });
    }
    */
};
