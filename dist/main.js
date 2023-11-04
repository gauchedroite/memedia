System.register("data", [], function (exports_1, context_1) {
    "use strict";
    var locations, getLocation, getNextLocation;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            locations = [];
            locations.push({
                id: "caqc0177",
                name: "Gatineau",
                latitude: 45.4765,
                longitude: -75.7013
            });
            locations.push({
                id: "caqc0312",
                name: "Lévis",
                latitude: 46.7382,
                longitude: -71.2465
            });
            locations.push({
                id: "caqc0222",
                name: "Jonquière",
                latitude: 48.4236,
                longitude: -71.2395
            });
            locations.push({
                id: "caqc0123",
                name: "Cookshire",
                latitude: 45.4131,
                longitude: -71.6263
            });
            exports_1("getLocation", getLocation = (id) => {
                return locations.find(element => { return element.id == id; });
            });
            exports_1("getNextLocation", getNextLocation = (id) => {
                for (let ix = 0; ix < locations.length; ix++) {
                    if (locations[ix].id == id) {
                        return locations[(ix + 1) % locations.length];
                    }
                }
                return null;
            });
        }
    };
});
System.register("soleil", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function computeSunrise(date, latitude, longitude) {
        var sun = SunriseSunset(date, longitude, latitude);
        var sun2 = SunriseSunset(AddDaysToDate(date, 1), longitude, latitude);
        var oneday = (sun2.setTimeGMT - sun2.riseTimeGMT) - (sun.setTimeGMT - sun.riseTimeGMT);
        var sun3 = SunriseSunset(AddDaysToDate(date, 7), longitude, latitude);
        var oneweek = (sun3.setTimeGMT - sun3.riseTimeGMT) - (sun.setTimeGMT - sun.riseTimeGMT);
        return {
            sunriseGMT: sun.riseTimeGMT,
            sunsetGMT: sun.setTimeGMT,
            demain: oneday,
            semaine: oneweek
        };
    }
    exports_2("computeSunrise", computeSunrise);
    function AddDaysToDate(date, days) {
        return new Date(date.getTime() + 24 * 60 * 60 * 1000 * days);
    }
    //
    // This code was derived from the code appearing at
    // http://www.srrb.noaa.gov/highlights/sunrise/sunrise.html
    //
    function isLeapYear(yr) {
        return ((yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0);
    }
    function radToDeg(angleRad) {
        return (180.0 * angleRad / Math.PI);
    }
    function degToRad(angleDeg) {
        return (Math.PI * angleDeg / 180.0);
    }
    function calcDayOfYear(mn, dy, lpyr) {
        var k = (lpyr ? 1 : 2);
        var doy = Math.floor((275 * mn) / 9) - k * Math.floor((mn + 9) / 12) + dy - 30;
        return doy;
    }
    function calcDayOfWeek(juld) {
        var A = (juld + 1.5) % 7;
        var DOW = (A == 0) ? "Sunday" : (A == 1) ? "Monday" : (A == 2) ? "Tuesday" : (A == 3) ? "Wednesday" : (A == 4) ? "Thursday" : (A == 5) ? "Friday" : "Saturday";
        return DOW;
    }
    function calcJD(year, month, day) {
        if (month <= 2) {
            year -= 1;
            month += 12;
        }
        var A = Math.floor(year / 100);
        var B = 2 - A + Math.floor(A / 4);
        var JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
        return JD;
    }
    function calcTimeJulianCent(jd) {
        var T = (jd - 2451545.0) / 36525.0;
        return T;
    }
    function calcJDFromJulianCent(t) {
        var JD = t * 36525.0 + 2451545.0;
        return JD;
    }
    function calcGeomMeanLongSun(t) {
        var L0 = 280.46646 + t * (36000.76983 + 0.0003032 * t);
        while (L0 > 360.0) {
            L0 -= 360.0;
        }
        while (L0 < 0.0) {
            L0 += 360.0;
        }
        return L0; // in degrees
    }
    function calcGeomMeanAnomalySun(t) {
        var M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
        return M; // in degrees
    }
    function calcEccentricityEarthOrbit(t) {
        var e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
        return e; // unitless
    }
    function calcSunEqOfCenter(t) {
        var m = calcGeomMeanAnomalySun(t);
        var mrad = degToRad(m);
        var sinm = Math.sin(mrad);
        var sin2m = Math.sin(mrad + mrad);
        var sin3m = Math.sin(mrad + mrad + mrad);
        var C = sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin2m * (0.019993 - 0.000101 * t) + sin3m * 0.000289;
        return C; // in degrees
    }
    function calcSunTrueLong(t) {
        var l0 = calcGeomMeanLongSun(t);
        var c = calcSunEqOfCenter(t);
        var O = l0 + c;
        return O; // in degrees
    }
    function calcSunTrueAnomaly(t) {
        var m = calcGeomMeanAnomalySun(t);
        var c = calcSunEqOfCenter(t);
        var v = m + c;
        return v; // in degrees
    }
    function calcSunRadVector(t) {
        var v = calcSunTrueAnomaly(t);
        var e = calcEccentricityEarthOrbit(t);
        var R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(degToRad(v)));
        return R; // in AUs
    }
    function calcSunApparentLong(t) {
        var o = calcSunTrueLong(t);
        var omega = 125.04 - 1934.136 * t;
        var lambda = o - 0.00569 - 0.00478 * Math.sin(degToRad(omega));
        return lambda; // in degrees
    }
    function calcMeanObliquityOfEcliptic(t) {
        var seconds = 21.448 - t * (46.8150 + t * (0.00059 - t * (0.001813)));
        var e0 = 23.0 + (26.0 + (seconds / 60.0)) / 60.0;
        return e0; // in degrees
    }
    function calcObliquityCorrection(t) {
        var e0 = calcMeanObliquityOfEcliptic(t);
        var omega = 125.04 - 1934.136 * t;
        var e = e0 + 0.00256 * Math.cos(degToRad(omega));
        return e; // in degrees
    }
    function calcSunRtAscension(t) {
        var e = calcObliquityCorrection(t);
        var lambda = calcSunApparentLong(t);
        var tananum = (Math.cos(degToRad(e)) * Math.sin(degToRad(lambda)));
        var tanadenom = (Math.cos(degToRad(lambda)));
        var alpha = radToDeg(Math.atan2(tananum, tanadenom));
        return alpha; // in degrees
    }
    function calcSunDeclination(t) {
        var e = calcObliquityCorrection(t);
        var lambda = calcSunApparentLong(t);
        var sint = Math.sin(degToRad(e)) * Math.sin(degToRad(lambda));
        var theta = radToDeg(Math.asin(sint));
        return theta; // in degrees
    }
    function calcEquationOfTime(t) {
        var epsilon = calcObliquityCorrection(t);
        var l0 = calcGeomMeanLongSun(t);
        var e = calcEccentricityEarthOrbit(t);
        var m = calcGeomMeanAnomalySun(t);
        var y = Math.tan(degToRad(epsilon) / 2.0);
        y *= y;
        var sin2l0 = Math.sin(2.0 * degToRad(l0));
        var sinm = Math.sin(degToRad(m));
        var cos2l0 = Math.cos(2.0 * degToRad(l0));
        var sin4l0 = Math.sin(4.0 * degToRad(l0));
        var sin2m = Math.sin(2.0 * degToRad(m));
        var Etime = y * sin2l0 - 2.0 * e * sinm + 4.0 * e * y * sinm * cos2l0
            - 0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;
        return radToDeg(Etime) * 4.0; // in minutes of time
    }
    function calcHourAngleSunrise(lat, solarDec) {
        var latRad = degToRad(lat);
        var sdRad = degToRad(solarDec);
        var HAarg = (Math.cos(degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));
        var HA = (Math.acos(Math.cos(degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad)));
        return HA; // in radians
    }
    function calcHourAngleSunset(lat, solarDec) {
        var latRad = degToRad(lat);
        var sdRad = degToRad(solarDec);
        var HAarg = (Math.cos(degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));
        var HA = (Math.acos(Math.cos(degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad)));
        return -HA; // in radians
    }
    function calcSunriseUTC(JD, latitude, longitude) {
        var t = calcTimeJulianCent(JD);
        // *** Find the time of solar noon at the location, and use
        // that declination. This is better than start of the
        // Julian day
        var noonmin = calcSolNoonUTC(t, longitude);
        var tnoon = calcTimeJulianCent(JD + noonmin / 1440.0);
        // *** First pass to approximate sunrise (using solar noon)
        var eqTime = calcEquationOfTime(tnoon);
        var solarDec = calcSunDeclination(tnoon);
        var hourAngle = calcHourAngleSunrise(latitude, solarDec);
        var delta = longitude - radToDeg(hourAngle);
        var timeDiff = 4 * delta; // in minutes of time
        var timeUTC = 720 + timeDiff - eqTime; // in minutes
        // alert("eqTime = " + eqTime + "\nsolarDec = " + solarDec + "\ntimeUTC = " + timeUTC);
        // *** Second pass includes fractional jday in gamma calc
        var newt = calcTimeJulianCent(calcJDFromJulianCent(t) + timeUTC / 1440.0);
        eqTime = calcEquationOfTime(newt);
        solarDec = calcSunDeclination(newt);
        hourAngle = calcHourAngleSunrise(latitude, solarDec);
        delta = longitude - radToDeg(hourAngle);
        timeDiff = 4 * delta;
        timeUTC = 720 + timeDiff - eqTime; // in minutes
        // alert("eqTime = " + eqTime + "\nsolarDec = " + solarDec + "\ntimeUTC = " + timeUTC);
        return timeUTC;
    }
    function calcSolNoonUTC(t, longitude) {
        var newt = calcTimeJulianCent(calcJDFromJulianCent(t) + 0.5 + longitude / 360.0);
        var eqTime = calcEquationOfTime(newt);
        var solarNoonDec = calcSunDeclination(newt);
        var solNoonUTC = 720 + (longitude * 4) - eqTime; // min
        return solNoonUTC;
    }
    function calcSunsetUTC(JD, latitude, longitude) {
        var t = calcTimeJulianCent(JD);
        // *** Find the time of solar noon at the location, and use
        // that declination. This is better than start of the
        // Julian day
        var noonmin = calcSolNoonUTC(t, longitude);
        var tnoon = calcTimeJulianCent(JD + noonmin / 1440.0);
        // First calculates sunrise and approx length of day
        var eqTime = calcEquationOfTime(tnoon);
        var solarDec = calcSunDeclination(tnoon);
        var hourAngle = calcHourAngleSunset(latitude, solarDec);
        var delta = longitude - radToDeg(hourAngle);
        var timeDiff = 4 * delta;
        var timeUTC = 720 + timeDiff - eqTime;
        // first pass used to include fractional day in gamma calc
        var newt = calcTimeJulianCent(calcJDFromJulianCent(t) + timeUTC / 1440.0);
        eqTime = calcEquationOfTime(newt);
        solarDec = calcSunDeclination(newt);
        hourAngle = calcHourAngleSunset(latitude, solarDec);
        delta = longitude - radToDeg(hourAngle);
        timeDiff = 4 * delta;
        timeUTC = 720 + timeDiff - eqTime; // in minutes
        return timeUTC;
    }
    function SunriseSunset(date, longitude, latitude) {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getUTCFullYear(); //NOTE: For 2008, date.getYear() will return 108 in firefox
        var JD = (calcJD(year, month, day));
        var dow = calcDayOfWeek(JD);
        var doy = calcDayOfYear(month, day, isLeapYear(year));
        var T = calcTimeJulianCent(JD);
        var rtAsc = calcSunRtAscension(T);
        var solarDec = calcSunDeclination(T);
        var eqTime = calcEquationOfTime(T);
        // Calculate sunrise, sunset and solar noon for this date (in decimal hours)
        var riseTimeGMT = calcSunriseUTC(JD, latitude, longitude) / 60.0;
        var setTimeGMT = calcSunsetUTC(JD, latitude, longitude) / 60.0;
        var solNoonGMT = calcSolNoonUTC(T, longitude) / 60.0;
        return {
            riseTimeGMT: riseTimeGMT,
            setTimeGMT: setTimeGMT,
            solNoonGMT: solNoonGMT,
            solarDec: solarDec,
            eqTime: eqTime,
            rtAsc: rtAsc
        };
    }
    function formatMMSS(hour) {
        let absMM = Math.abs(hour * 60);
        let mm = Math.floor(absMM);
        let ss = Math.floor((absMM - mm) * 60);
        return (hour < 0 ? "-" : "+") + ("00" + mm).slice(-2) + ":" + ("00" + ss).slice(-2);
    }
    exports_2("formatMMSS", formatMMSS);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("ski-de-fond", ["soleil", "data"], function (exports_3, context_3) {
    "use strict";
    var soleil_1, data_1, fetchSdf;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (soleil_1_1) {
                soleil_1 = soleil_1_1;
            },
            function (data_1_1) {
                data_1 = data_1_1;
            }
        ],
        execute: function () {
            exports_3("fetchSdf", fetchSdf = (locid) => {
                return new Promise(function (resolve, reject) {
                    let location = data_1.getLocation(locid);
                    let sdf = {};
                    sdf.weekSun = soleil_1.formatMMSS(soleil_1.computeSunrise(new Date(), location.latitude, location.longitude).semaine);
                    resolve(sdf);
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
            });
        }
    };
});
System.register("meteo", ["data"], function (exports_4, context_4) {
    "use strict";
    var data_2, cm, alerts, stermid, sevenid, locid, location, renderObs, renderSterm, renderSeven, renderFourteen, renderHourly, fetchLatestCm, fetchObsRaw, fetchSterm, fetchSeven, fetchAlerts;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (data_2_1) {
                data_2 = data_2_1;
            }
        ],
        execute: function () {
            cm = {};
            alerts = {};
            stermid = 1;
            sevenid = 1;
            exports_4("renderObs", renderObs = (obs, sdf) => {
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
        <div><span class="label">Vents:</span> ${obs.wd} ${obs.wk} ${obs.wu}</div>
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
            });
            exports_4("renderSterm", renderSterm = (sterm) => {
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
            });
            exports_4("renderSeven", renderSeven = (seven) => {
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
            });
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
            fetchLatestCm = (param) => {
                exports_4("locid", locid = param);
                location = data_2.getLocation(locid);
                if (localStorage.getItem("cm") == null) {
                    return window.fetch(`https://uvehl88lqe.execute-api.us-east-1.amazonaws.com/test/helloworld`)
                        .then(res => res.json())
                        .then(json => {
                        cm = json;
                        localStorage.setItem("cm", JSON.stringify(cm));
                        return cm;
                    });
                }
                else {
                    cm = JSON.parse(localStorage.getItem("cm"));
                    if (cm.code != locid) {
                        localStorage.removeItem("cm");
                        return fetchLatestCm(locid);
                    }
                    else
                        return new Promise(function (resolve, reject) {
                            resolve(cm);
                        });
                }
            };
            exports_4("fetchObsRaw", fetchObsRaw = (param) => {
                exports_4("locid", locid = param);
                location = data_2.getLocation(locid);
                return fetchLatestCm(locid)
                    .then(cm => {
                    return cm.obs;
                });
            });
            exports_4("fetchSterm", fetchSterm = (param) => {
                exports_4("locid", locid = param.split("/")[0]);
                stermid = +param.split("/")[1];
                location = data_2.getLocation(locid);
                return fetchLatestCm(locid)
                    .then(cm => {
                    return cm.sterm;
                });
            });
            exports_4("fetchSeven", fetchSeven = (param) => {
                exports_4("locid", locid = param.split("/")[0]);
                location = data_2.getLocation(locid);
                sevenid = +param.split("/")[1];
                return fetchLatestCm(locid)
                    .then(cm => {
                    return cm.sevendays;
                });
                // return new Promise<string>(function (resolve, reject) {
                //     cm = JSON.parse(localStorage.getItem("cm"));
                //     resolve(renderSeven(cm.sevendays));
                // });
            });
            exports_4("fetchAlerts", fetchAlerts = (id) => {
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
System.register("router", [], function (exports_5, context_5) {
    "use strict";
    var addRoute, hashChange, router;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            exports_5("addRoute", addRoute = (url, callback) => {
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
System.register("main", ["meteo", "ski-de-fond", "router", "data"], function (exports_6, context_6) {
    "use strict";
    var meteo_1, ski_de_fond_1, router_1, data_3, layout, render;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (meteo_1_1) {
                meteo_1 = meteo_1_1;
            },
            function (ski_de_fond_1_1) {
                ski_de_fond_1 = ski_de_fond_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (data_3_1) {
                data_3 = data_3_1;
            }
        ],
        execute: function () {
            layout = (context, body) => {
                let nextLocation = data_3.getNextLocation(meteo_1.locid);
                let activeObs = context == "obs";
                let activeSterm = context == "sterm";
                let activeSeven = context == "seven";
                let nextHref = document.location.hash.replace(meteo_1.locid, nextLocation.id);
                return `
    <div class="container ${context}">
    <div class="top-bar">
        <div>Christian</div>
        <div>Média</div>
    </div>
    ${body}
    <div class="footer">
        <div class="buttons">
            <a href="#/obs/${meteo_1.locid}" ${activeObs ? "class='active'" : ""}>Actuellement</a>
            <a href="#/sterm/${meteo_1.locid}/1" ${activeSterm ? "class='active'" : ""}>Court terme</a>
            <a href="#/seven/${meteo_1.locid}/1" ${activeSeven ? "class='active'" : ""}>Long terme</a>
            <!--<a href="#/hourly/${meteo_1.locid}" style="opacity: 0.35;">Horaires</a>-->
            <a href="${nextHref}">Villes &gt;</a>
        </div>
    </div>
</div>
    `;
            };
            render = (context, body) => {
                let app = document.getElementById("app");
                app.innerHTML = layout(context, body);
            };
            document.addEventListener("DOMContentLoaded", function (event) {
                FastClick.attach(document.body);
                router_1.addRoute("^#/obs/(.*)$", param => {
                    let obsPromise = meteo_1.fetchObsRaw(param);
                    let sdfPromise = ski_de_fond_1.fetchSdf(param);
                    Promise
                        .all([obsPromise, sdfPromise])
                        .then(values => {
                        let obs = values[0];
                        let sdf = values[1];
                        let html = meteo_1.renderObs(obs, sdf);
                        render("obs", html);
                    });
                });
                router_1.addRoute("^#/sterm/(.*)$", param => {
                    meteo_1.fetchSterm(param)
                        .then(sterm => {
                        let html = meteo_1.renderSterm(sterm);
                        render("sterm", html);
                    });
                });
                router_1.addRoute("^#/seven/(.*)$", param => {
                    meteo_1.fetchSeven(param)
                        .then(seven => {
                        let html = meteo_1.renderSeven(seven);
                        render("seven", html);
                    });
                });
                let code = "caqc0177";
                if (localStorage.getItem("cm") != null)
                    code = JSON.parse(localStorage.getItem("cm")).code;
                localStorage.removeItem("cm");
                document.location = `#/obs/${code}`;
                //fetchAlerts("qc-126").then(url => console.log(url));
                //(<any>document).location = `#/obs/caqc0177`; // Gatineau
                //(<any>document).location = `#/obs/caqc0312`; // Lévis
                //(<any>document).location = `#/obs/caqc0222`; // Jonquière
                //(<any>document).location = `#/obs/caqc2388`; // Cookshire-Eaton
            });
        }
    };
});
//# sourceMappingURL=main.js.map
