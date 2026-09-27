const optin = document.getElementById('optin') as HTMLInputElement;
const statusEl = document.getElementById('status')!;

chrome.storage.sync.get({ optin: false }).then((items) => {
    optin.checked = Boolean(items.optin);
});

optin.addEventListener('change', async () => {
    await chrome.storage.sync.set({ optin: optin.checked });
    statusEl.textContent = `Saved. Anonymous reporting is ${optin.checked ? 'on' : 'off'}.`;
});
