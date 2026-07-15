// ==========================================
// GOLD GUARDIAN
// Structure Engine
// GG-025
// ==========================================

function detectStructureShift(candles){

if(!guardian.memory.active){

    guardian.scores.structure = false;

    return;

}

    if(!candles || candles.length < 2){

        return;

    }

    const latest = candles[0];

    const previous = candles[1];

    const latestOpen = Number(latest.open);
    const latestClose = Number(latest.close);
    const latestHigh = Number(latest.high);
    const latestLow = Number(latest.low);

    const previousHigh = Number(previous.high);
    const previousLow = Number(previous.low);

    const body = Math.abs(latestClose - latestOpen);
    const range = latestHigh - latestLow;

    const bodyPercentage =
        range > 0 ? body / range : 0;

    const displacement =
        bodyPercentage >= 0.60;

    // --------------------------
    // BUY READY
    // --------------------------

    if(

        guardian.verdict === GuardianState.WATCHING &&

        guardian.bias === MarketBias.BULLISH &&

        latestClose > previousHigh &&

        displacement

    ){

        guardian.scores.structure = true;
        
        guardian.memory.structureConfirmed = true;

guardian.memory.confirmations++;

updateConfidence();

        guardian.verdict = GuardianState.BUY_READY;

// Wait for Trade Plan Engine
// before saving signal

updateGuardianDashboard();

    }

    // --------------------------
    // SELL READY
    // --------------------------

    if(

        guardian.verdict === GuardianState.WATCHING &&

        guardian.bias === MarketBias.BEARISH &&

        latestClose < previousLow &&

        displacement

    ){

        guardian.scores.structure = true;

updateConfidence();

        guardian.verdict = GuardianState.SELL_READY;

// Wait for Trade Plan Engine
// before saving signal

updateGuardianDashboard();

    }