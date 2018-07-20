
export function computeSunrise(date: Date, latitude: number, longitude: number)
{
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

function AddDaysToDate(date: Date, days: number)
{
    return new Date(date.getTime() + 24 * 60 * 60 * 1000 * days);
}


//
// This code was derived from the code appearing at
// http://www.srrb.noaa.gov/highlights/sunrise/sunrise.html
//
function isLeapYear(yr: number)
{
    return ((yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0);
}
function radToDeg(angleRad: number)
{
    return (180.0 * angleRad / Math.PI);
}
function degToRad(angleDeg: number)
{
    return (Math.PI * angleDeg / 180.0);
}
function calcDayOfYear(mn: number, dy: number, lpyr: boolean)
{
    var k = (lpyr ? 1 : 2);
    var doy = Math.floor((275 * mn)/9) - k * Math.floor((mn + 9)/12) + dy -30;
    return doy;
}
function calcDayOfWeek(juld: number)
{
    var A = (juld + 1.5) % 7;
    var DOW = (A==0)?"Sunday":(A==1)?"Monday":(A==2)?"Tuesday":(A==3)?"Wednesday":(A==4)?"Thursday":(A==5)?"Friday":"Saturday";
    return DOW;
}
function calcJD(year: number, month: number, day: number)
{
    if (month <= 2)
    {
        year -= 1;
        month += 12;
    }
    var A = Math.floor(year/100);
    var B = 2 - A + Math.floor(A/4);

    var JD = Math.floor(365.25*(year + 4716)) + Math.floor(30.6001*(month+1)) + day + B - 1524.5;
    return JD;
}
function calcTimeJulianCent(jd: number)
{
    var T = (jd - 2451545.0)/36525.0;
    return T;
}
function calcJDFromJulianCent(t: number)
{
    var JD = t * 36525.0 + 2451545.0;
    return JD;
}
function calcGeomMeanLongSun(t: number)
{
    var L0 = 280.46646 + t * (36000.76983 + 0.0003032 * t);
    while(L0 > 360.0)
    {
        L0 -= 360.0;
    }
    while(L0 < 0.0)
    {
        L0 += 360.0;
    }
    return L0; // in degrees
}
function calcGeomMeanAnomalySun(t: number)
{
    var M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
    return M; // in degrees
}
function calcEccentricityEarthOrbit(t: number)
{
    var e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
    return e; // unitless
}
function calcSunEqOfCenter(t: number)
{
    var m = calcGeomMeanAnomalySun(t);

    var mrad = degToRad(m);
    var sinm = Math.sin(mrad);
    var sin2m = Math.sin(mrad+mrad);
    var sin3m = Math.sin(mrad+mrad+mrad);

    var C = sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin2m * (0.019993 - 0.000101 * t) + sin3m * 0.000289;
    return C; // in degrees
}
function calcSunTrueLong(t: number)
{
    var l0 = calcGeomMeanLongSun(t);
    var c = calcSunEqOfCenter(t);

    var O = l0 + c;
    return O; // in degrees
}
function calcSunTrueAnomaly(t: number)
{
    var m = calcGeomMeanAnomalySun(t);
    var c = calcSunEqOfCenter(t);

    var v = m + c;
    return v; // in degrees
}
function calcSunRadVector(t: number)
{
    var v = calcSunTrueAnomaly(t);
    var e = calcEccentricityEarthOrbit(t);

    var R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(degToRad(v)));
    return R; // in AUs
}
function calcSunApparentLong(t: number)
{
    var o = calcSunTrueLong(t);

    var omega = 125.04 - 1934.136 * t;
    var lambda = o - 0.00569 - 0.00478 * Math.sin(degToRad(omega));
    return lambda; // in degrees
}
function calcMeanObliquityOfEcliptic(t: number)
{
    var seconds = 21.448 - t*(46.8150 + t*(0.00059 - t*(0.001813)));
    var e0 = 23.0 + (26.0 + (seconds/60.0))/60.0;
    return e0; // in degrees
}
function calcObliquityCorrection(t: number)
{
    var e0 = calcMeanObliquityOfEcliptic(t);

    var omega = 125.04 - 1934.136 * t;
    var e = e0 + 0.00256 * Math.cos(degToRad(omega));
    return e; // in degrees
}
function calcSunRtAscension(t: number)
{
    var e = calcObliquityCorrection(t);
    var lambda = calcSunApparentLong(t);

    var tananum = (Math.cos(degToRad(e)) * Math.sin(degToRad(lambda)));
    var tanadenom = (Math.cos(degToRad(lambda)));
    var alpha = radToDeg(Math.atan2(tananum, tanadenom));
    return alpha; // in degrees
}
function calcSunDeclination(t: number)
{
    var e = calcObliquityCorrection(t);
    var lambda = calcSunApparentLong(t);

    var sint = Math.sin(degToRad(e)) * Math.sin(degToRad(lambda));
    var theta = radToDeg(Math.asin(sint));
    return theta; // in degrees
}
function calcEquationOfTime(t: number)
{
    var epsilon = calcObliquityCorrection(t);
    var l0 = calcGeomMeanLongSun(t);
    var e = calcEccentricityEarthOrbit(t);
    var m = calcGeomMeanAnomalySun(t);

    var y = Math.tan(degToRad(epsilon)/2.0);
    y *= y;

    var sin2l0 = Math.sin(2.0 * degToRad(l0));
    var sinm = Math.sin(degToRad(m));
    var cos2l0 = Math.cos(2.0 * degToRad(l0));
    var sin4l0 = Math.sin(4.0 * degToRad(l0));
    var sin2m = Math.sin(2.0 * degToRad(m));

    var Etime = y * sin2l0 - 2.0 * e * sinm + 4.0 * e * y * sinm * cos2l0
    - 0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;

    return radToDeg(Etime)*4.0; // in minutes of time
}
function calcHourAngleSunrise(lat: number, solarDec: number)
{
    var latRad = degToRad(lat);
    var sdRad = degToRad(solarDec)

    var HAarg = (Math.cos(degToRad(90.833))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad));

    var HA = (Math.acos(Math.cos(degToRad(90.833))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad)));

    return HA; // in radians
}
function calcHourAngleSunset(lat: number, solarDec: number)
{
    var latRad = degToRad(lat);
    var sdRad = degToRad(solarDec)

    var HAarg = (Math.cos(degToRad(90.833))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad));

    var HA = (Math.acos(Math.cos(degToRad(90.833))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad)));

    return -HA; // in radians
}
function calcSunriseUTC(JD: number, latitude: number, longitude: number)
{
    var t = calcTimeJulianCent(JD);

    // *** Find the time of solar noon at the location, and use
    // that declination. This is better than start of the
    // Julian day

    var noonmin = calcSolNoonUTC(t, longitude);
    var tnoon = calcTimeJulianCent (JD+noonmin/1440.0);

    // *** First pass to approximate sunrise (using solar noon)

    var eqTime = calcEquationOfTime(tnoon);
    var solarDec = calcSunDeclination(tnoon);
    var hourAngle = calcHourAngleSunrise(latitude, solarDec);

    var delta = longitude - radToDeg(hourAngle);
    var timeDiff = 4 * delta; // in minutes of time
    var timeUTC = 720 + timeDiff - eqTime; // in minutes

    // alert("eqTime = " + eqTime + "\nsolarDec = " + solarDec + "\ntimeUTC = " + timeUTC);

    // *** Second pass includes fractional jday in gamma calc

    var newt = calcTimeJulianCent(calcJDFromJulianCent(t) + timeUTC/1440.0);
    eqTime = calcEquationOfTime(newt);
    solarDec = calcSunDeclination(newt);
    hourAngle = calcHourAngleSunrise(latitude, solarDec);
    delta = longitude - radToDeg(hourAngle);
    timeDiff = 4 * delta;
    timeUTC = 720 + timeDiff - eqTime; // in minutes

    // alert("eqTime = " + eqTime + "\nsolarDec = " + solarDec + "\ntimeUTC = " + timeUTC);

    return timeUTC;
}
function calcSolNoonUTC(t: number, longitude: number)
{
    var newt = calcTimeJulianCent(calcJDFromJulianCent(t) + 0.5 + longitude/360.0);

    var eqTime = calcEquationOfTime(newt);
    var solarNoonDec = calcSunDeclination(newt);
    var solNoonUTC = 720 + (longitude * 4) - eqTime; // min

    return solNoonUTC;
}
function calcSunsetUTC(JD: number, latitude: number, longitude: number)
{
    var t = calcTimeJulianCent(JD);

    // *** Find the time of solar noon at the location, and use
    // that declination. This is better than start of the
    // Julian day

    var noonmin = calcSolNoonUTC(t, longitude);
    var tnoon = calcTimeJulianCent (JD+noonmin/1440.0);

    // First calculates sunrise and approx length of day

    var eqTime = calcEquationOfTime(tnoon);
    var solarDec = calcSunDeclination(tnoon);
    var hourAngle = calcHourAngleSunset(latitude, solarDec);

    var delta = longitude - radToDeg(hourAngle);
    var timeDiff = 4 * delta;
    var timeUTC = 720 + timeDiff - eqTime;

    // first pass used to include fractional day in gamma calc

    var newt = calcTimeJulianCent(calcJDFromJulianCent(t) + timeUTC/1440.0);
    eqTime = calcEquationOfTime(newt);
    solarDec = calcSunDeclination(newt);
    hourAngle = calcHourAngleSunset(latitude, solarDec);

    delta = longitude - radToDeg(hourAngle);
    timeDiff = 4 * delta;
    timeUTC = 720 + timeDiff - eqTime; // in minutes

    return timeUTC;
}

function SunriseSunset(date: Date, longitude: number, latitude: number)
{
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

export function formatMMSS (hour: number) {
    let absMM = Math.abs(hour * 60);
    let mm = Math.floor(absMM)
    let ss = Math.floor((absMM - mm) * 60);
    return (hour < 0 ? "-" : "+") + ("00" + mm).slice(-2) + ":" + ("00" + ss).slice(-2)
}