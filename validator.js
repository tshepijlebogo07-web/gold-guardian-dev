// ==========================================
// GOLD GUARDIAN
// VALIDATION ENGINE
// GG-031
// ==========================================

function validateSystem(){

    const api =
    document.getElementById("apiStatus");

    const guardianStatus =
    document.getElementById("guardianStatus");

    const journal =
    document.getElementById("journalStatus");

    const dashboard =
    document.getElementById("dashboardStatus");

    if(api){

        api.textContent =
        navigator.onLine
        ? "🟢 Online"
        : "🔴 Offline";

    }

    if(guardianStatus){

        guardianStatus.textContent =
        "🟢 Ready";

    }

    if(journal){

        journal.textContent =

        localStorage.getItem("goldGuardianJournal")

        ? "🟢 Ready"

        : "🟡 Empty";

    }

    if(dashboard){

        dashboard.textContent =
        "🟢 Ready";

    }

}

window.addEventListener(

    "load",

    validateSystem

);