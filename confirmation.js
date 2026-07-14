// ==========================================
// GOLD GUARDIAN
// Final Signal Orchestrator
// GG-037 Final
// ==========================================

function confirmTradeSetup(){

    // --------------------------
    // No Active Sweep
    // --------------------------

    if(!guardian.memory.active){

        guardian.verdict = GuardianState.NO_TRADE;

        updateGuardianDashboard();

        return;

    }

    // --------------------------
    // Prevent Duplicate Signals
    // --------------------------

    if(guardian.memory.tradeIssued){

        return;

    }

    // --------------------------
    // Count Confirmations
    // --------------------------

    let confirmations = 0;

    if(guardian.scores.liquidity) confirmations++;

    if(guardian.scores.rejection) confirmations++;

    if(guardian.scores.structure) confirmations++;

    if(guardian.scores.displacement) confirmations++;

    if(guardian.memory.fvgConfirmed) confirmations++;

    if(guardian.memory.orderBlockConfirmed) confirmations++;

    if(guardian.scores.premiumDiscount) confirmations++;

    if(guardian.scores.riskReward) confirmations++;

    guardian.memory.confirmations = confirmations;

    // --------------------------
    // Waiting...
    // --------------------------

    if(confirmations < 8){

        guardian.verdict = GuardianState.WATCHING;

        updateGuardianDashboard();

        return;

    }

    // --------------------------
    // BUY
    // --------------------------

    if(guardian.bias === MarketBias.BULLISH){

        guardian.verdict = GuardianState.BUY_READY;

    }

    // --------------------------
    // SELL
    // --------------------------

    else if(guardian.bias === MarketBias.BEARISH){

        guardian.verdict = GuardianState.SELL_READY;

    }

    guardian.memory.tradeIssued = true;

    updateConfidence();

    updateGuardianDashboard();

}