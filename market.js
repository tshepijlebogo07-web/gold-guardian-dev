// ==========================================
// GOLD GUARDIAN
// Market Engine
// Version 1.3.0
// GG-037 Package 5
// ==========================================

// --------------------------
// Session Memory Manager
// GG-037
// --------------------------

function resetGuardianMemory(){

    guardian.memory = {

        active:false,

        liquiditySide:null,

        sweepPrice:0,

        sweepTime:null,

        session:null,

        confirmations:0,

        tradeIssued:false,

        structureConfirmed:false

    };

    guardian.liquidity = "Watching";

    guardian.bias = MarketBias.NEUTRAL;

    guardian.scores.liquidity = false;

    logDebug("Guardian memory reset.");

}

function analyzeMarket(candles, asiaHighValue, asiaLowValue){

    // --------------------------
    // Reset Dynamic State
    // --------------------------

    guardian.verdict = GuardianState.NO_TRADE;

    guardian.confidence = 0;

    if(!guardian.memory.active){

        guardian.liquidity = "Watching";

        guardian.bias = MarketBias.NEUTRAL;

    }

    guardian.scores.liquidity = false;

    guardian.scores.rejection = false;

    guardian.scores.structure = false;

    guardian.scores.displacement = false;

    guardian.scores.riskReward = false;

    if(!candles || candles.length < 3){

        updateLiquidityVisualizer();

        updateGuardianDashboard();

        return;

    }

    // --------------------------
    // Check Last 3 Candles
    // --------------------------

    let asiaHighSwept = false;

    let asiaLowSwept = false;

    for(let i = 0; i < 3; i++){

        const candle = candles[i];

        if(Number(candle.high) > asiaHighValue){

            asiaHighSwept = true;

        }

        if(Number(candle.low) < asiaLowValue){

            asiaLowSwept = true;

        }

    }

    // --------------------------
    // Determine Liquidity
    // --------------------------

    if(

        asiaLowSwept &&

        (

            !guardian.memory.active ||

            guardian.memory.liquiditySide === "SELL"

        )

    ){

        guardian.liquidity = "Asia Low Swept";

        guardian.bias = MarketBias.BULLISH;

        guardian.scores.liquidity = true;

        guardian.memory.active = true;

        guardian.memory.liquiditySide = "BUY";

        guardian.memory.sweepPrice = asiaLowValue;

        guardian.memory.sweepTime = Date.now();

        guardian.memory.session = currentSession.textContent;

        guardian.memory.confirmations = 0;

        guardian.memory.tradeIssued = false;

        guardian.memory.structureConfirmed = false;

    }

    else if(

        asiaHighSwept &&

        (

            !guardian.memory.active ||

            guardian.memory.liquiditySide === "BUY"

        )

    ){

        guardian.liquidity = "Asia High Swept";

        guardian.bias = MarketBias.BEARISH;

        guardian.scores.liquidity = true;

        guardian.memory.active = true;

        guardian.memory.liquiditySide = "SELL";

        guardian.memory.sweepPrice = asiaHighValue;

        guardian.memory.sweepTime = Date.now();

        guardian.memory.session = currentSession.textContent;

        guardian.memory.confirmations = 0;

        guardian.memory.tradeIssued = false;

        guardian.memory.structureConfirmed = false;

    }

    updateConfidence();

    // --------------------------
    // Smart Money Analysis Chain
    // --------------------------

    detectStructureShift(candles);

    detectDisplacement(candles);

    detectFVG(candles);

    detectOrderBlock(candles);

    detectPremiumDiscount(

        Number(candles[0].close)

    );

    confirmTradeSetup();

    updateGuardianNotifications();

    generateTradePlan(

        Number(candles[0].close),

        candles

    );

    // --------------------------

    updateLiquidityVisualizer();

    updateGuardianDashboard();

}