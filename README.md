# Live demo

Here's the link to the live demo: https://green-g-chrome-extension-smoky.vercel.app/

# Installation

1. First you make sure you're following [this quickstart](https://developers.google.com/gmail/api/quickstart/js#python-2.x) to set up the gmail API
2. Create a client ID for web client & an API key (it's a google extension concept, but for our school project, we're making it a web application)
3. Make sure you have in your google cloud platform, the following domain URI's added for the client ID, if you're running it locally: `http://localhost` & `http://localhost:5173`
4. You clone this repository with `git clone https://github.com/svennijhuis/Green-G-Chrome-Extension.git`
5. Type in the terminal of the project folder `npm i` or `npm install` to install all dependencies.
6. Add an `.env` file to the root of the project and add the following env variables: `VITE_CLIENT_ID=` and `VITE_API_KEY=`
7. Copy the values of your Client ID & API key from your google cloud platform project and paste those in the `.env` file
8. To run the application, Type in the terminal `npm run dev`

# Libraries & Frameworks

We used the following libraries & frameworks. You can read more about this on our wiki.

- Vite
- React
- D3.js
- LottieFiles
- Lodash
- Date-fns
- Javascript Cookie
- JWT Decode
- Tailwind
- Sass

# Fectching data & data transformation

For this, I'll be talking about it per functionality. You can also read about this in the wiki. We have only fetched data that we needed to use in the front-end of this product.

## Fetching all the emails & data transformation

First I made a function to fetch all the emails. Because it can only return (by default 100) a max. amount of 500 mails at a time, I'm using a page token which refers to the next page of your mailbox.

