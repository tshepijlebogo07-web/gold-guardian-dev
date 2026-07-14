// ==========================================
// GOLD GUARDIAN
// Smart Displacement Engine
// GG-037 Package 5
// ==========================================

function detectDisplacement(candles){

    guardian.scores.displacement = false;

    if(

        !guardian.memory.active ||

        !guardian.memory.structureConfirmed

    ){

        return;

    }

    if(!candles || candles.length < 2){

        return;

    }

    const latest = candles[0];

    const body =

        Math.abs(

            Number(latest.close) -

            Number(latest.open)

        );

    const range =

        Number(latest.high) -

        Number(latest.low);

    if(range <= 0){

        return;

    }

    const bodyRatio = body / range;

    if(bodyRatio >= 0.60){

        guardian.scores.displacement = true;

        guardian.memory.confirmations++;

        updateConfidence();

    }

}