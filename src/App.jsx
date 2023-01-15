const google = window.google;

import Main from "./components/layout/main";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import GoogleLogin from "./components/layout/google-login";
import AppLogin from "./components/layout/app-login copy";
import { useDataContext } from "./context/data";
import LoadingAnimation from "./components/animation/loading";

import CarAnimation from "./components/animation/car";
import BundleBackground from "./components/svg/bundle-background";

function App() {
  const [useToken, setToken] = useState(Cookies.get("token"));
  const [tokenClient, setTokenClient] = useState({});
  const { emails, getEmailData, setDataMessages, dataMessages } =
    useDataContext();

  useEffect(() => {
    Cookies.remove("token");
    Cookies.remove("keyFetch");
  }, []);

  const [useFetch, setFetch] = useState(Cookies.get("keyFetch"));

  const client_id = import.meta.env.VITE_CLIENT_ID;
  const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

  const handleCallbackResponse = (response) => {
    console.log("encode JWT id token " + response.credential);
    Cookies.set("token", response.credential);
    setToken(Cookies.get("token"));
  };

  const creatData = () => {
    tokenClient.requestAccessToken();
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: client_id,
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });

    setTokenClient(
      google.accounts.oauth2.initTokenClient({
        client_id: client_id,
        apiKey: import.meta.env.VITE_API_KEY,
        scope: SCOPES,
        callback: async (tokenResponse) => {
          setFetch(tokenResponse.access_token);
          if (tokenResponse && tokenResponse.access_token) {
            Cookies.set("keyFetch", tokenResponse.access_token);
            getEmailData();
          }
        },
      })
    );
  }, [useToken]);

  useEffect(() => {
    const senderRegex = /(.*) <(.*)>/gm;
    let newJson = emails.map((d) => ({
      id: d.id,
      snippet: d.snippet,
      sizeInMegabytes: +parseFloat(d.sizeEstimate / 1024 / 1024).toFixed(2),
      sizeInGramsOfCo2:
        parseFloat(d.sizeEstimate / 1024 / 1024).toFixed(2) * 20,
      labelIds: d.labelIds,
      from: [
        ...d.payload.headers
          .find((element) => element.name === "From")
          .value.matchAll(senderRegex),
      ],
      date: new Date(
        d.payload.headers.find((element) => element.name === "Date").value
      ),
      name: "Pineapples",
      value: 30,
    }));
    const jsonTest = {
      children: newJson,
    };

    setDataMessages(jsonTest);
  }, [emails]);

  if (Cookies.get("token") === undefined) {
    return (
      <section>
        <GoogleLogin>
          <div id="signInDiv"></div>
        </GoogleLogin>
      </section>
    );
  }

  if (Cookies.get("keyFetch") === undefined) {
    const personData = jwt_decode(Cookies.get("token"));
    return (
      <section>
        <AppLogin name={personData.name}>
          <button className="text-white text-15" onClick={creatData}>
            Start met je avontuur met het legen van je mail box van{" "}
            {personData.email}
          </button>
        </AppLogin>
      </section>
    );
  }
console.log(dataMessages);
  if (emails.length === 0) {
    // if(dataMessages.children.length === 0){
    return (
      <section className="flex flex-col h-screen relative">
        <LoadingAnimation />
        <CarAnimation />
        <BundleBackground />
      </section>
    );
  }

  return (
    <section>
      <Main />
    </section>
  );
}
export default App;
