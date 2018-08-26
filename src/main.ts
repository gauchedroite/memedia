"use strict"

declare const FastClick: any;

import { fetchObsRaw, renderObs, fetchSterm, fetchSeven, locid, renderSterm, renderSeven } from "./meteo";
import { fetchSdf } from "./ski-de-fond";
import { addRoute } from "./router";
import { getNextLocation } from "./data"

const layout = (context: string, body: string) => {
    let nextLocation = getNextLocation(locid)
    let activeObs = context == "obs"
    let activeSterm = context == "sterm"
    let activeSeven = context == "seven"
    let nextHref = document.location.hash.replace(locid, nextLocation.id);
    return `
    <div class="container ${context}">
    <div class="top-bar">
        <div>Christian</div>
        <div>Média</div>
    </div>
    ${body}
    <div class="footer">
        <div class="buttons">
            <a href="#/obs/${locid}" ${ activeObs ? "class='active'" : "" }>Actuellement</a>
            <a href="#/sterm/${locid}/1" ${ activeSterm ? "class='active'" : "" }>Court terme</a>
            <a href="#/seven/${locid}/1" ${ activeSeven ? "class='active'" : "" }>Long terme</a>
            <!--<a href="#/hourly/${locid}" style="opacity: 0.35;">Horaires</a>-->
            <a href="${nextHref}">Villes &gt;</a>
        </div>
    </div>
</div>
    `;
};

const render = (context: string, body: string) => {
    let app = document.getElementById("app");
    app.innerHTML = layout(context, body);
};


document.addEventListener("DOMContentLoaded", function (event) {

    FastClick.attach(document.body);    

    addRoute("^#/obs/(.*)$", param => {
        let obsPromise = fetchObsRaw(param);
        let sdfPromise = fetchSdf(param);
        Promise
            .all([obsPromise, sdfPromise])
            .then(values => {
                let obs = values[0];
                let sdf = values[1];
                let html = renderObs(obs, sdf);
                render("obs", html);
            })
    });

    addRoute("^#/sterm/(.*)$", param => { 
        fetchSterm(param)
            .then(sterm => {
                let html = renderSterm(sterm);
                render("sterm", html);
            })
    });

    addRoute("^#/seven/(.*)$", param => {
        fetchSeven(param)
            .then(seven => {
                let html = renderSeven(seven);
                render("seven", html);
            })
    });
    
    let code = "caqc0177";
    if (localStorage.getItem("cm") != null)
        code = JSON.parse(localStorage.getItem("cm")).code;

    localStorage.removeItem("cm");
    (<any>document).location = `#/obs/${code}`;

    
    //fetchAlerts("qc-126").then(url => console.log(url));

    //(<any>document).location = `#/obs/caqc0177`; // Gatineau
    //(<any>document).location = `#/obs/caqc0312`; // Lévis
    //(<any>document).location = `#/obs/caqc0222`; // Jonquière
    //(<any>document).location = `#/obs/caqc2388`; // Cookshire-Eaton
    
});
