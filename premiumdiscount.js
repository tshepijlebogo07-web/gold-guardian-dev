// ==========================================
// GOLD GUARDIAN
// Premium / Discount Engine
// GG-035 Part 3
// ==========================================

function detectPremiumDiscount(price){

    const high = Number(document.getElementById("asiaHigh").textContent);

    const low = Number(document.getElementById("asiaLow").textContent);

    if(isNaN(high) || isNaN(low)){

        return;

    }

    const midpoint = (high + low) / 2;

    guardian.premiumDiscount.midpoint = midpoint;

    guardian.scores.premiumDiscount = false;

    if(price > midpoint){

        guardian.premiumDiscount.zone = "Premium";

    }

    else if(price < midpoint){

        guardian.premiumDiscount.zone = "Discount";

    }

    else{

        guardian.premiumDiscount.zone = "Equilibrium";

    }

    // Smart Money confirmation

    if(

        guardian.bias === MarketBias.BULLISH &&

        guardian.premiumDiscount.zone === "Discount"

    ){

        guardian.scores.premiumDiscount = true;

    }

    if(

        guardian.bias === MarketBias.BEARISH &&

        guardian.premiumDiscount.zone === "Premium"

    ){

        guardian.scores.premiumDiscount = true;

    }

    updateConfidence();

}