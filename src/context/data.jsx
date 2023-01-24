import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

/**
 * This is the context that we use to store all the values from the forms
 * to make them globally available for all other steps.
 */
const DataContext = createContext(false);
DataContext.displayName = "Data Context";

/**
 * Hook to use the  data context.
 * @returns {React.Context}
 */
const useDataContext = () => useContext(DataContext);

/**
 * Wrapper to make a Provider for the DataContext.
 * @returns {React.Provider<DataContext>}
 */
const DataProvider = ({ children }) => {
  const [messageIds, setMessageIds] = useState([]);
  const [emails, setEmails] = useState([]);
  const [dataMessages, setDataMessages] = useState(null);

  const [dataMessagesList, setDataMessagesList] = useState(null);
  const [countedSenders, setCountedSenders] = useState();
  const [countedDate, setCountedDate] = useState();

  const [dataFilter, setDataFilter] = useState(null);

  const [valueFilter, setValueFilter] = useState();
  const [valueDate, setValueDate] = useState();
  const [valueAll, setValueAll] = useState();

  const [party, setParty] = useState();

  const [co2InGram, setCo2InGram] = useState();

  const [deleteMessagesId, setDeleteMessagesId] = useState();

  const getMessageIds = async (token, collection = []) => {
    const url = new URL(
      "https://www.googleapis.com/gmail/v1/users/me/messages"
    );

    url.searchParams.set("maxResults", 15);

    if (token) {
      url.searchParams.set("pageToken", token);
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + Cookies.get("keyFetch"),
      },
    });

    const data = await response.json();
    const messageIds = data.messages.map(({ id }) => id);
    collection = [...collection, ...messageIds];

    if (data.nextPageToken && collection.length <= 1000) {
      return getMessageIds(data.nextPageToken, collection);
    }

    return collection;
  };

  const getEmails = async (messageIds) => {
    const requests = messageIds.map(async (id) => {
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + Cookies.get("keyFetch"),
          },
        }
      );

      return response.json();
    });

    const emails = await Promise.allSettled(requests);
    return emails
      .filter(({ status }) => status === "fulfilled")
      .map(({ value }) => value);
  };

  const getEmailData = async () => {
    const messageIds = await getMessageIds();
    setMessageIds(messageIds);
  };

  useEffect(() => {
    getEmails(messageIds).then((emails) => {
      setEmails(emails);
    });
  }, [messageIds]);

  return (
    <DataContext.Provider
      value={{
        emails,
        messageIds,
        getEmailData,
        dataMessages,
        setDataMessages,
        dataMessagesList,
        setDataMessagesList,
        countedSenders,
        setCountedSenders,
        countedDate,
        setCountedDate,
        dataFilter,
        setDataFilter,
        valueFilter,
        setValueFilter,
        deleteMessagesId,
        setDeleteMessagesId,
        valueDate,
        setValueDate,
        valueAll,
        setValueAll,
        party,
        setParty,
        co2InGram,
        setCo2InGram,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;

export { DataContext, useDataContext };
