// to use the token outside of the window.onload function
let token;

// when I click on extension, this onload function runs
window.onload = function () {
  chrome.identity.getAuthToken({ interactive: true }, async function (accessToken) {
    token = accessToken;

    // fetch options
    const options = {
      method: "GET",
      headers: {
        // important to put in the token
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };

    // get current user's profile, save it in response
    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", options);
    const user = await response.json();
    const { emailAddress, historyId, messagesTotal, threadsTotal } = user;
  });

  document.getElementById("button").addEventListener("click", async function () {
    // where I put my code for my fetched data?
    const mails = await fetchAllMails(token);
    console.log("mails", mails);

    // to delete a message from the second parameter
    const messagesToDelete = getMessagesByEmail(mails, "neppemailbox@gmail.com");
    console.log("messagesToDelete", messagesToDelete);
    await deleteMessages(token, messagesToDelete);
  });
};
