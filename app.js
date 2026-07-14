// ==========================================
// GOLD GUARDIAN
// Version 0.5.0
// ==========================================

// ---------------------------
// API CONFIGURATION
// ---------------------------

const API_KEY = CONFIG.apiKey;
const SYMBOL = CONFIG.symbol;

logDebug("Configuration Loaded");

// ---------------------------
// SESSION HOURS
// ---------------------------

const ASIA_START = 0;
const ASIA_END = 8;

const LONDON_START = 8;
const LONDON_END = 13;

const NEWYORK_START = 13;
const NEWYORK_END = 22;

// ---------------------------
// HTML ELEMENTS
// ---------------------------

const liveTime = document.getElementById("liveTime");

const currentSession = document.getElementById("currentSession");

const goldPrice = document.getElementById("goldPrice");

const asiaHigh = document.getElementById("asiaHigh");

const asiaLow = document.getElementById("asiaLow");

const confidence = document.getElementById("confidence");

const guardianVerdict = document.getElementById("guardianVerdict");

const londonCountdown = document.getElementById("londonCountdown");

const newYorkCountdown = document.getElementById("newYorkCountdown");

// ---------------------------
// LIVE CLOCK
// ---------------------------

function updateClock(){

    const now = new Date();

    liveTime.textContent =
    now.toLocaleTimeString();

}

updateClock();

logDebug("Clock Started");

setInterval(updateClock,1000);

// ---------------------------
// SESSION DETECTION
// ---------------------------

let previousSession = "";

function updateSession(){

    const hour = new Date().getHours();

    let session = "Closed";

    if(hour >= ASIA_START && hour < ASIA_END){

        session = "Asia";

    }

    else if(hour >= LONDON_START && hour < LONDON_END){

        session = "London";

    }

    else if(hour >= NEWYORK_START && hour < NEWYORK_END){

        session = "New York";

    }

    currentSession.textContent = session;

    if(session !== previousSession){

        previousSession = session;

        clearNotificationMemory();

        sendGuardianNotification(

        "🕒 Session Started",

        session + " Session",

        session

        );
    }

}

updateSession();

logDebug("Session Started");

setInterval(updateSession,60000);

// ---------------------------
// COUNTDOWN FORMATTER
// ---------------------------

function formatCountdown(seconds){

    if(seconds < 0){

        seconds = 0;

    }

    const hrs =
    Math.floor(seconds/3600);

    const mins =
    Math.floor((seconds%3600)/60);

    const secs =
    seconds%60;

    return String(hrs).padStart(2,"0")
    + ":"
    + String(mins).padStart(2,"0")
    + ":"
    + String(secs).padStart(2,"0");

}
// ---------------------------
// SESSION COUNTDOWNS
// ---------------------------

function updateCountdowns(){

    const now = new Date();

    const london = new Date(now);

    london.setHours(8,0,0,0);

    if(now >= london){

        london.setDate(
        london.getDate()+1);

    }

    const newYork =
    new Date(now);

    newYork.setHours(13,0,0,0);

    if(now >= newYork){

        newYork.setDate(
        newYork.getDate()+1);

    }

    const londonSeconds =
    Math.floor((london-now)/1000);

    const newYorkSeconds =
    Math.floor((newYork-now)/1000);

    londonCountdown.textContent =
    formatCountdown(londonSeconds);

    newYorkCountdown.textContent =
    formatCountdown(newYorkSeconds);

}

updateCountdowns();

logDebug("Countdown Started");

setInterval(updateCountdowns,1000);

// ---------------------------
// MARKET DATA ENGINE
// ---------------------------