In this function I also transformed the data of the fetched emails. I basically put all the data that I needed in an object, which includes the following data of each mail: id, subject, date, sender, name, email, snippet, size in mb and size in grams of Co2. I want to note that to seperate the sender name and sender email, I used [regex](https://regexr.com/).

The code I wrote for this part is as following:

```

async function fetchAllMails(token) {
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };

  let pageToken = null;
  let allMessages = [];
  // do-while runs at least once. as long as the condition (while) is true then it runs again
  do {
    // if you have more than 500 mails, you have a pageToken in the response, which points to the next page of emails
    // if you include the pageToken as query parameter, you get the next page of mails
    // this page can have another next page and that page can have another next page (loop)
    // if you have a page token, then include pageToken query parameter (?pageToken=value) for the next request
    const includeToken = pageToken ? `&pageToken=${pageToken}` : "";
    const response = await fetch(
      // query parameter with maxResult of 500 to list more messages (500)
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=500${includeToken}`,
      options
    );
    const responseData = await response.json();
    // messages property is from the response object
    const { messages } = responseData;
    // put all messages of all pages with concat into the array of allMessages, without concat, you don't get all pages of messages
    // concat puts two things together, like arrays in this case
    allMessages = allMessages.concat(messages);
    // optional chaining operator (?.) is for when a property in object does not exist, don't give me an error and return undefined
    // if I have a pagetoken, save it, otherwise it's undefined (nextPageToken CAN be a property of responseData if it exists)
    pageToken = responseData?.nextPageToken;
  } while (pageToken);

  // transform every single message.
  allMessages = await Promise.all(
    allMessages.map(async function (message) {
      // for every single message, we want to take out the id and use it to fetch all the data about the message
      const { id } = message;
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`,
        options
      );
      // I want the content of the response in the variable responseData, which gives me snippet, payload and sizeEstimate
      const responseData = await response.json();
      // Snippet is a short text of the message content
      // Size estimate is the message size in bytes
      // Payload contains the headers which contain subject and sender
      const { payload, snippet, sizeEstimate } = responseData;
      // with find(), I can find something in an array
      // if no headers, give no error with ?
      // I need from the headers in payload with { name = Subject, value = xyz} the value:
      console.log("payload", payload);
      const subject = payload?.headers.find(function (header) {
        return header.name === "Subject";
      })?.value;
      // I also need the date, and turn this string into a date
      const date = new Date(
        payload?.headers.find(function (header) {
          return header.name === "Date";
        })?.value
      );
      // if no headers, give no error with ?
      // from returns "sender" and <email>, so I want to fix that later with regex
      const from = payload?.headers.find(function (header) {
        return header.name === "From";
      })?.value;
      const sizeInMegabytes = parseFloat(sizeEstimate / 1024 / 1024).toFixed(2);
      console.log("sizeInMegabytes", sizeInMegabytes);
      // from consists out of sender name and email
      // regex, / / is the structure, () is for groups, .* means there can be more than a singular character, <> tells me the position of the mail that I dont want in the email group but it matches, gm is match at start of the match with multi-line
      // source: https://regex101.com/
      const senderRegex = /(.*) <(.*)>/gm;
      // destructuring the result of the matchAll with the senderRegex, but I only want the name and email later
      const [result] = [...from.matchAll(senderRegex)]; // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
      const [match, name, email] = result;
      // const sizeInKilogramsOfCo2 = ((sizeInMegabytes / 1048576) * 2.26) / 1000;
      const sizeInGramsOfCo2 = sizeInMegabytes * 20;

      return {
        id,
        subject,
        date,
        sender: {
          name,
          email,
        },
        snippet,
        sizeInMegabytes,
        sizeInGramsOfCo2,
      };
    })
  );

  // messages returns [{ id: string; threadId: string; }]
  return allMessages;
}

```

## Getting all the emails from all senders

For this function, I wanted to filter all the mails by email. This is for grouping mails with the same email, which can be shown in the front-end. I specifically chose for email and not the sender's name, because the sender's name COULD be the same as a different sender's name, meanwhile the email adress is unique, however the name of the sender is used in the fron-end, because it's just more practical and more readable.

The code I wrote for this part is as following:

```

function getMessagesByEmail(messages, email) {
  // used email, because the email is unique, the name could be anything
  const filteredMessages = messages.filter((message) => message.sender.email === email);
  console.log(filteredMessages[0]);
  return filteredMessages;
  // show in front-end the name
  // when calling the function, use the first parameter for allMessages
}

```

## Delete emails

For this delete function, we used batchDelete to send less requests for deleting emails.So when you're deleting a group of mails, it will send 1 request.

The code I wrote for this part is as following:

```

async function deleteMessages(token, messages) {
  // return id's of messages
  const ids = messages.map((message) => message.id);
  await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/batchDelete", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    // sending all the ids of all the messages I want to delete into ids
    body: JSON.stringify({
      ids,
    }),
  });
}

```

## Filter emails on date

For filtering the emails, I used date-fns to make my life easier. This is so I'm able to use "differenceInMonths" from date-fns. During the design process, we had ideas to filter for example from 2 to 6 months and then from 6 to 12 months. While making this, I realized that the 6 caused for quite some confusion, so I tried my best to just understand it as good as I could. Basically all I'm doing is comparing the months and using date from the mails as input, to filter the mails.

I also wrote a reduce function so that it can count how many emails match the date interval.

The code I wrote for this part is as following:

```

import { differenceInMonths } from "date-fns";

function isNotOlderThanTwoMonths(date) {
  // new Date, gives you the date of right now
  const now = new Date();
  const difference = differenceInMonths(now, date);
  // && both needs to be true, to return true
  return difference >= 0 && difference <= 1;
}

function isBetweenTwoToSixMonthsOld(date) {
  const now = new Date();
  const difference = differenceInMonths(now, date);
  // && both needs to be true, to return true
  return difference >= 2 && difference <= 5;
}

function isBetweenSixToTwelveMonthsOld(date) {
  const now = new Date();
  const difference = differenceInMonths(now, date);
  // && both needs to be true, to return true
  return difference >= 6 && difference <= 11;
}

function isBetweenOneToTwoYearsOld(date) {
  const now = new Date();
  const difference = differenceInMonths(now, date);
  // && both needs to be true, to return true
  return difference >= 12 && difference <= 23;
}

function isOlderThanTwoYears(date) {
  const now = new Date();
  const difference = differenceInMonths(now, date);
  // more than 2 years
  return difference >= 24;
}

// to reduce the filtered emails
function reduceMails(mails) {
  return mails.reduce((accumulator, currentValue) => {
    const name = currentValue.sender.name;
    const index = accumulator.findIndex((o) => o.name === name);

    // Sender is not in the accumulator yet
    if (index === -1) {
      accumulator.push({ name, count: 1 });
    } else {
      accumulator[index].count = accumulator[index].count + 1;
    }

    return accumulator;
  }, []);
}

```

## Testing the functions

I also had to test my functions, so I put everything in one function, however during this process I did continuously commented things out, just to try out different stuff without getting irrelevant errors of things I wasn't testing with. This was just to make sure that everything was working. As you can see, I have most things not commented out, which normally would definitely give errors, but I'm just showing this to show I worked.

```

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
    console.log("getMessagesByEmail", getMessagesByEmail(mails, "random@email.com"));

    // to delete a message from the second parameter
    // shouldn't work unless you have emails with this email in your mailbox
    const messagesToDelete = getMessagesByEmail(mails, "neppemailbox@gmail.com");
    console.log("messagesToDelete", messagesToDelete);
    await deleteMessages(token, messagesToDelete);

    // filter by date
    // in datefunctions, put: import { differenceInMonths } from 'date-fns'

    const isNotOlderThanTwoMonths = mails.filter((mail) => isNotOlderThanTwoMonths(mail.date));
    const isBetweenTwoToSixMonthsOld = mails.filter((mail) =>
      isBetweenTwoToSixMonthsOld(mail.date)
    );
    const isBetweenSixToTwelveMonthsOld = mails.filter((mail) =>
      isBetweenSixToTwelveMonthsOld(mail.date)
    );
    const isBetweenOneToTwoYearsOld = mails.filter((mail) => isBetweenOneToTwoYearsOld(mail.date));
    const isOlderThanTwoYears = mails.filter((mail) => isOlderThanTwoYears(mail.date));

    how you can use the reduceMails function in dateFunctions
    const mailsBetweenTwoToSixMonthsOld = allMails.filter((mail) =>
      isBetweenTwoToSixMonthsOld(mail.date)
    );

    const mailsBySenderCounted = reduceMails(mailsBetweenTwoToSixMonthsOld);
  });
};


```
