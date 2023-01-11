import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { fetchData } from "../../functions/fetch-stock-data";

/**
 * This is the context that we use to store all the values from the forms
 * to make them globally available for all other steps.
 */
const DataContext = createContext(false);
DataContext.displayName = "Data Context";

/**
 * Hook to use the Stock data context.
 * @returns {React.Context}
 */
const useDataContext = () => useContext(DataContext);

/**
 * Wrapper to make a Provider for the StockDataContext.
 * @returns {React.Provider<StockDataContext>}
 */
const StockDataProvider = ({ children }) => {
  const [useData, setData] = useState([]);

  useEffect(() => {
    fetchData().then((data) => {});
  }, [useData]);

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

export default StockDataProvider;

export { StockDataContext, useStockDataContext };
