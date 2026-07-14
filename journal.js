// ==========================================
// GOLD GUARDIAN
// JOURNAL ENGINE
// GG-030
// PART 1 OF 2
// ==========================================

const STORAGE_KEY = "goldGuardianJournal";

// ------------------------------------------
// Load Journal
// ------------------------------------------

function getJournal(){

    return JSON.parse(

        localStorage.getItem(STORAGE_KEY)

    ) || [];

}

// ------------------------------------------
// Save Journal
// ------------------------------------------

function saveJournal(journal){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(journal)

    );

}

// ------------------------------------------
// Add Trade
// ------------------------------------------

function addTrade(trade){

    const journal = getJournal();

    trade.result = "Pending";

    journal.unshift(trade);

    saveJournal(journal);

    renderJournal();

    updateStatistics();

}

// ------------------------------------------
// Delete Trade
// ------------------------------------------

function deleteTrade(index){

    const journal = getJournal();

    journal.splice(index,1);

    saveJournal(journal);

    renderJournal();

    updateStatistics();

}

// ------------------------------------------
// Update Result
// ------------------------------------------

function updateTradeResult(index,result){

    const journal = getJournal();

    journal[index].result = result;

    saveJournal(journal);

    renderJournal();

    updateStatistics();

}

// ------------------------------------------
// Render Journal
// ------------------------------------------

function renderJournal(){

    const container =

    document.getElementById("journalContainer");

    if(!container){

        return;

    }

    const journal = getJournal();

    if(journal.length===0){

        container.innerHTML =

        "<p>No trades recorded yet.</p>";

        return;

    }

    let html = "";

    journal.forEach((trade,index)=>{

        html += `

<div class="journalTrade">

<strong>${trade.type}</strong><br>

${trade.date}<br><br>

Entry:
${trade.entry}<br>

SL:
${trade.stopLoss}<br>

TP1:
${trade.tp1}<br>

RR:
${trade.rr}<br>

Confidence:
${trade.confidence}%<br><br>

Result:

<strong>${trade.result}</strong><br><br>

<button onclick="updateTradeResult(${index},'Win')">

🟢 WIN

</button>

<button onclick="updateTradeResult(${index},'Loss')">

🔴 LOSS

</button>

<button onclick="updateTradeResult(${index},'Breakeven')">

🟡 BE

</button>

<button onclick="deleteTrade(${index})">

🗑 DELETE

</button>

<hr>

</div>

`;

    });

    container.innerHTML = html;

}

// ------------------------------------------
// Update Statistics
// ------------------------------------------

function updateStatistics(){

    const journal = getJournal();

    let total = journal.length;

    let buys = 0;

    let sells = 0;

    let wins = 0;

    let losses = 0;

    let breakevens = 0;

    let confidence = 0;

    let rr = 0;

    journal.forEach(trade=>{

        if(trade.type==="BUY READY"){

            buys++;

        }

        if(trade.type==="SELL READY"){

            sells++;

        }

        if(trade.result==="Win"){

            wins++;

        }

        if(trade.result==="Loss"){

            losses++;

        }

        if(trade.result==="Breakeven"){

            breakevens++;

        }

        confidence += Number(trade.confidence)||0;

        rr += Number(trade.rr)||0;

    });

    document.getElementById("totalSignals").textContent =
    total;

    document.getElementById("buySignals").textContent =
    buys;

    document.getElementById("sellSignals").textContent =
    sells;

    document.getElementById("averageConfidence").textContent =
    total
    ? (confidence/total).toFixed(1)+"%"
    : "0%";

    document.getElementById("averageRR").textContent =
    total
    ? (rr/total).toFixed(2)
    : "0";

}

// ------------------------------------------
// Clear Journal
// ------------------------------------------

function clearJournal(){

    if(!confirm("Delete all journal entries?")){

        return;

    }

    localStorage.removeItem(STORAGE_KEY);

    renderJournal();

    updateStatistics();

}

// ------------------------------------------
// Initialize
// ------------------------------------------

renderJournal();

updateStatistics();