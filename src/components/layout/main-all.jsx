import CarAnimation from "../animation/car";
import BundleBackground from "../svg/bundle-background";
import Cookies from "js-cookie";
import { useDataContext } from "../../context/data";
import { useEffect } from "react";
import BubbelChartFilter from "../chart/bubble-chart-filter-all";

function MainAll() {
  const {
    setValueFilter,
    deleteMessagesId,
    setDeleteMessagesId,
    setValueDate,
  } = useDataContext();
  const removeFilterData = () => {
    setValueDate(undefined);
  };

  const removeData = async () => {
    const data = deleteMessagesId;
    console.log(data);
    console.log("test");
    await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/batchDelete",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + Cookies.get("keyFetch"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: data,
        }),
      }
    );
  };

  useEffect(() => {
    console.log(deleteMessagesId);
  }, [deleteMessagesId]);

  return (
    <>
      <section className="flex flex-col gap-3 items-center h-screen relative">
        <BubbelChartFilter />
        <button onClick={removeData}>Delete messages</button>
        <button onClick={removeFilterData}>Back</button>
        <CarAnimation />
        <BundleBackground />
      </section>
    </>
  );
}
export default MainAll;
