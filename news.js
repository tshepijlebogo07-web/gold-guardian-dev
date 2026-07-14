// ==========================================
// GOLD GUARDIAN
// Economic News Filter
// Version 1.0.0
// ==========================================

// High-impact news state

let newsLock = false;

let newsReason = "";

// ------------------------------------------
// Check for High Impact News
// ------------------------------------------

function checkEconomicNews(){

    // Placeholder

    // Future:
    // Fetch live economic calendar.

    newsLock = false;

    newsReason = "";

}

// ------------------------------------------
// Is Trading Allowed?
// ------------------------------------------

function tradingAllowed(){

    return !newsLock;

}

// ------------------------------------------
// Activate News Lock
// ------------------------------------------

function activateNewsLock(reason){

    newsLock = true;

    newsReason = reason;

    guardian.verdict = "HIGH IMPACT NEWS";

    guardian.confidence = 0;

    document.getElementById(

        "newsStatus"

    ).textContent =

    "🔴 " + reason;

    updateGuardianDashboard();

sendGuardianNotification(

"🚨 HIGH IMPACT NEWS",

reason,

"newsLock"

);

}

// ------------------------------------------
// Remove News Lock
// ------------------------------------------

function clearNewsLock(){

    newsLock = false;

    newsReason = "";

    document.getElementById(

        "newsStatus"

    ).textContent =

    "🟢 Clear";

}