const input = document.getElementById('context-input');
const saveButton = document.getElementById('save-button');
const clearButton = document.getElementById('clear-button');
const statusElement = document.getElementById('status');

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
        {
            target: { tabId: tabs[0].id },
            function: () => sessionStorage.getItem('tabContext'),
        },
        (results) => {
            if (results?.[0]?.result) {
                input.value = results[0].result;
            }
        }
    );
});

saveButton.onclick = () => {
    const context = input.value;
    chrome.storage.local.set({ [window.location.href]: context }, () => {
        statusElement.textContent = "Saved!";
        setTimeout(() => (statusElement.textContent = ""), 800);
        window.close();
    });
};


// Clear context
clearButton.onclick = () => {
    console.log("Clearing context...");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => sessionStorage.removeItem("tabContext"),
        });
        input.value = "";
        statusElement.textContent = "Cleared!";
        setTimeout(() => (statusElement.textContent = ""), 800);
    });
};