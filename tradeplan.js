// ==========================================
// GOLD GUARDIAN
// Dynamic Trade Plan Engine
// Version 1.2.0
// GG-034.5 Recovery
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
    entry.toFixed(2);

    document.getElementById("stopLoss").textContent =
    stopLoss.toFixed(2);

    document.getElementById("takeProfit1").textContent =
    takeProfit1.toFixed(2);

    document.getElementById("takeProfit2").textContent =
    takeProfit2.toFixed(2);

    document.getElementById("riskReward").textContent =
    "1 : " + rr.toFixed(1);

    if(typeof addTrade === "function"){

        addTrade({

            date: new Date().toLocaleString(),

            type: guardian.verdict,

            entry: entry.toFixed(2),

            stopLoss: stopLoss.toFixed(2),

            tp1: takeProfit1.toFixed(2),

            tp2: takeProfit2.toFixed(2),

            rr: "1 : " + rr.toFixed(1),

            confidence: guardian.confidence + "%"

        });

    }

    updateGuardianDashboard();

}

// ==========================================
// CLEAR TRADE PLAN
// ==========================================

function clearTradePlan(){

    document.getElementById("entryPrice").textContent = "--";

    document.getElementById("stopLoss").textContent = "--";

    document.getElementById("takeProfit1").textContent = "--";

    document.getElementById("takeProfit2").textContent = "--";

    document.getElementById("riskReward").textContent = "--";

}