// ==========================================
// GOLD GUARDIAN
// Strategy Engine
// GG-037
// ==========================================

function evaluateSetup(candles, asiaHighValue, asiaLowValue){

    if(!candles || candles.length < 2){

        return;

    }

    const latest = candles[0];

    const latestOpen = Number(latest.open);

    const latestClose = Number(latest.close);

    guardian.scores.rejection = false;

    // --------------------------
    // BUY REJECTION
    // --------------------------

    if(

        guardian.liquidity === "Asia Low Swept" &&

        latestClose > latestOpen &&

        latestClose > asiaLowValue

    ){

        guardian.scores.rejection = true;

        guardian.verdict = GuardianState.WATCHING;

    }

    // --------------------------
    // SELL REJECTION
    // --------------------------

    else if(

        guardian.liquidity === "Asia High Swept" &&

        latestClose < latestOpen &&

        latestClose < asiaHighValue

    ){

        guardian.scores.rejection = true;

        guardian.verdict = GuardianState.WATCHING;

    }

    updateConfidence();

    updateGuardianDashboard();

}