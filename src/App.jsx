const google = window.google;
import Main from "./components/layout/main";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import GoogleLogin from "./components/layout/google-login";
import AppLogin from "./components/layout/app-login copy";
import { useDataContext } from "./context/data";
import LoadingAnimation from "./components/animation/loading";

import CarAnimation from "./components/animation/car";
import BundleBackground from "./components/svg/bundle-background";
import MainFilter from "./components/layout/main-filter";

import {
  isNotOlderThanTwoMonthsFilter,
  isBetweenTwoToSixMonthsOldFilter,
  isBetweenSixToTwelveMonthsOldFilter,
  isBetweenOneToTwoYearsOldFilter,
  isOlderThanTwoYearsFilter,
} from "./functions/date";
import MainAll from "./components/layout/main-all";
import StartButton from "./components/svg/start-scherm/start-button";
import Confetti from "./components/animation/confetti";
import Bubble from "./components/animation/bubble";

function App() {
  const [useToken, setToken] = useState(Cookies.get("token"));
  const [tokenClient, setTokenClient] = useState({});

  const [timerClock, setTimerClock] = useState(true);

  const {
    emails,
    getEmailData,
    setDataMessages,
    dataMessages,
    setCountedSenders,
    valueFilter,
    setValueFilter,
    setCountedDate,
    countedDate,
    deleteMessagesId,
    setDeleteMessagesId,
    valueDate,
    setValueAll,
    setParty,
    party,
    co2InGram,
    setCo2InGram,
    countedSenders,
    setValueDate,
  } = useDataContext();

  useEffect(() => {
    Cookies.remove("token");
    Cookies.remove("keyFetch");
  }, []);

  const client_id = process.env.VITE_CLIENT_ID;
  const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

  const handleCallbackResponse = (response) => {
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
        apiKey: process.env.VITE_API_KEY,
        scope: SCOPES,
        callback: async (tokenResponse) => {
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
    }));
    const jsonOutput = {
      children: newJson,
    };

    setDataMessages(jsonOutput);
  }, [emails]);

  const countOcurrancesOfSenders = () => {
    if (dataMessages && dataMessages.children) {
      let from = [];
      for (const message of dataMessages.children) {
        if (typeof message.from !== undefined && message.from[0]) {
          const currentItem = message.from[0][1];
          const indexOfSearchItem = from.findIndex(
            (item) => item.name === currentItem
          );
          if (indexOfSearchItem > -1) {
            from[indexOfSearchItem].value += 1;
          } else {
            from.push({ name: currentItem, value: 1 });
          }
        }
      }
      setCountedSenders(from);
    }
  };

  useEffect(() => {
    if (
      dataMessages &&
      dataMessages.children &&
      dataMessages.children.length > 0
    ) {
      countOcurrancesOfSenders();
    }
  }, [dataMessages]);

  useEffect(() => {
    if (
      valueFilter &&
      dataMessages &&
      dataMessages.children &&
      dataMessages.children.length > 0
    ) {
      // filter data
      const filterData = dataMessages.children.filter((item) => {
        if (typeof item.from !== undefined && item.from[0]) {
          return item.from[0][1] === valueFilter;
        }
      });

      const newArray = [];

      filterData.forEach((item) => {
        newArray.push(item.id);
      });

      setDeleteMessagesId(newArray);

      const isNotOlderThanTwoMonths = filterData.filter((mail) =>
        isNotOlderThanTwoMonthsFilter(mail.date)
      );
      const isBetweenTwoToSixMonthsOld = filterData.filter((mail) =>
        isBetweenTwoToSixMonthsOldFilter(mail.date)
      );
      const isBetweenSixToTwelveMonthsOld = filterData.filter((mail) =>
        isBetweenSixToTwelveMonthsOldFilter(mail.date)
      );
      const isBetweenOneToTwoYearsOld = filterData.filter((mail) =>
        isBetweenOneToTwoYearsOldFilter(mail.date)
      );
      const isOlderThanTwoYears = filterData.filter((mail) =>
        isOlderThanTwoYearsFilter(mail.date)
      );

      const objectDateCount = [
        {
          name: "<2 Maanden",
          value: isNotOlderThanTwoMonths.length,
          function: "isNotOlderThanTwoMonthsFilter",
        },
        {
          name: "2-6 Maanden",
          value: isBetweenTwoToSixMonthsOld.length,
          function: "isBetweenTwoToSixMonthsOldFilter",
        },
        {
          name: "6 - 12 Maanden",
          value: isBetweenSixToTwelveMonthsOld.length,
          function: "isBetweenSixToTwelveMonthsOldFilter",
        },
        {
          name: "1 - 2 Jaar",
          value: isBetweenOneToTwoYearsOld.length,
          function: "isBetweenOneToTwoYearsOldFilter",
        },
        {
          name: ">2 Jaar",
          value: isOlderThanTwoYears.length,
          function: "isOlderThanTwoYearsFilter",
        },
      ];

      const objectDateCountFilter = objectDateCount.filter(
        (item) => item.value !== 0
      );
      const json = { children: objectDateCountFilter };
      setCountedDate(json);
    }
  }, [valueFilter, dataMessages, valueDate]);

  const getId = (data) => {
    const newArray = [];
    data.forEach((item) => {
      newArray.push(item.id);
    });
    setDeleteMessagesId(newArray);
  };

  const generateJson = (data) => {
    const json = { children: data };
    setValueAll(json);
  };

  useEffect(() => {
    if (
      valueFilter &&
      dataMessages &&
      dataMessages.children &&
      dataMessages.children.length > 0 &&
      valueDate !== undefined
    ) {
      const filterData = dataMessages.children.filter((item) => {
        if (typeof item.from !== undefined && item.from[0]) {
          return item.from[0][1] === valueFilter;
        }
      });

      if (valueDate === "isNotOlderThanTwoMonthsFilter") {
        const filterDateToAllMails = filterData.filter((mail) =>
          isNotOlderThanTwoMonthsFilter(mail.date)
        );
        generateJson(filterDateToAllMails);
        getId(filterDateToAllMails);
      }
      if (valueDate === "isBetweenTwoToSixMonthsOldFilter") {
        const filterDateToAllMails = filterData.filter((mail) =>
          isBetweenTwoToSixMonthsOldFilter(mail.date)
        );
        generateJson(filterDateToAllMails);
        getId(filterDateToAllMails);
      }
      if (valueDate === "isBetweenSixToTwelveMonthsOldFilter") {
        const filterDateToAllMails = filterData.filter((mail) =>
          isBetweenSixToTwelveMonthsOldFilter(mail.date)
        );
        generateJson(filterDateToAllMails);
        getId(filterDateToAllMails);
      }
      if (valueDate === "isBetweenOneToTwoYearsOldFilter") {
        const filterDateToAllMails = filterData.filter((mail) =>
          isBetweenOneToTwoYearsOldFilter(mail.date)
        );
        generateJson(filterDateToAllMails);
        getId(filterDateToAllMails);
      }
      if (valueDate === "isOlderThanTwoYearsFilter") {
        const filterDateToAllMails = filterData.filter((mail) =>
          isOlderThanTwoYearsFilter(mail.date)
        );
        generateJson(filterDateToAllMails);
        getId(filterDateToAllMails);
      }
    }
  }, [valueDate, dataMessages, valueFilter]);

  useEffect(() => {
    if (party === "party") {
      const timer = setTimeout(() => {
        setParty();
        const resetData = dataMessages.children.filter(
          (item) => !deleteMessagesId.includes(item.id)
        );
        setCountedDate(undefined);
        setValueDate(undefined);
        setValueFilter(undefined);
        setDeleteMessagesId(undefined);

        setCountedSenders(undefined);
        setTimerClock(true);
        const jsonOutput = {
          children: resetData,
        };

        setDataMessages(jsonOutput);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [party]);

  useEffect(() => {
    if (
      dataMessages &&
      dataMessages.children &&
      dataMessages.children.length > 0
    ) {
      const initialValue = 0;
      const sumWithInitial = dataMessages.children.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.sizeInGramsOfCo2,
        initialValue
      );

      setCo2InGram(sumWithInitial.toFixed(1));
    }
  }, [dataMessages]);

  useEffect(() => {
    if (party === "party") {
      const timer = setTimeout(() => {
        setTimerClock(false);
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [party]);

  if (party === "party") {
    return (
      <section className="relative h-screen w-full flex flex-col">
        {timerClock ? (
          <Bubble />
        ) : (
          <>
            <Confetti />
            <div class="absolute bg-black/80 top-0 bottom-0 right-0 left-0 w-full h-full z-[12]"></div>
            <div className="relative w-min h-min mx-auto my-auto">
              <div className="bg-block-value mx-auto mb-2 relative"></div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[13]">
                <h2 className="text-white text-28 leading-28 text-bold text-start w-full pr-1">
                  {deleteMessagesId.length} mails verwijderd
                </h2>
              </div>
            </div>
          </>
        )}

        <BundleBackground />
      </section>
    );
  }

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
    return (
      <section>
        <AppLogin>
          <button className="w-[450px] h-auto" onClick={creatData}>
            <StartButton />
          </button>
        </AppLogin>
      </section>
    );
  }

  if (emails.length === 0) {
    return (
      <section className="flex flex-col h-screen relative">
        <LoadingAnimation />
        <CarAnimation />
        <BundleBackground />
      </section>
    );
  }
  if (valueFilter === undefined) {
    return (
      <section>
        <Main Co2InGram={co2InGram} />
      </section>
    );
  }

  if (countedDate === undefined) {
    return (
      <section className="flex flex-col h-screen relative">
        <LoadingAnimation />
        <CarAnimation />
        <BundleBackground />
      </section>
    );
  }

  if (valueFilter && countedDate !== undefined && valueDate === undefined) {
    return (
      <section>
        <MainFilter />
      </section>
    );
  }
  return (
    <section>
      <MainAll />
    </section>
  );
}
export default App;
