"use strict"

import {fetchObs, fetchSterm, fetchSeven, locid} from "meteo";
import {addRoute} from "router";

const menu = (context: string, body: string) => {
    return `
    <div class="container ${context}">
    <div class="top-bar">
        <div>Christian</div>
        <div>Média</div>
    </div>
    ${body}
    <div class="footer">
        <div class="buttons">
            <a href="#/obs/${locid}" ${context == "obs" ? "class='active'" : ""}>Actuellement</a>
            <a href="#/sterm/${locid}/1" ${context == "sterm" ? "class='active'" : ""}>Court terme</a>
            <a href="#/seven/${locid}/1" ${context == "seven" ? "class='active'" : ""}>Long terme</a>
            <a href="#/hourly/${locid}" style="opacity: 0.35;">Horaires</a>
        </div>
    </div>
</div>
    `;
};

const render = (context: string, body: string) => {
    let app = document.getElementById("app");
    app.innerHTML = menu(context, body);
};


document.addEventListener("DOMContentLoaded", function (event) {

    addRoute("^#/obs/(.*)$", param => { fetchObs(param).then((html: string) => { render("obs", html); }) });
    addRoute("^#/sterm/(.*)$", param => { fetchSterm(param).then((html: string) => { render("sterm", html); }) });
    addRoute("^#/seven/(.*)$", param => { fetchSeven(param).then((html: string) => { render("seven", html); }) });
    //router.addRoute("^#/seven", App_Orders.fetch);

    //fetchAlerts("qc-126").then(url => console.log(url));

    localStorage.clear();
    (<any>document).location = `#/obs/caqc0177/3`;
    
});
