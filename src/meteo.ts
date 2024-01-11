
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
            <div style="background: url(${obs.image_url}/icons/wxicons_large/${obs.icon}.png); background-size: cover;">&nbsp;</div>
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
            <div style="background: url(//s2.twnmm.com/images/fr_ca/icons/wxicons_medium/${per.icon}.png); background-size: cover;">&nbsp;</div>
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
            <div style="background: url(//s2.twnmm.com/images/fr_ca/icons/wxicons_medium/${per1.icon}.png); background-size: cover;">&nbsp;</div>
        </a>
        <a href="#/sterm/${locid}/2" class="icon ${active2}">
            <div style="background: url(//s2.twnmm.com/images/fr_ca/icons/wxicons_medium/${per2.icon}.png); background-size: cover;">&nbsp;</div>
        </a>
        <a href="#/sterm/${locid}/3" class="icon ${active3} last">
            <div style="background: url(//s2.twnmm.com/images/fr_ca/icons/wxicons_medium/${per3.icon}.png); background-size: cover;">&nbsp;</div>
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
            <div style="background: url(//s2.twnmm.com/images/fr_ca/icons/wxicons_medium/${per.ida}.png); background-size: cover;">&nbsp;</div>
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
            <div style="background: url(//s1.twnmm.com/images/fr_ca/icons/wxicons_small/${per1.ida}.png); background-size: cover;">&nbsp;</div>
        </a>
        <a href="#/seven/${locid}/2" class="icon ${active2}">
            <div style="background: url(//s1.twnmm.com/images/fr_ca/icons/wxicons_small/${per2.ida}.png); background-size: cover;">&nbsp;</div>
        </a>
        <a href="#/seven/${locid}/3" class="icon ${active3}">
            <div style="background: url(//s1.twnmm.com/images/fr_ca/icons/wxicons_small/${per3.ida}.png); background-size: cover;">&nbsp;</div>
        </a>
        <a href="#/seven/${locid}/4" class="icon ${active4}">
            <div style="background: url(//s1.twnmm.com/images/fr_ca/icons/wxicons_small/${per4.ida}.png); background-size: cover;">&nbsp;</div>
        </a>
        <a href="#/seven/${locid}/5" class="icon ${active5} last">
            <div style="background: url(//s1.twnmm.com/images/fr_ca/icons/wxicons_small/${per5.ida}.png); background-size: cover;">&nbsp;</div>
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

const fetchLatestCm = (param: string) => {
    locid = param;
    location = getLocation(locid);
    if (localStorage.getItem("cm") == null) {
        return window.fetch(`https://www.meteomedia.com/api/data/${param}/cm`)
        .then(res => res.json())
        .then(json => {
            cm = json;
            localStorage.setItem("cm", JSON.stringify(cm));
            return cm;
        });
    }
    else {
        cm = <ICM>JSON.parse(localStorage.getItem("cm"));
        if (cm.code != locid) {
            localStorage.removeItem("cm");
            return fetchLatestCm(locid);
        }
        else
            return new Promise<ICM>(function (resolve, reject) {
                resolve(cm);
        });
    }
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
