const google = window.google;
import { differenceInMonths } from "date-fns";
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
import MainFilter from "./components/layout/main-filter";

function App() {
  const [useToken, setToken] = useState(Cookies.get("token"));
  const [tokenClient, setTokenClient] = useState({});
  const {
    emails,
    getEmailData,
    setDataMessages,
    dataMessages,
    setCountedSenders,
    valueFilter,
    setCountedDate,
    countedDate,
    deleteMessagesId,
    setDeleteMessagesId,
  } = useDataContext();

  useEffect(() => {
    Cookies.remove("token");
    Cookies.remove("keyFetch");
  }, []);

  const client_id = import.meta.env.VITE_CLIENT_ID;
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
        apiKey: import.meta.env.VITE_API_KEY,
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

      // var oneWeekAgo = new Date();
      // oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      // var threeMonthsAgo = new Date();
      // threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      // var sixMonthsAgo = new Date();
      // sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // var oneYearAgo = new Date();
      // oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      // var twoYearsAgo = new Date();
      // twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

      // var threeYearsAgo = new Date();
      // threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

      // // Nu en zeven dagen
      // var nowAndSevenDays = filterData.filter(function (email) {
      //   var emailDate = new Date(email.date).getTime();
      //   return emailDate >= oneWeekAgo.getTime() && emailDate <= Date.now();
      // });

      // // een week geleden en een maand
      // var betweenWeekMonth = filterData.filter(function (email) {
      //   var emailDate = new Date(email.date).getTime();
      //   return (
      //     emailDate >= oneWeekAgo.getTime() && emailDate < oneMonthAgo.getTime()
      //   );
      // });

      // // 1 maand - 3 maanden
      // var oneMonthToThreeMonths = filterData.filter(function (email) {
      //   var emailDate = new Date(email.date).getTime();
      //   return (
      //     emailDate >= oneMonthAgo.getTime() &&
      //     emailDate < threeMonthsAgo.getTime()
      //   );
      // });

      // //  1 maand - 3 maanden
      // var oneMonthToThreeMonths = filterData.filter(function (email) {
      //   var emailDate = new Date(email.date).getTime();
      //   return (
      //     emailDate >= oneMonthAgo.getTime() &&
      //     emailDate < threeMonthsAgo.getTime()
      //   );
      // });

      // //  3maand - 6 maanden
      // var threeMonthsToSixMonths = filterData.filter(function (email) {
      //   var emailDate = new Date(email.date).getTime();
      //   return (
      //     emailDate >= threeMonthsAgo.getTime() &&
      //     emailDate < sixMonthsAgo.getTime()
      //   );
      // });

      // // 6 maanden - 1 jaar
      // var betweenYearSixMonth = filterData.filter(function (email) {
      //   oneYearAgo.setDate(oneYearAgo.getDate() - 1);
      //   var emailDate = new Date(email.date).getTime();
      //   return (
      //     emailDate >= oneYearAgo.getTime() &&
      //     emailDate < sixMonthsAgo.getTime()
      //   );
      // });

      // // 1 jaar- 2 jaar
      // var oneYearToTwoYears = filterData.filter(function (email) {
      //   var emailDate = new Date(email.date).getTime();
      //   return (
      //     emailDate >= oneYearAgo.getTime() && emailDate < twoYearsAgo.getTime()
      //   );
      // });

      // // 2 jaar- 3 jaar
      // var twoYearsToThreeYears = filterData.filter(function (email) {
      //   var emailDate = new Date(email.date).getTime();
      //   return (
      //     emailDate >= twoYearsAgo.getTime() &&
      //     emailDate < threeYearsAgo.getTime()
      //   );
      // });

      // // 3 jaar en langer
      // var olderThanThreeYears = filterData.filter(function (email) {
      //   var emailDate = new Date(email.date).getTime();
      //   return emailDate < threeYearsAgo.getTime();
      // });

      function isNotOlderThanTwoMonthsFilter(date) {
        // new Date, gives you the date of right now
        const now = new Date();
        const differenceInMonthsVariable = differenceInMonths(now, date);
        // && both needs to be true, to return true
        return (
          differenceInMonthsVariable >= 0 && differenceInMonthsVariable <= 1
        );
      }

      function isBetweenTwoToSixMonthsOldFilter(date) {
        const now = new Date();
        const differenceInMonthsVariable = differenceInMonths(now, date);
        // && both needs to be true, to return true
        return (
          differenceInMonthsVariable >= 2 && differenceInMonthsVariable <= 5
        );
      }

      function isBetweenSixToTwelveMonthsOldFilter(date) {
        const now = new Date();
        const differenceInMonthsVariable = differenceInMonths(now, date);
        // && both needs to be true, to return true
        return (
          differenceInMonthsVariable >= 6 && differenceInMonthsVariable <= 11
        );
      }

      function isBetweenOneToTwoYearsOldFilter(date) {
        const now = new Date();
        const differenceInMonthsVariable = differenceInMonths(now, date);
        // && both needs to be true, to return true
        return (
          differenceInMonthsVariable >= 12 && differenceInMonthsVariable <= 23
        );
      }

      function isOlderThanTwoYearsFilter(date) {
        const now = new Date();
        const differenceInMonthsVariable = differenceInMonths(now, date);
        // more than 2 years
        return differenceInMonthsVariable >= 24;
      }

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

      console.log(
        isOlderThanTwoYears.length,
        isBetweenOneToTwoYearsOld.length,
        isBetweenSixToTwelveMonthsOld.length,
        isBetweenTwoToSixMonthsOld.length,
        isNotOlderThanTwoMonths.length
      );

      const objectDateCount = [
        {
          name: "Niet ouder als 2 maanden",
          value: isNotOlderThanTwoMonths.length,
          function: "filterNowAndSevenDays",
        },
        {
          name: "Tussen 2 en 6 maanden",
          value: isBetweenTwoToSixMonthsOld.length,
          function: "filterNowAndSevenDays",
        },
        {
          name: "Tussen 6 en 12 maanden",
          value: isBetweenSixToTwelveMonthsOld.length,
          function: "filterNowAndSevenDays",
        },
        {
          name: "Tussen 1 en 2 jaar",
          value: isBetweenOneToTwoYearsOld.length,
          function: "filterNowAndSevenDays",
        },
        {
          name: "Ouder dan 2 jaar",
          value: isOlderThanTwoYears.length,
          function: "filterNowAndSevenDays",
        },
      ];

      const objectDateCountFilter = objectDateCount.filter(
        (item) => item.value !== 0
      );

      const json = { children: objectDateCountFilter };
      setCountedDate(json);
    }
  }, [valueFilter, dataMessages]);

  // useEffect(() => {
  //   if (
  //     valueFilter &&
  //     dataMessages &&
  //     dataMessages.children &&
  //     dataMessages.children.length > 0
  //   ) {
  //     const filterData = dataMessages.children.filter((item) => {
  //       if (typeof item.from !== undefined && item.from[0]) {
  //         return item.from[0][1] === valueFilter;
  //       }
  //     });
  //   }
  // }, []);

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
        <Main />
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

  if (valueFilter && countedDate !== undefined) {
    return (
      <section>
        <MainFilter />
      </section>
    );
  }
}
export default App;
