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
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                function: (context) => sessionStorage.setItem('tabContext', context),
                args: [context],
            });
        statusElement.textContent = 'Context saved!';
        setTimeout(() => (statusElement.textContent = ''), 800);
    });
}

// Clear context
clearBtn.onclick = () => {
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