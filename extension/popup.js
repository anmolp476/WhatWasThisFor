const input = document.getElementById("context-input");
const saveButton = document.getElementById("save-button");
const clearButton = document.getElementById("clear-button");
const statusElement = document.getElementById("status");

const getTheTabURL = () => {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0].url);
        });
    });
};

const saveContext = (tabUrl, context) => {
    return chrome.storage.local.set({ [tabUrl]: context });
}

saveButton.onclick = () => {
    const context = input.value;
    console.log(window.location.href)

    getTheTabURL().then((tabUrl) => {
        saveContext(tabUrl, context);

        statusElement.textContent = "Saved!";
        setTimeout(() => (statusElement.textContent = ""), 1000);
        window.close();
    });
};


// Clear context
clearButton.onclick = () => {
    console.log("Clearing input!! :)");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        input.value = "";
        statusElement.textContent = "Cleared!";
        setTimeout(() => (statusElement.textContent = ""), 1000);
    });
};