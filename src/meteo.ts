
import { ISkiData } from "./ski-de-fond";
import { ILocation, getLocation, getNextLocation } from "./data"

declare const moment: any;

interface ICM {
    code: string
    obs: IOBS
    sterm: ISTerm
    sevendays: ISevendays
    fourteendays: IFourteendays
    daysky: IDaysky
}

interface ISTerm {
    periods: IPeriod[]
}

interface ISevendays {
    periods: ISeven[]
}

interface IFourteendays {
    periods: IFourteen[]
}

interface IDaysky {
    hourly_data: IHourlyData
}

interface IHourlyData {
    days: IDays[]
}

interface IDays {
    day_name: string;
    periods: IDPeriod[]
}

interface IOBS {
    background: string
    image_url: string
    icon: string
    lbl_updatetime: string
    updatetime: string
    updatetime_stamp_gmt: number
    wxc: string
    tc: string
    fc: string
    wk: string
    wu: string
    wd: string
    windDirection_icon: string
    windGustSpeed_knot: number
    wgu: string
    h: string
    sunrise_gmt: number
    sunrise_time: string
    sunset_gmt: number
    sunset_time: string
}

interface IPeriod {
    stdayforcurrent: string
    wxc: string
    t: string
    f: string
    icon: string
    pp: string
    w: string
    wd: string
    wu: string
    wg: string
    wgu: string
    h: string
    rr: string
    ru: string
    sr: string
    su: string
}

interface ISeven {
    sd: string
    itd: string
    ida: string
    tma: string
    f: string
    tm: string
    pdp: string
    metric_rain: string
    metric_snow: string
    w: string
    wu: string
    wd: string
    sun_hrs: string
    tsl: number
}

interface IFourteen {
    sd: string
    icon: string
    tma: string
    tm: string
    pdp: string
    metric_rain: string
    metric_snow: string
}

interface IDPeriod {
    dn: string
    hour: string
    icon: string
    it: string
}


let cm = <ICM>{};
let alerts = {};
let stermid = 1;
let sevenid = 1;
export let locid: string;
let location: ILocation;

export const renderObs = (obs: IOBS, sdf: ISkiData) => {
    const obs_wd = obs.wd?.replace(/\./g, "").replace(/-/g, "") ?? "0"
    return `
<div class="title">Conditions actuelles</div>
<div class="main">
    <div class="location">${location.name}, QC, Canada</div>
    <div class="general">
        <div class="icon">
            <div style="background: url(${obs.image_url}${obs.icon}.png); background-size: cover;">&nbsp;</div>
        </div>
        <div class="temp">${obs.tc}<span>°C</span></div>
        <div class="feel">T. ressentie: ${obs.fc}</div>
        <div class="desc">${obs.wxc}</div>
    </div>
    <div class="detail">
        <div><span class="label">Lever:</span> ${obs.sunrise_time}</div>
        <div><span class="label">Humidité:</span> ${obs.h}%</div>
        <div><span class="label">Coucher:</span> ${obs.sunset_time}</div>
        <div><span class="label">Vents:</span> ${obs_wd} ${obs.wk} ${obs.wu}</div>
        <div><span class="label">Semaine:</span> ${sdf.weekSun}</div>
        <div><span class="label">Rafales:</span> ${Math.round(obs.windGustSpeed_knot * 1.852)} ${obs.wgu}</div>
    </div>
    <div class="updated">
        Émis le: ${moment(+obs.updatetime_stamp_gmt).format("LLL")}
    </div>
    <!--
    <div class="detail">
        <div><span class="label">Cire:</span> ${obs.sunrise_time}</div>
        <div><span class="label">P8:</span> ${obs.h}</div>
    </div>
    <div class="updated">
        Émis le: ${moment(+obs.updatetime_stamp_gmt).format("LLL")}
    </div>
    -->
    <div class="soleil"></div>
</div>
`;
};

