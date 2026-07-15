// ==========================================
// GOLD GUARDIAN
// Guardian Decision Engine
// Version 1.0.0
// ==========================================

// ---------------------------
// Guardian States
// ---------------------------

const GuardianState = {

    NO_TRADE: "NO TRADE",

    WATCHING: "WATCHING",

    BUY_READY: "BUY READY",

    SELL_READY: "SELL READY"

};

// ---------------------------
// Market Bias
// ---------------------------

const MarketBias = {

    BULLISH: "Bullish",

    BEARISH: "Bearish",

    NEUTRAL: "Neutral"

};

// ---------------------------
// Guardian Object
// ---------------------------

let guardian = {

    // Current Liquidity Status

    liquidity: "Watching",

    // Market Bias

    bias: MarketBias.NEUTRAL,

    // Guardian Verdict

    verdict: GuardianState.NO_TRADE,

    // Overall Confidence

    confidence: 0,
    
    // Current Trade Plan

entry:null,

stopLoss:null,

takeProfit1:null,

takeProfit2:null,

riskReward:null,

    // Persistent Market Memory

    memory:{

        active:false,

        liquiditySide:null,

        sweepPrice:0,

        sweepTime:null,

        session:null,

        confirmations:0,

        tradeIssued:false,

        fvgConfirmed:false,

        orderBlockConfirmed:false,

        structureConfirmed:false

    },

    // Trade Journal

    journal:[],

    // Performance Statistics

    performance:{

        total:0,

        buy:0,

        sell:0,

        wins:0,

        losses:0,

        averageConfidence:0,

        averageRR:0

    },

    // Fair Value Gap

    fvg:{

        detected:false,

        type:"None",

        top:0,

        bottom:0

    },

    // Order Block

    orderBlock:{

        detected:false,

        type:"None",

        high:0,

        low:0

    },

    // Premium / Discount

    premiumDiscount:{

        zone:"Equilibrium",

        midpoint:0

    },

    // Confirmation Scores

    scores:{

        liquidity:false,

        rejection:false,

        structure:false,

        displacement:false,

        fvg:false,

        orderBlock:false,

        premiumDiscount:false,

        riskReward:false,

        news:true

    }

};

// --------------------------
// Save Trade
// GG-038
// --------------------------

function recordSignal(){

    if(

    guardian.memory.tradeIssued ||

    !guardian.entry ||

    !guardian.stopLoss ||

    !guardian.takeProfit1

){

    return;

}

guardian.memory.tradeIssued = true;

    const trade = {

        type: guardian.verdict,

        date: new Date().toLocaleString(),

        entry: guardian.entry ?? "--",

        stopLoss: guardian.stopLoss ?? "--",

        tp1: guardian.takeProfit1 ?? "--",

        rr: guardian.riskReward ?? "--",

        confidence: guardian.confidence

    };

    guardian.journal.unshift(trade);

    guardian.performance.total++;

    if(trade.type === GuardianState.BUY_READY){

        guardian.performance.buy++;

    }

    if(trade.type === GuardianState.SELL_READY){

        guardian.performance.sell++;

    }

    // Save into the Journal Engine
    if(typeof addTrade === "function"){

        addTrade(trade);

    }

}

// ---------------------------
// Confidence Engine
// ---------------------------

function updateConfidence(){

    let score = 0;

    if(guardian.scores.liquidity){

        score += 15;

    }

    if(guardian.scores.rejection){

        score += 10;

    }

    if(guardian.scores.structure){

        score += 15;

    }

    if(guardian.scores.displacement){

        score += 15;

    }

    if(guardian.scores.fvg){

        score += 10;

    }

    if(guardian.scores.orderBlock){

        score += 10;

    }

    if(guardian.scores.premiumDiscount){

        score += 10;

    }

    if(guardian.scores.riskReward){

        score += 10;

    }

    if(guardian.scores.news){

        score += 5;

    }

    guardian.confidence =

Math.round(

(guardian.memory.confirmations / 8) * 100

);

    updateGuardianDashboard();

}

// ---------------------------
// Verdict Style
// ---------------------------

function updateVerdictStyle(){

    const verdict =
    document.getElementById("guardianVerdict");

    if(!verdict){

        return;

    }

    verdict.className = "";

    switch(guardian.verdict){

        case GuardianState.BUY_READY:

            verdict.classList.add("verdict-buy");

            if(typeof sendGuardianNotification === "function"){

                sendGuardianNotification(

                    "🟢 BUY READY",

                    "Confidence: " +
                    guardian.confidence +
                    "% | Entry Ready",

                    "buyReady"

                );

            }

            break;

        case GuardianState.SELL_READY:

            verdict.classList.add("verdict-sell");

            if(typeof sendGuardianNotification === "function"){

                sendGuardianNotification(

                    "🔴 SELL READY",

                    "Confidence: " +
                    guardian.confidence +
                    "% | Entry Ready",

                    "sellReady"

                );

            }

            break;

        case GuardianState.WATCHING:

            verdict.classList.add("verdict-watch");

            break;

        default:

            verdict.classList.add("verdict-none");

    }

}

// ---------------------------
// Dashboard
// ---------------------------

