async function getSizeOfEmails(token, messages) {
  sizes = [];
  body = "";
  i = 1;
  limit = messages.length - messages.length * 0.25;
  const regex = /(?<="sizeEstimate":.)[0-9]*/gi;
  console.log("Limit: ", limit);
  while (messages.length > limit) {
    body = body.concat(
      `--batch_boundary\r\nContent-Type:application/http\r\n\r\nGET /gmail/v1/users/me/messages/${messages[0].id}?fields=sizeEstimate\r\n\r\n`
    );
    messages.shift();
    i++;
    if (i >= 20) {
      console.log("meer dan 20");
      body = body.concat("--batch_boundary--");
      const response = await batchGet(body, token);
      const text = await response.text();
      console.log(text, "text");
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
  console.log("batch get");
  token = localStorage.getItem("token");
  console.log(body, token, "body en token in batchGet functie");
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


