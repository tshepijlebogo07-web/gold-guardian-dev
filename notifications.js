// ==========================================
// GOLD GUARDIAN
// Smart Notification Engine
// GG-033
// Part 1/2
// ==========================================

// Prevent duplicate notifications

let notificationMemory = {

    asiaSweep:false,

    rejection:false,

    structure:false,

    fvg:false,

    orderBlock:false,

    buyReady:false,

    sellReady:false,

    session:false

};

// ----------------------------
// Request Permission
// ----------------------------

async function initializeNotifications(){

    if(!("Notification" in window)){

        console.log("Notifications unsupported.");

        return;

    }

    if(Notification.permission==="default"){

        await Notification.requestPermission();

    }

}

// ----------------------------
// Send Notification
// ----------------------------

function sendGuardianNotification(title, body, key){

    if(typeof Notification === "undefined"){

        return;

    }

    if(Notification.permission !== "granted"){

        return;

    }

    if(notificationMemory[key]){

        return;

    }

    notificationMemory[key] = true;

    try{

        new Notification(title,{

            body: body,

            icon: "icon-192.png",

            badge: "icon-192.png"

        });

    }

    catch(error){

        console.error(error);

    }

}

// ----------------------------
// Reset Notification Memory
// ----------------------------

function clearNotificationMemory(){

    notificationMemory = {

        asiaSweep:false,

        rejection:false,

        structure:false,

        fvg:false,

        orderBlock:false,

        buyReady:false,

        sellReady:false,

        session:false

    };

}

// ==========================================
// Smart Notification Sequence
// ==========================================

function updateGuardianNotifications(){

    if(

        guardian.scores.liquidity &&

        !notificationMemory.asiaSweep

    ){

        notificationMemory.asiaSweep = true;

        sendGuardianNotification(

            "💧 Liquidity Sweep",

            guardian.liquidity,

            "asiaSweep"

        );

    }

    if(

        guardian.scores.rejection &&

        !notificationMemory.rejection

    ){

        notificationMemory.rejection = true;

        sendGuardianNotification(

            "🕯 Rejection Confirmed",

            guardian.bias,

            "rejection"

        );

    }

    if(

        guardian.scores.structure &&

        !notificationMemory.structure

    ){

        notificationMemory.structure = true;

        sendGuardianNotification(

            "📈 Structure Shift",

            guardian.bias,

            "structure"

        );

    }

    if(

        guardian.scores.fvg &&

        !notificationMemory.fvg

    ){

        notificationMemory.fvg = true;

        sendGuardianNotification(

            "⚡ Fair Value Gap",

            guardian.fvg.type,

            "fvg"

        );

    }

    if(

        guardian.scores.orderBlock &&

        !notificationMemory.orderBlock

    ){

        notificationMemory.orderBlock = true;

        sendGuardianNotification(

            "🏦 Order Block",

            guardian.orderBlock.type,

            "orderBlock"

        );

    }

}