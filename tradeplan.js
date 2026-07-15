// ==========================================
// GOLD GUARDIAN
// Dynamic Trade Plan Engine
// Version 1.3.0
// GG-038 Package 3
// ==========================================

function generateTradePlan(price, candles){

    if(!candles || candles.length < 3){

        clearTradePlan();

        return;

    }

    if(

        guardian.verdict !== GuardianState.BUY_READY &&

        guardian.verdict !== GuardianState.SELL_READY

    ){

        clearTradePlan();

        return;

    }

    const entry = Number(price);

    let stopLoss;

    let takeProfit1;

    let takeProfit2;

    let risk;

    let reward;

    // --------------------------
    // BUY SETUP
    // --------------------------

    if(guardian.verdict === GuardianState.BUY_READY){

        stopLoss = Number(candles[1].low);

        risk = entry - stopLoss;

        if(risk <= 0){

            clearTradePlan();

            return;

        }

        takeProfit1 = entry + (risk * 2);

        takeProfit2 = entry + (risk * 4);

    }

    // --------------------------
    // SELL SETUP
    // --------------------------

    else{

        stopLoss = Number(candles[1].high);

        risk = stopLoss - entry;

        if(risk <= 0){

            clearTradePlan();

            return;

        }

        takeProfit1 = entry - (risk * 2);

        takeProfit2 = entry - (risk * 4);

    }

    reward = Math.abs(takeProfit1 - entry);

    const rr = reward / risk;

    // --------------------------
    // Save Current Trade Plan
    // --------------------------

    guardian.entry = entry.toFixed(2);

    guardian.stopLoss = stopLoss.toFixed(2);

    guardian.takeProfit1 = takeProfit1.toFixed(2);

    guardian.takeProfit2 = takeProfit2.toFixed(2);

    guardian.riskReward = "1 : " + rr.toFixed(1);

    guardian.scores.riskReward =
    rr >= CONFIG.minRiskReward;

    updateConfidence();

    if(!guardian.scores.riskReward){

        guardian.verdict = GuardianState.NO_TRADE;

        updateGuardianDashboard();

        clearTradePlan();

        return;

    }

    document.getElementById("entryPrice").textContent =
    guardian.entry;

    document.getElementById("stopLoss").textContent =
    guardian.stopLoss;

    document.getElementById("takeProfit1").textContent =
    guardian.takeProfit1;

    document.getElementById("takeProfit2").textContent =
    guardian.takeProfit2;

    document.getElementById("riskReward").textContent =
    guardian.riskReward;

    updateGuardianDashboard();

}

// ==========================================
// CLEAR TRADE PLAN
// ==========================================

function clearTradePlan(){

    guardian.entry = null;

    guardian.stopLoss = null;

    guardian.takeProfit1 = null;

    guardian.takeProfit2 = null;

    guardian.riskReward = null;

    document.getElementById("entryPrice").textContent = "--";

    document.getElementById("stopLoss").textContent = "--";

    document.getElementById("takeProfit1").textContent = "--";

    document.getElementById("takeProfit2").textContent = "--";

    document.getElementById("riskReward").textContent = "--";

}