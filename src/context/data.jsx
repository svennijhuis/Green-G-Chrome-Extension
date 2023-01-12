import { createContext, useContext, useState, useEffect } from "react";

import data from "../data/data.json";

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
  const [useData, setData] = useState({});

  useEffect(() => {
    // const timer = setTimeout(() => {
    //   setData(data);
    // }, 5000);ç
    // return () => clearTimeout(timer);
    setData(data);
  }, [useData]);

  console.log(useData);

  return (
    <DataContext.Provider
      value={{
        useData,
        setData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;

export { DataContext, useDataContext };
