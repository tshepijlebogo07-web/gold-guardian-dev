// ==========================================
// GOLD GUARDIAN
// Smart Order Block Engine
// GG-037 Package 7
// ==========================================

function detectOrderBlock(candles){

    guardian.orderBlock.detected = false;

    guardian.orderBlock.type = "None";

    guardian.scores.orderBlock = false;

    guardian.memory.orderBlockConfirmed = false;

    // --------------------------
    // Wait for FVG Confirmation
    // --------------------------

    if(

        !guardian.memory.active ||

        !guardian.memory.structureConfirmed ||

        !guardian.memory.fvgConfirmed

    ){

        return;

    }

    if(!candles || candles.length < 2){

        return;

    }

    const latest = candles[0];

    const previous = candles[1];

    // --------------------------
    // Bullish Order Block
    // --------------------------

    if(

        guardian.bias === MarketBias.BULLISH &&

        Number(previous.close) < Number(previous.open) &&

        Number(latest.close) > Number(previous.high)

    ){

        guardian.orderBlock.detected = true;

        guardian.orderBlock.type = "Bullish";

        guardian.orderBlock.high = Number(previous.high);

        guardian.orderBlock.low = Number(previous.low);

        guardian.scores.orderBlock = true;

        guardian.memory.orderBlockConfirmed = true;

        guardian.memory.confirmations++;

        updateConfidence();

        return;

    }

    // --------------------------
    // Bearish Order Block
    // --------------------------

    if(

        guardian.bias === MarketBias.BEARISH &&

        Number(previous.close) > Number(previous.open) &&

        Number(latest.close) < Number(previous.low)

    ){

        guardian.orderBlock.detected = true;

        guardian.orderBlock.type = "Bearish";

        guardian.orderBlock.high = Number(previous.high);

        guardian.orderBlock.low = Number(previous.low);

        guardian.scores.orderBlock = true;

        guardian.memory.orderBlockConfirmed = true;

        guardian.memory.confirmations++;

        updateConfidence();

        return;

    }

    guardian.memory.orderBlockConfirmed = false;

}