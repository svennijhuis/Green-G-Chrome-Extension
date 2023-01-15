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
    // if you have a page token, then include pageToken query parameter for the next request
    const includeToken = pageToken ? `&pageToken=${pageToken}` : "";
    const response = await fetch(
      // query parameter with maxResult of 500 to list more messages (500)
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=25${includeToken}`,
      options
    );
    const responseData = await response.json();
    // messages property is from the response object
    const { messages } = responseData;
    // put all messages of all pages with concat into the array of allMessages, without concat, you don't get all pages of messages
    allMessages = allMessages.concat(messages);
    // optional chaining operator is for when a property in object does not exist, don't give me an error and return undefined
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

// function to filter the messages on category/sender
function getMessagesByEmail(messages, email) {
  // used email, because the email is unique, the name could be anything
  return messages.filter((message) => message.sender.email === email);
  // show in front-end the name
  // when calling the function, use the first parameter for allMessages
}

// function to filter messages with batchDelete
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
///////////////////////////////////////////////////////////////////////////////
//Function for getting the content/information about emails
async function listAllEmails(token, query) {
  const params = {
    method: "GET",
    q: query,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };

  var previousResponse = await doFetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages",
    "",
    [],
    params
  );
  return previousResponse;
}

async function getSizeOfEmails(token, messages) {
  sizes = [];
  body = "";
  i = 1;
  limit = messages.length - messages.length * 0.25;
  const regex = /(?<="sizeEstimate":.)[0-9]*/gi;

  console.log("Limit: ", limit);
  console.log("token", token);
  while (messages.length > limit) {
    body = body.concat(
      // API end point GET /gmail/v1/users/me/messages/
      `--batch_boundary\r\nContent-Type:application/http\r\n\r\nGET /gmail/v1/users/me/messages/${messages[0].id}?fields=sizeEstimate\r\n\r\n`
    );
    messages.shift();
    i++;

    if (i >= 75) {
      body = body.concat("--batch_boundary--");
      const response = await batchGet(body, token);
      const text = await response.text();
      console.log(text);
      const sizeEstimates = await text.match(regex);
      console.log(sizeEstimates);
      if (sizeEstimates != null) {
        sizes = sizes.concat(sizeEstimates);
      }
      console.log("Amount of sizes in list: ", sizes.length);
      body = "";
      i = 0;
    }
  }

  const totalSizeEstimate = sizes.reduce((accumulator, value) => {
    return accumulator + parseInt(value);
  }, 0);

  return totalSizeEstimate * 4;
}

function batchGet(body, token) {
  const params = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "multipart/mixed; boundary=batch_boundary",
    },
    body: body,
  };

  return fetch("https://www.googleapis.com/batch/gmail/v1", params);
}

function doFetch(
  url = "https://gmail.googleapis.com/gmail/v1/users/me/messages",
  pageToken = "",
  previousResponse = [],
  params
) {
  return fetch(`${url}?pageToken=${pageToken}&maxResults=${500}`, params)
    .then((response) => response.json())
    .then((data) => {
      previousResponse = previousResponse.concat(data.messages);
      if (data.nextPageToken) {
        return doFetch(
          "https://gmail.googleapis.com/gmail/v1/users/me/messages",
          data.nextPageToken,
          previousResponse,
          params
        );
      } else {
        return previousResponse;
      }
    });
}