export const renderSterm = (sterm: ISTerm) => {
    let per = sterm.periods[stermid - 1];
    let per1 = sterm.periods[0];
    let per2 = sterm.periods[1];
    let per3 = sterm.periods[2];
    let active1 = (stermid == 1 ? "active" : "");
    let active2 = (stermid == 2 ? "active" : "");
    let active3 = (stermid == 3 ? "active" : "");
    const per_wd = per.wd?.replace(/\./g, "").replace(/-/g, "") ?? "0"
    return `
<div class="title">Prévisions à court terme</div>
<div class="main">
    <div class="location">${location.name}, QC, Canada</div>
    <div class="for-date">${per.stdayforcurrent}</div>
    <div class="general">
        <div class="icon">
            <div style="background: url(https://icons.twnmm.com/wx_icons/v2/${per.icon}.png); background-size: cover;">&nbsp;</div>
        </div>
        <div class="temp">${per.t}<span>°C</span></div>
        <div class="feel">T. ressentie: <div>${per.f}</div></div>
        <div class="desc">${per.wxc}</div>
    </div>
    <div class="detail">
        <div><span class="label">P.D.P.:</span> ${per.pp}%</div>
        <div><span class="label">Pluie:</span> ${per.rr} ${per.ru}</div>
        <div><span class="label">Humidité:</span> ${per.h}%</div>
        <div><span class="label">Neige:</span> ${per.sr} ${per.su}</div>
        <div><span class="label">Vents:</span> ${per_wd} ${per.w} ${per.wu}</div>
        <div><span class="label">Rafales:</span> ${per.wg} ${per.wgu}</div>
    </div>
    <div class="data">
        <a href="#/sterm/${locid}/1" class="head ${active1}">${per1.stdayforcurrent.toLowerCase().replace(" ", "<br>")}</a>
        <a href="#/sterm/${locid}/2" class="head ${active2}">${per2.stdayforcurrent.toLowerCase().replace(" ", "<br>")}</a>
        <a href="#/sterm/${locid}/3" class="head ${active3} last">${per3.stdayforcurrent.toLowerCase().replace(" ", "<br>")}</a>
        <a href="#/sterm/${locid}/1" class="icon ${active1}">
            <div style="background: url(https://icons.twnmm.com/wx_icons/v2/${per1.icon}.png); background-size: cover;">&nbsp;</div>
        </a>
        <a href="#/sterm/${locid}/2" class="icon ${active2}">
            <div style="background: url(https://icons.twnmm.com/wx_icons/v2/${per2.icon}.png); background-size: cover;">&nbsp;</div>
        </a>
        <a href="#/sterm/${locid}/3" class="icon ${active3} last">
            <div style="background: url(https://icons.twnmm.com/wx_icons/v2/${per3.icon}.png); background-size: cover;">&nbsp;</div>
        </a>
        <a href="#/sterm/${locid}/1" class="temp ${active1}">${per1.t}<span>°C</span></a>
        <a href="#/sterm/${locid}/2" class="temp ${active2}">${per2.t}<span>°C</span></a>
        <a href="#/sterm/${locid}/3" class="temp ${active3} last">${per3.t}<span>°C</span></a>
    </div>
    <div class="soleil"></div>
</div>
`;
};

