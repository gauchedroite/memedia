System.register("meteo", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var cm, alerts, stermid, sevenid, locid, renderObs, renderSterm, renderSeven, renderFourteen, renderHourly, fetchObs, fetchSterm, fetchSeven, fetchAlerts;
    return {
        setters: [],
        execute: function () {
            cm = {};
            alerts = {};
            stermid = 1;
            sevenid = 1;
            renderObs = (obs) => {
                return `
<div class="title">Conditions actuelles</div>
<div class="main">
    <div class="location">Gatineau, QC, Canada</div>
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
        <div><span class="label">Vents:</span> ${obs.wd} ${obs.wk} ${obs.wu}</div>
        <div></div>
        <div><span class="label">Rafales:</span> ${Math.round(obs.windGustSpeed_knot * 1.852)} ${obs.wgu}</div>
    </div>
    <div class="updated">
        Émis le: ${moment(+obs.updatetime_stamp_gmt).format("LLL")}
    </div>
    <div class="soleil"></div>
</div>
`;
            };
            renderSterm = (sterm) => {
                let per = sterm.periods[stermid - 1];
                let per1 = sterm.periods[0];
                let per2 = sterm.periods[1];
                let per3 = sterm.periods[2];
                let active1 = (stermid == 1 ? "active" : "");
                let active2 = (stermid == 2 ? "active" : "");
                let active3 = (stermid == 3 ? "active" : "");
                return `
<div class="title">Prévisions à court terme</div>
<div class="main">
    <div class="location">Gatineau, QC, Canada</div>
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
        <div><span class="label">Vents:</span> ${per.wd} ${per.w} ${per.wu}</div>
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
            renderSeven = (seven) => {
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
                return `
<div class="title">Tendance à long terme</div>
<div class="main">
    <div class="location">Gatineau, QC, Canada</div>
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
        <div><span class="label">Vents:</span> ${per.w} ${per.wu}</div>
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
            renderFourteen = (fourteen) => {
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
                }, "");
            };
            renderHourly = (days) => {
                let periods = days[0].periods;
                return periods.reduce((html, per) => {
                    return html + `
            <hr/>
            <div>${per.dn} ${per.hour}</div>
            <img src="//s2.twnmm.com/images/fr_ca/icons/wxicons_small/${per.icon}.png">
            <div>${per.it}</div>
        `;
                }, "");
            };
            exports_1("fetchObs", fetchObs = (param) => {
                if (localStorage.getItem("cm") == null) {
                    return window.fetch(`https://www.meteomedia.com/api/data/${param}/cm`)
                        .then(res => res.json())
                        .then(json => {
                        cm = json;
                        localStorage.setItem("cm", JSON.stringify(cm));
                        return renderObs(cm.obs);
                    });
                }
                else {
                    return new Promise(function (resolve, reject) {
                        exports_1("locid", locid = param);
                        cm = JSON.parse(localStorage.getItem("cm"));
                        resolve(renderObs(cm.obs));
                    });
                }
            });
            exports_1("fetchSterm", fetchSterm = (param) => {
                return new Promise(function (resolve, reject) {
                    exports_1("locid", locid = param.split("/")[0]);
                    stermid = +param.split("/")[1];
                    cm = JSON.parse(localStorage.getItem("cm"));
                    resolve(renderSterm(cm.sterm));
                });
            });
            exports_1("fetchSeven", fetchSeven = (param) => {
                return new Promise(function (resolve, reject) {
                    exports_1("locid", locid = param.split("/")[0]);
                    sevenid = +param.split("/")[1];
                    cm = JSON.parse(localStorage.getItem("cm"));
                    resolve(renderSeven(cm.sevendays));
                });
            });
            exports_1("fetchAlerts", fetchAlerts = (id) => {
                return new Promise(function (resolve, reject) {
                    let url = `http://meteo.gc.ca/wxlink/wxlink.html?cityCode=${id}&lang=f`;
                    let iframe = document.createElement("iframe");
                    iframe.onload = () => {
                        let anchors = iframe.contentDocument.getElementsByClassName("warningHyperlink");
                        if (anchors != undefined && anchors.length > 0) {
                            var anchor = anchors[0];
                            var url = anchor.search;
                            resolve(url);
                        }
                        resolve(null);
                    };
                    iframe.setAttribute("src", url);
                    iframe.setAttribute("style", "display:none;");
                    document.body.appendChild(iframe);
                });
            });
        }
    };
});
System.register("router", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var addRoute, hashChange, router;
    return {
        setters: [],
        execute: function () {
            exports_2("addRoute", addRoute = (url, callback) => {
                router.push({ url, callback });
            });
            hashChange = () => {
                const hash = window.location.hash;
                const route = router.filter(one => hash.match(new RegExp(one.url)))[0];
                if (route) {
                    if (route.callback) {
                        let params = new RegExp(route.url).exec(hash);
                        route.callback(params[1]);
                    }
                }
            };
            router = [];
            window.addEventListener('hashchange', hashChange);
            window.addEventListener('DOMContentLoaded', hashChange);
        }
    };
});
System.register("main", ["meteo", "router"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var meteo_1, router_1, menu, render;
    return {
        setters: [
            function (meteo_1_1) {
                meteo_1 = meteo_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }
        ],
        execute: function () {
            menu = (context, body) => {
                return `
    <div class="container ${context}">
    <div class="top-bar">
        <div>Christian</div>
        <div>Média</div>
    </div>
    ${body}
    <div class="footer">
        <div class="buttons">
            <a href="#/obs/${meteo_1.locid}" ${context == "obs" ? "class='active'" : ""}>Actuellement</a>
            <a href="#/sterm/${meteo_1.locid}/1" ${context == "sterm" ? "class='active'" : ""}>Court terme</a>
            <a href="#/seven/${meteo_1.locid}/1" ${context == "seven" ? "class='active'" : ""}>Long terme</a>
            <a href="#/hourly/${meteo_1.locid}" style="opacity: 0.35;">Horaires</a>
        </div>
    </div>
</div>
    `;
            };
            render = (context, body) => {
                let app = document.getElementById("app");
                app.innerHTML = menu(context, body);
            };
            document.addEventListener("DOMContentLoaded", function (event) {
                FastClick.attach(document.body);
                router_1.addRoute("^#/obs/(.*)$", param => { meteo_1.fetchObs(param).then((html) => { render("obs", html); }); });
                router_1.addRoute("^#/sterm/(.*)$", param => { meteo_1.fetchSterm(param).then((html) => { render("sterm", html); }); });
                router_1.addRoute("^#/seven/(.*)$", param => { meteo_1.fetchSeven(param).then((html) => { render("seven", html); }); });
                //router.addRoute("^#/seven", App_Orders.fetch);
                //fetchAlerts("qc-126").then(url => console.log(url));
                localStorage.clear();
                document.location = `#/obs/caqc0177`;
                //(<any>document).location = `#/sterm/caqc0177/1`;
            });
        }
    };
});
//# sourceMappingURL=main.js.map