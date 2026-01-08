const CHECK_INTERVAL = 5000; // 5s
const CONTEXT_TIMEOUT = 20000; // 20s
const events = ['click', 'mousemove', 'keydown', 'scroll']

let lastInteraction = Date.now()
let contextCold = false;
let hasPromptedForContext = false;

const showContextPrompt = () => {
    const bar = document.createElement('div');
    bar.id = "context-bar";

    bar.innerHTML = `
        <span>Why did you open this tab?</span>
        <input type="text" placeholder="Enter your context here..."/>
        <button>Save</button>
        <button id="skip">Skip</button>
        `;

    document.body.prepend(bar);

    const input = bar.querySelector('input');
    const save = bar.querySelector('button');
    const skip = bar.querySelector('#skip');

    save.onclick = () => {
        sessionStorage.setItem('tabContext', input.value);
        bar.remove();
    }

    skip.onclick = (e) => {
        e.preventDefault(); // This is so that the page doesn't jump to the top
        sessionStorage.removeItem('tabContext');
        bar.remove();
    }
}

const showContextReminder = () => {
    const context = sessionStorage.getItem('tabContext');

    if (!context) return;

    const reminder = document.createElement("div");
    reminder.id = "context-reminder";
    reminder.textContent = `You opened this tab because: "${context}"`;

    document.body.appendChild(reminder);

    setTimeout(() => {
        reminder.remove()
        sessionStorage.removeItem('tabContext');
        hasPromptedForContext = false;
    }, 5000); // Remove the reminder after 5 seconds
}

// Update the last interaction time if user did something
const updateInteraction = () => {
    if (!hasPromptedForContext && !sessionStorage.getItem('tabContext')) {
        console.log("Prompted for context");
        showContextPrompt();
        hasPromptedForContext = true;
    }

    let shouldShowContextReminder = contextCold && document.getElementById('context-bar') === null && sessionStorage.getItem('tabContext')

    if (shouldShowContextReminder) {
        console.log("context is cold,");
        showContextReminder();
        contextCold = false;
    }

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
