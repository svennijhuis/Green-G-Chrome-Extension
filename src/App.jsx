const google = window.google;

import Main from "./components/layout/main";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import "@fontsource/inter";
import GoogleLogin from "./components/layout/google-login";
import AppLogin from "./components/layout/app-login copy";
import { useDataContext } from "./context/data";

function App() {
  const [useToken, setToken] = useState(Cookies.get("token"));
  const [useFetch, setFetch] = useState(Cookies.get("keyFetch"));
  const [tokenClient, setTokenClient] = useState({});
  const [useNextPageToken, setNextPageToken] = useState();

  const { emails, getEmailData } = useDataContext();

  const client_id = import.meta.env.VITE_CLIENT_ID;
  const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

  const handleCallbackResponse = (response) => {
    console.log("encode JWT id token " + response.credential);
    const userObject = jwt_decode(response.credential);
    Cookies.set("token", response.credential);
    setToken(Cookies.get("token"));
  };

  const handleSignOut = () => {
    Cookies.remove("token");
    setToken(undefined);
  };

  const creatData = () => {
    tokenClient.requestAccessToken();
  };

  useEffect(() => {
    console.log(emails);
  }, [emails]);

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
            fetch("https://www.googleapis.com/gmail/v1/users/me/messages", {
              method: "GET",
              headers: {
                Authorization: "Bearer " + tokenResponse.access_token,
              },
            })
              .then((response) => response.json())
              .then((data) => {
                // handle the response data
                console.log(data);
              });
          }
        },
      })
    );

    // google.accounts.id.prompt();
  }, [useToken]);

  // if (a) {
  // return (
  //   <section>
  //     <GoogleLogin>
  //       <div id="signInDiv"></div>
  //     </GoogleLogin>
  //   </section>
  // );
  // }

  // const a = false;
  // if (Cookies.get("keyFetch") === undefined && useFetch) {
  //   console.log(Cookies.get("keyFetch"));
  const personData = jwt_decode(Cookies.get("token"));
  return (
    <section>
      {/* <AppLogin name={personData.name}>
        <button className="text-white text-15" onClick={creatData}>
          Start met je avontuur met het legen van je mail box van{" "}
          {personData.email}
        </button>
      </AppLogin> */}
      <button className="text-white text-15" onClick={creatData}>
        Start met je avontuur met het legen van je mail box van{" "}
        {personData.email}
      </button>
      <button onClick={getEmailData}>get data</button>
    </section>
  );
  // }
  return (
    <section>
      {/* {useToken !== undefined ? (
        <button onClick={(e) => handleSignOut(e)}>Sign out</button>
      ) : (
        <div id="signInDiv"></div>
      )}
      <button onClick={creatData}>get token</button>
      <button onClick={createDataList}>get data</button> */}
      <Main />
    </section>
  );
}
export default App;
