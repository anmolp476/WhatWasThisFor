const CHECK_INTERVAL = 5000; // 5s
const CONTEXT_TIMEOUT = 20000; // 20s
const events = ['click', 'mousemove', 'keydown', 'scroll']

let lastInteraction = Date.now()
let contextCold = false;

const showContextReminder = (context) => {
    console.log("context reminder time!");

    if (!context) return;

    const reminder = document.createElement("div");
    reminder.id = "context-reminder";
    reminder.textContent = `You opened this tab because: "${context}"`;

    document.body.appendChild(reminder);

    setTimeout(() => {
        reminder.remove()
    }, 5000); // Remove the reminder after 5 seconds
}

// Update the last interaction time if user did something
const updateInteraction = () => {
    const tabUrl = window.location.href;

    chrome.storage.local.get([tabUrl], (result) => {
        const context = result[tabUrl];
        console.log("The context is: ", context);
        if (context && contextCold) {
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
// the last interaction is greater then the CONTEXT_TIMEOUT threshold
setInterval(() => {
    const now = Date.now();

    if (!contextCold && now - lastInteraction > CONTEXT_TIMEOUT) {
        contextCold = true;
    }
}, CHECK_INTERVAL);
