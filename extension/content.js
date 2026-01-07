const CHECK_INTERVAL = 5000; // 5s
const CONTEXT_TIMEOUT = 20000; // 20s
const events = ['click', 'mousemove', 'keydown', 'scroll']

let lastInteraction = Date.now()
let contextCold = false; 

// Update the last interaction time if user did something
const updateInteraction = () => {
    if(contextCold) {
        console.log("User has returned");
        contextCold = false;
    }
    lastInteraction = Date.now();
}

// Add an event listener for each user event, which calls the callback function updateInteraction
events.forEach(event => {
    window.addEventListener(event, updateInteraction, {passive : true});
});

// Every 5 seconds, check if the length of time between now and between 
// the last interaction is greater then the CONTEXT_TIMEOUT threshold
setInterval(() => {
    const now = Date.now();

    if(!contextCold && now - lastInteraction > CONTEXT_TIMEOUT) {
        contextCold = true;
        console.log("Context is now cold");
    }
}, CHECK_INTERVAL);
