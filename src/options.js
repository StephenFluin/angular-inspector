// Saves options to chrome.storage
function save_options() {
  var optin = document.getElementById("optin").checked;
  chrome.storage.sync.set(
    {
      optin: optin
    },
    function() {
      // Update status to let user know options were saved.

      toast("Options saved.");
    }
  );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Loading options...
  chrome.storage.sync.get(
    {
      optin: false
    },
    function(items) {
      // processing loaded options from items
      document.getElementById("optin").checked = items.optin;
    }
  );
}

function toast(msg, time = 750) {
  let status = document.getElementById("status");
  status.textContent = msg;
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
