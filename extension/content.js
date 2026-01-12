const CHECK_INTERVAL = 5000; // 5s
const events = ['click', 'mousemove', 'keydown', 'scroll']

let contextTimeout = 60000; // The default is 1 minute
let lastInteraction = Date.now()
let contextCold = false;

chrome.storage.local.get(['contextTimeout'], (result) => {
    if (typeof result.contextTimeout === "number") {
        contextTimeout = result.contextTimeout;
    }
});

const showContextReminder = (context) => {
    console.log("context reminder time!", "Time: ", formatTimestampMMSS(Date.now(), 'America/New_York'));

    if (!context) return;

    const reminder = document.createElement("div");
    reminder.id = "context-reminder";
    reminder.innerHTML = `
        <button class="context-close" aria-label="Dismiss reminder">✕</button>
        <div class="context-label">You opened this tab because</div>
        <div class="context-text">${context}</div>
    `;


    chrome.storage.local.get(["reminderColor"], ({ reminderColor }) => {
        if (reminderColor) {
            reminder.style.background = reminderColor;
        }
    });

    // Close button logic
    reminder.querySelector(".context-close").onclick = () => {
        reminder.remove();
    };


    document.body.appendChild(reminder);

    setTimeout(() => {
        reminder.remove()
    }, 5000); // Remove the reminder after 5 seconds
}

// Update the last interaction time if user did something
const updateInteraction = () => {
    if (!contextCold) {
        lastInteraction = Date.now();
        return;
    }

    const tabUrl = window.location.href;

    chrome.storage.local.get([tabUrl], (result) => {
        const context = result[tabUrl];
        console.log("The context is: ", context, "Time: ", formatTimestampMMSS(Date.now(), 'America/New_York'));
        if (context) {
            showContextReminder(context);
            chrome.storage.local.remove([tabUrl]);
            contextCold = false;
        }
    });


    lastInteraction = Date.now();
}

// Add an event listener for each user event, which calls the callback function updateInteraction
events.forEach(event => {
    window.addEventListener(event, updateInteraction, { passive: true });
});

// Every 5 seconds, check if the length of time between now and between 
// the last interaction is greater then the contextTimeout threshold
setInterval(() => {
    const now = Date.now();

    if (!contextCold && now - lastInteraction > contextTimeout) {
        contextCold = true;
    }

}, CHECK_INTERVAL);

// Format a timestamp into MM:SS for a given timeZone (default: EST/America/New_York)
function formatTimestampMMSS(timestamp, timeZone = 'America/New_York') {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' });
}
