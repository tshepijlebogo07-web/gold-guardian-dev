// ==========================================
// GOLD GUARDIAN
// Smart Fair Value Gap Engine
// GG-037 Package 6
// ==========================================

function detectFVG(candles){

    guardian.fvg.detected = false;

    guardian.fvg.type = "None";

    guardian.scores.fvg = false;

    // --------------------------
    // Wait for Structure
    // --------------------------

    if(

        !guardian.memory.active ||

        !guardian.memory.structureConfirmed ||

        !guardian.scores.displacement

    ){

        return;

    }

    if(!candles || candles.length < 3){

        return;

    }

    const latest = candles[0];

    const previous = candles[1];

    const third = candles[2];

    // --------------------------
    // Bullish FVG
    // --------------------------

    if(

        guardian.bias === MarketBias.BULLISH &&

        Number(latest.low) >

        Number(third.high)

    ){

        guardian.fvg.detected = true;

        guardian.fvg.type = "Bullish";

        guardian.fvg.top =

        Number(latest.low);

        guardian.fvg.bottom =

        Number(third.high);

        guardian.scores.fvg = true;
        
        guardian.memory.fvgConfirmed = true;

        guardian.memory.confirmations++;

        updateConfidence();

        return;

    }

    // --------------------------
    // Bearish FVG
    // --------------------------

    if(

        guardian.bias === MarketBias.BEARISH &&

        Number(latest.high) <

        Number(third.low)

    ){

        guardian.fvg.detected = true;

        guardian.fvg.type = "Bearish";

        guardian.fvg.top =

        Number(third.low);

        guardian.fvg.bottom =

        Number(latest.high);

        guardian.scores.fvg = true;
        
        guardian.memory.fvgConfirmed = true;

                guardian.memory.confirmations++;

        updateConfidence();

        return;

    }

    // --------------------------
    // No FVG Found
    // --------------------------

    guardian.memory.fvgConfirmed = false;

}