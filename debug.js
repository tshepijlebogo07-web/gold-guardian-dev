// ==========================================
// GOLD GUARDIAN
// Debug Console
// GG-034.6
// ==========================================

function logDebug(message, success = true){

    const consoleBox =
    document.getElementById("debugConsole");

    if(!consoleBox){

        return;

    }

    const line =
    document.createElement("p");

    line.textContent =
    (success ? "✅ " : "❌ ") + message;

    consoleBox.appendChild(line);

}

window.onerror = function(message, source, line, column, error){

    logDebug("ERROR: " + message, false);

    logDebug("Source: " + source, false);

    logDebug("Line: " + line, false);

    logDebug("Column: " + column, false);

    console.error(message, source, line, column, error);

};

window.addEventListener("unhandledrejection", function(event){

    logDebug("PROMISE ERROR: " + event.reason, false);

    console.error(event.reason);

});