export const renderSeven = (seven: ISevendays) => {
    let per = seven.periods[sevenid - 1];
    let per1 = seven.periods[0];
    let per2 = seven.periods[1];
    let per3 = seven.periods[2];
    let per4 = seven.periods[3];
    let per5 = seven.periods[4];
    let active1 = (sevenid == 1 ? "active" : "");
    let active2 = (sevenid == 2 ? "active" : "");
    let active3 = (sevenid == 3 ? "active" : "");
    let active4 = (sevenid == 4 ? "active" : "");
    let active5 = (sevenid == 5 ? "active" : "");
    const per_w = per.w?.replace(/\./g, "").replace(/-/g, "") ?? "0"
    return `
<div class="title">Tendance à long terme</div>
<div class="main">
    <div class="location">${location.name}, QC, Canada</div>
    <div class="for-date">${moment(per.tsl).format("dddd, D MMMM YYYY")}</div>
    <div class="general">
        <div class="icon">
            <div style="background: url(https://icons.twnmm.com/wx_icons/v2/${per.ida}.png); background-size: cover;">&nbsp;</div>
        </div>
        <div class="temp">${per.tma}<span>°C</span></div>
        <div class="feel">T. ressentie: <div>${per.f}</div></div>
        <div class="desc">${per.itd}</div>
    </div>
    <div class="detail">
        <div><span class="label">T.Min:</span> ${per.tm}<span>°C</span></div>
        <div><span class="label">Pluie:</span> ${per.metric_rain}</div>
        <div><span class="label">P.D.P.:</span> ${per.pdp}%</div>
        <div><span class="label">Neige:</span> ${per.metric_snow}</div>
        <div><span class="label">Vents:</span> ${per_w} ${per.wu}</div>
    </div>
    <div class="data">
        <a href="#/seven/${locid}/1" class="head ${active1}">${per1.sd.split(" ")[0]}</s>
        <a href="#/seven/${locid}/2" class="head ${active2}">${per2.sd.split(" ")[0]}</a>
        <a href="#/seven/${locid}/3" class="head ${active3}">${per3.sd.split(" ")[0]}</a>
        <a href="#/seven/${locid}/4" class="head ${active4}">${per4.sd.split(" ")[0]}</a>
        <a href="#/seven/${locid}/5" class="head ${active5} last">${per5.sd.split(" ")[0]}</a>
        <a href="#/seven/${locid}/1" class="icon ${active1}">
            <div style="background: url(https://icons.twnmm.com/wx_icons/v2/${per1.ida}.png); background-size: cover;">&nbsp;</div>
        </a>
        <a href="#/seven/${locid}/2" class="icon ${active2}">
            <div style="background: url(https://icons.twnmm.com/wx_icons/v2/${per2.ida}.png); background-size: cover;">&nbsp;</div>
        </a>
        <a href="#/seven/${locid}/3" class="icon ${active3}">
            <div style="background: url(https://icons.twnmm.com/wx_icons/v2/${per3.ida}.png); background-size: cover;">&nbsp;</div>
        </a>
        <a href="#/seven/${locid}/4" class="icon ${active4}">
            <div style="background: url(https://icons.twnmm.com/wx_icons/v2/${per4.ida}.png); background-size: cover;">&nbsp;</div>
        </a>
        <a href="#/seven/${locid}/5" class="icon ${active5} last">
            <div style="background: url(https://icons.twnmm.com/wx_icons/v2/${per5.ida}.png); background-size: cover;">&nbsp;</div>
        </a>
        <a href="#/seven/${locid}/1" class="temp ${active1}">${per1.tma}<span>°C</span></a>
        <a href="#/seven/${locid}/2" class="temp ${active2}">${per2.tma}<span>°C</span></a>
        <a href="#/seven/${locid}/3" class="temp ${active3}">${per3.tma}<span>°C</span></a>
        <a href="#/seven/${locid}/4" class="temp ${active4}">${per4.tma}<span>°C</span></a>
        <a href="#/seven/${locid}/5" class="temp ${active5} last">${per5.tma}<span>°C</span></a>
        <a href="#/seven/${locid}/1" class="temp ${active1}">${per1.tm}<span>°C</span></a>
        <a href="#/seven/${locid}/2" class="temp ${active2}">${per2.tm}<span>°C</span></a>
        <a href="#/seven/${locid}/3" class="temp ${active3}">${per3.tm}<span>°C</span></a>
        <a href="#/seven/${locid}/4" class="temp ${active4}">${per4.tm}<span>°C</span></a>
        <a href="#/seven/${locid}/5" class="temp ${active5} last">${per5.tm}<span>°C</span></a>
    </div>
    <div class="soleil"></div>
</div>
`;
};