async function updateMarketData(){

    try{

        // ---------------------------
        // NEWS FILTER
        // ---------------------------

        checkEconomicNews();

        if(!tradingAllowed()){

            goldPrice.textContent = "Paused";

            return;

        }

        const response = await fetch(
`https://api.twelvedata.com/time_series?symbol=${CONFIG.symbol}&interval=${CONFIG.interval}&outputsize=${CONFIG.outputSize}&apikey=${CONFIG.apiKey}`
        );

        if(!response.ok){

            throw new Error("HTTP " + response.status);

        }

        const data = await response.json();

        console.log("TWELVE DATA RESPONSE:", data);

        if(data.status === "error"){

            goldPrice.textContent = data.message;

            console.error(data);

            logDebug(data.message, false);

            return;

        }

        if(!data.values || data.values.length === 0){

            goldPrice.textContent = "No Data";

            console.error(data);

            logDebug("No candle data received.", false);

            return;

        }

        const candles = data.values;

        const latest = candles[0];

        goldPrice.textContent =
        "$ " + Number(latest.close).toFixed(2);

const currentPrice =
Number(latest.close);

const distanceHigh =
document.getElementById("distanceHigh");

const distanceLow =
document.getElementById("distanceLow");

const highValue =
Number(asiaHigh.textContent);

const lowValue =
Number(asiaLow.textContent);

if(distanceHigh && !isNaN(highValue)){

distanceHigh.textContent =
(highValue-currentPrice).toFixed(2);

}

if(distanceLow && !isNaN(lowValue)){

distanceLow.textContent =
(currentPrice-lowValue).toFixed(2);

}

const asiaSignal =
document.getElementById("asiaSignal");

if(asiaSignal){

    const range = highValue - lowValue;

    const buyZone =
    lowValue + (range * 0.25);

    const sellZone =
    highValue - (range * 0.25);

    if(currentPrice <= buyZone){

        asiaSignal.textContent =
        "🟢 Near Asia Low (BUY ZONE)";

    }

    else if(currentPrice >= sellZone){

        asiaSignal.textContent =
        "🔴 Near Asia High (SELL ZONE)";

    }

    else{

        asiaSignal.textContent =
        "🟡 Mid Range (WAIT)";

    }

}
        calculateAsiaRange(candles);

        analyzeMarket(

            candles,

            Number(asiaHigh.textContent),

            Number(asiaLow.textContent)

        );

        evaluateSetup(

            candles,

            Number(asiaHigh.textContent),

            Number(asiaLow.textContent)

        );

        detectStructureShift(candles);

detectFVG(candles);

detectOrderBlock(candles);

detectPremiumDiscount(

    Number(latest.close)

);

// confirmTradeSetup();

// updateGuardianNotifications();

generateTradePlan(

    Number(latest.close),

    candles

);

        logDebug("Market data updated.");

    }

    catch(error){

        goldPrice.textContent = "Offline";

        logDebug(error.message, false);

        console.error(error);

    }

}

// ---------------------------
// ASIA RANGE ENGINE
// ---------------------------

function calculateAsiaRange(candles){

    let high = -Infinity;

    let low = Infinity;

    candles.forEach(candle=>{

        const candleTime =
        new Date(candle.datetime);

        const hour =
        candleTime.getHours();

        if(hour >= ASIA_START && hour < ASIA_END){

            const candleHigh =
            Number(candle.high);

            const candleLow =
            Number(candle.low);

            if(candleHigh > high){

                high = candleHigh;

            }

            if(candleLow < low){

                low = candleLow;

            }

        }

    });

    if(high !== -Infinity){

        asiaHigh.textContent =
        high.toFixed(2);
        
        const asiaHighVisual =
document.getElementById("asiaHighVisual");

if(asiaHighVisual){

    asiaHighVisual.textContent =
    high.toFixed(2);

}

    }

    if(low !== Infinity){

        asiaLow.textContent =
        low.toFixed(2);
        
        const asiaLowVisual =
document.getElementById("asiaLowVisual");

if(asiaLowVisual){

    asiaLowVisual.textContent =
    low.toFixed(2);

}

const rangeSize =
(high-low).toFixed(2);

const range =
document.getElementById("asiaRangeSize");

if(range){

range.textContent =
rangeSize;

}

    }

}

// ---------------------------
// GUARDIAN DEFAULT STATE
// ---------------------------

function initializeGuardian(){

    confidence.textContent = "0%";

    guardianVerdict.textContent = "NO TRADE";

}

// ---------------------------
// TradingView Chart
// GG-036
// ---------------------------

function initializeTradingView(){

    if(typeof TradingView === "undefined"){

        logDebug("TradingView library not loaded.", false);

        return;

    }

    new TradingView.widget({

        container_id: "tradingviewChart",

        autosize: true,

        symbol: "OANDA:XAUUSD",

        interval: "5",

        timezone: "Africa/Johannesburg",

        theme: "dark",

        style: "1",

        locale: "en",

        toolbar_bg: "#111111",

        enable_publishing: false,

        hide_top_toolbar: false,

        hide_legend: false,

        allow_symbol_change: false,

        save_image: false,

        studies: []

    });

    logDebug("TradingView Chart Loaded");

}

// ---------------------------
// START ENGINES
// ---------------------------

initializeGuardian();

updateMarketData();

logDebug("Market Engine Started");

setInterval(updateMarketData, CONFIG.refreshRate);

initializeTradingView();

initializeNotifications();