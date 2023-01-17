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
    // when pressing the button, fetch all mails
    const mails = await fetchAllMails(token);
    console.log("mails", mails);
    // second paramter is used for the email
    console.log("getMessagesByEmail", getMessagesByEmail(mails, "suiyichiro@hotmail.com"));

    // to delete a message from the second parameter
    // shouldn't work unless you have emails with this email in your mailbox
    const messagesToDelete = getMessagesByEmail(mails, "neppemailbox@gmail.com");
    console.log("messagesToDelete", messagesToDelete);
    await deleteMessages(token, messagesToDelete);

    // filter by date
    // in datefunctions, put: import { differenceInMonths } from 'date-fns'
    // filter will run the filter function of for every single date
    // DOES NOT WORK UNTIL YOU CAN INSTALL THE DATE-FNS PACKAGE SO IT'S COMMENTED OUT TO GET NO ERRORS

    // const isNotOlderThanTwoMonths = mails.filter((mail) => isNotOlderThanTwoMonths(mail.date));
    // const isBetweenTwoToSixMonthsOld = mails.filter((mail) =>
    //   isBetweenTwoToSixMonthsOld(mail.date)
    // );
    // const isBetweenSixToTwelveMonthsOld = mails.filter((mail) =>
    //   isBetweenSixToTwelveMonthsOld(mail.date)
    // );
    // const isBetweenOneToTwoYearsOld = mails.filter((mail) => isBetweenOneToTwoYearsOld(mail.date));
    // const isOlderThanTwoYears = mails.filter((mail) => isOlderThanTwoYears(mail.date));
    // ;

    // how you can use the reduceMails function in dateFunctions
    // const mailsBetweenTwoToSixMonthsOld = allMails.filter((mail) =>
    //   isBetweenTwoToSixMonthsOld(mail.date)
    // );
    //
    // const mailsBySenderCounted = reduceMails(mailsBetweenTwoToSixMonthsOld);
  });
};