const renderFourteen = (fourteen: IFourteendays) => {
    return fourteen.periods.reduce((html, per) => { 
        return html + `
            <hr/>
            <div>${per.sd}</div>
            <img src="//s2.twnmm.com/images/fr_ca/icons/wxicons_small/${per.icon}.png">
            <div>Jour ${per.tma} °C</div>
            <div>Nuit ${per.tm} °C</div>
            <div>P.D.P. ${per.pdp} %</div>
            <div>Pluie ${per.metric_rain}</div>
            <div>Neige ${per.metric_snow}</div>
        `;
    }, "")
};

const renderHourly = (days: IDays[]) => {
    let periods = days[0].periods;
    return periods.reduce((html, per) => { 
        return html + `
            <hr/>
            <div>${per.dn} ${per.hour}</div>
            <img src="//s2.twnmm.com/images/fr_ca/icons/wxicons_small/${per.icon}.png">
            <div>${per.it}</div>
        `;
    }, "")
};

interface IPelmorexObs {
    observation: {
        time: { local: string; utc: string }
        weatherCode: { value: string; icon: number; text: string; bgimage: string }
        temperature: number
        feelsLike: number
        wind: { direction: string; speed: number; gust: number }
        relativeHumidity: number
    }
    display: { imageUrl: string }
}

interface IPelmorexShortPeriod {
    time: { local: string; utc: string }
    weatherCode: { value: string; icon: number; text: string }
    temperature: { value: number }
    feelsLike: number
    wind: { direction: string; speed: number; gust: number }
    pop: number
    relativeHumidity: number
    rain: { value: number; range: string }
    snow: { value: number; range: string }
}

interface IPelmorexLongDay {
    time: { local: string; utc: string }
    rain: { value: number; range: string }
    snow: { value: number; range: string }
    hoursOfSun: number
    day: {
        weatherCode: { value: string; icon: number; text: string }
        temperature: { value: number }
        feelsLike: number
        wind: { direction: string; speed: number; gust: number }
        pop: number
    }
    night: {
        temperature: { value: number }
    }
}

const PELMOREX_BASE = "https://weatherapi.pelmorex.com/api/v1";