function updateGuardianDashboard(){

    // Core Dashboard

    document.getElementById("liquidityStatus").textContent =
    guardian.liquidity;

    document.getElementById("marketBias").textContent =
    guardian.bias;

    document.getElementById("guardianVerdict").textContent =
    guardian.verdict;

    document.getElementById("confidence").textContent =
    guardian.confidence + "%";

    // Premium / Discount

    const premium =
    document.getElementById("premiumDiscount");

    if(premium){

        premium.textContent =
        guardian.premiumDiscount.zone;

    }

    // Fair Value Gap

    const fvg =
    document.getElementById("fvgStatus");

    if(fvg){

        fvg.textContent =
        guardian.fvg.detected
        ? guardian.fvg.type
        : "None";

    }

    // Order Block

    const orderBlock =
    document.getElementById("orderBlockStatus");

    if(orderBlock){

        orderBlock.textContent =
        guardian.orderBlock.detected
        ? guardian.orderBlock.type
        : "None";

    }

    // Confirmation Progress

    const progress =
    document.getElementById("confirmationProgress");

    if(progress){

        const completed = [

            guardian.scores.liquidity,

            guardian.scores.rejection,

            guardian.scores.structure,

            guardian.scores.displacement,

            guardian.scores.fvg,

            guardian.scores.orderBlock,

            guardian.scores.premiumDiscount,

            guardian.scores.riskReward

        ].filter(Boolean).length;

        progress.textContent =
        completed + " / 8";

    }

        // Guardian Checklist

    const checks = {

        checkLiquidity:
        guardian.scores.liquidity,

        checkRejection:
        guardian.scores.rejection,

        checkStructure:
        guardian.scores.structure,

        checkDisplacement:
        guardian.scores.displacement,

        checkFVG:
        guardian.scores.fvg,

        checkOrderBlock:
        guardian.scores.orderBlock,

        checkPremium:
        guardian.scores.premiumDiscount,

        checkRR:
        guardian.scores.riskReward

    };

    for(const id in checks){

        const item =
        document.getElementById(id);

        if(!item){

            continue;

        }

        const label =
        item.textContent.replace(
            /^✅\s*|^⏳\s*/,
            ""
        );

        item.textContent =
        (checks[id] ? "✅ " : "⏳ ") +
        label;

    }

    // Update Liquidity Visualizer
    if(typeof updateLiquidityVisualizer === "function"){

        updateLiquidityVisualizer();

    }

    // Update Verdict Styling
    updateVerdictStyle();

}

// ---------------------------
// Reset Guardian
// ---------------------------

function resetGuardian(){

    guardian.liquidity = "Watching";

    guardian.bias = MarketBias.NEUTRAL;

    guardian.verdict = GuardianState.NO_TRADE;

    guardian.confidence = 0;

    guardian.fvg = {

        detected:false,

        type:"None",

        top:0,

        bottom:0

    };

    guardian.orderBlock = {

        detected:false,

        type:"None",

        high:0,

        low:0

    };

    guardian.premiumDiscount = {

        zone:"Equilibrium",

        midpoint:0

    };

    guardian.scores = {

        liquidity:false,

        rejection:false,

        structure:false,

        displacement:false,

        fvg:false,

        orderBlock:false,

        premiumDiscount:false,

        riskReward:false,

        news:true

    };

    updateGuardianDashboard();

}

// ---------------------------
// Liquidity Visualizer
// GG-036
// ---------------------------

function updateLiquidityVisualizer(){

    const buyStatus =
    document.getElementById("buyLiquidityStatus");

    const sellStatus =
    document.getElementById("sellLiquidityStatus");

    const buyCard =
    document.getElementById("buyLiquidityCard");

    const sellCard =
    document.getElementById("sellLiquidityCard");

    const buyTime =
    document.getElementById("buyLiquidityTime");

    const sellTime =
    document.getElementById("sellLiquidityTime");

    const summary =
    document.getElementById("liquiditySummary");

    if(
        !buyStatus ||
        !sellStatus ||
        !buyCard ||
        !sellCard
    ){
        return;
    }

    buyCard.classList.remove("liquidity-active");
    sellCard.classList.remove("liquidity-active");

    buyStatus.textContent = "Waiting...";
    sellStatus.textContent = "Waiting...";

    if(buyTime){
        buyTime.textContent = "No sweep detected";
    }

    if(sellTime){
        sellTime.textContent = "No sweep detected";
    }

    if(summary){
        summary.textContent =
        "Waiting for liquidity sweep...";
    }

    if(guardian.liquidity === "Asia Low Swept"){

        buyStatus.textContent = "Liquidity Taken";

        buyCard.classList.add("liquidity-active");

        if(buyTime){

            buyTime.textContent =
            "Detected: " +
            new Date().toLocaleTimeString();

        }

        if(summary){

            summary.textContent =
            "Sell-side liquidity has been taken. Guardian is watching for bullish confirmation.";

        }

    }

    if(guardian.liquidity === "Asia High Swept"){

        sellStatus.textContent = "Liquidity Taken";

        sellCard.classList.add("liquidity-active");

        if(sellTime){

            sellTime.textContent =
            "Detected: " +
            new Date().toLocaleTimeString();

        }

        if(summary){

            summary.textContent =
            "Buy-side liquidity has been taken. Guardian is watching for bearish confirmation.";

        }

    }

}

// ---------------------------
// Initialize Guardian
// ---------------------------

updateGuardianDashboard();
updateLiquidityVisualizer(); 