const fetchLatestCm = (param: string): Promise<ICM> => {
    locid = param;
    location = getLocation(locid);
    const lat = location.latitude;
    const lng = location.longitude;
    const qs = `locale=fr-CA&lat=${lat}&long=${lng}&unit=metric`;
    const formatLocalTime = (isoStr: string) => {
        const [h, m] = isoStr.split("T")[1].split(":");
        return `${parseInt(h)}h${m}`;
    };
    return Promise.all([
        window.fetch(`${PELMOREX_BASE}/observation?${qs}`).then(r => r.json()),
        window.fetch(`${PELMOREX_BASE}/shortterm?${qs}&count=6`).then(r => r.json()),
        window.fetch(`${PELMOREX_BASE}/longterm?${qs}&count=15&offset=0`).then(r => r.json()),
        window.fetch(`${PELMOREX_BASE}/astronomy/sunrisesunset?lat=${lat}&long=${lng}`).then(r => r.json()),
    ]).then(([obsJson, stermJson, ltermJson, sunJson]: [IPelmorexObs, {shortTerm: IPelmorexShortPeriod[]}, {longTerm: IPelmorexLongDay[]}, {times: {sunrise: string; sunset: string}[]}]) => {
        const o = obsJson.observation;
        const sun = sunJson.times[0];
        const obs: IOBS = {
            background: o.weatherCode.bgimage,
            image_url: obsJson.display.imageUrl,
            icon: String(o.weatherCode.icon),
            lbl_updatetime: "Mise à jour:",
            updatetime: o.time.local.split("T")[1],
            updatetime_stamp_gmt: new Date(o.time.utc + "Z").getTime(),
            wxc: o.weatherCode.text,
            tc: String(o.temperature),
            fc: String(o.feelsLike),
            wk: String(o.wind.speed),
            wu: "km/h",
            wd: o.wind.direction,
            windDirection_icon: o.wind.direction.toLowerCase().replace(/\./g, "").replace(/-/g, ""),
            windGustSpeed_knot: o.wind.gust / 1.852,
            wgu: "km/h",
            h: String(o.relativeHumidity),
            sunrise_gmt: new Date(sun.sunrise).getTime(),
            sunrise_time: formatLocalTime(sun.sunrise),
            sunset_gmt: new Date(sun.sunset).getTime(),
            sunset_time: formatLocalTime(sun.sunset),
        };
        const sterm: ISTerm = {
            periods: stermJson.shortTerm.map(p => ({
                stdayforcurrent: moment(p.time.local).format("ddd. H[h]"),
                wxc: p.weatherCode.text,
                t: String(p.temperature.value),
                f: String(p.feelsLike),
                icon: String(p.weatherCode.icon),
                pp: String(p.pop),
                w: String(p.wind.speed),
                wd: p.wind.direction,
                wu: "km/h",
                wg: String(p.wind.gust),
                wgu: "km/h",
                h: String(p.relativeHumidity),
                rr: p.rain.range,
                ru: "mm",
                sr: "",
                su: "",
            }))
        };
        const sevendays: ISevendays = {
            periods: ltermJson.longTerm.map(p => ({
                sd: moment(p.time.local).format("ddd."),
                itd: p.day.weatherCode.text,
                ida: String(p.day.weatherCode.icon),
                tma: String(p.day.temperature.value),
                f: String(p.day.feelsLike),
                tm: String(p.night.temperature.value),
                pdp: String(p.day.pop),
                metric_rain: `${p.rain.value} mm`,
                metric_snow: `${p.snow.value} cm`,
                w: String(p.day.wind.speed),
                wu: "km/h",
                wd: p.day.wind.direction,
                sun_hrs: String(p.hoursOfSun),
                tsl: new Date(p.time.local).getTime(),
            }))
        };
        return <ICM>{
            code: param,
            obs,
            sterm,
            sevendays,
            fourteendays: { periods: [] },
            daysky: { hourly_data: { days: [] } },
        };
    });
};

export const fetchObsRaw = (param: string) => {
    locid = param;
    location = getLocation(locid);
    return fetchLatestCm(locid)
    .then(cm => {
        return cm.obs;
    });
};

export const fetchSterm = (param: string) => {
    locid = param.split("/")[0];
    stermid = +param.split("/")[1];
    location = getLocation(locid);
    return fetchLatestCm(locid)
    .then(cm => {
        return cm.sterm;
    });
};

export const fetchSeven = (param: string) => {
    locid = param.split("/")[0];
    location = getLocation(locid);
    sevenid = +param.split("/")[1];
    return fetchLatestCm(locid)
    .then(cm => {
        return cm.sevendays;
    });
    // return new Promise<string>(function (resolve, reject) {
    //     cm = JSON.parse(localStorage.getItem("cm"));
    //     resolve(renderSeven(cm.sevendays));
    // });
};

export const fetchAlerts = (id: string) => {
    return new Promise(function (resolve, reject) {
        let url = `http://meteo.gc.ca/wxlink/wxlink.html?cityCode=${id}&lang=f`;
        let iframe = document.createElement("iframe");
        iframe.onload = () => {
            let anchors = iframe.contentDocument.getElementsByClassName("warningHyperlink");
            if (anchors != undefined && anchors.length > 0) {
                var anchor = <HTMLAnchorElement>anchors[0];
                var url = anchor.search;
                resolve(url);
            }
            resolve(null);
        };
        iframe.setAttribute("src", url);
        iframe.setAttribute("style", "display:none;");
        document.body.appendChild(iframe);
    });
};
