import CarAnimation from "../animation/car";
import BundleBackground from "../svg/bundle-background";
import Cookies from "js-cookie";
import { useDataContext } from "../../context/data";
import { useEffect, useState } from "react";
import BubbelChartFilter from "../chart/bubble-chart-filter-all";
import Modal from "../modalbox/modal-box-delete";
import Back from "../button/back";
import Delete from "../button/delete";
import YesButton from "../button/yes-button";
import NoButton from "../button/no-button";
import DeleteSelectie from "../button/delete-selectie";

function MainAll() {
  const {
    setValueFilter,
    deleteMessagesId,
    setDeleteMessagesId,
    setValueDate,
    valueDate,
    setParty,
    valueFilter,
  } = useDataContext();
  const removeFilterData = () => {
    setValueDate(undefined);
  };

  const [date, useDate] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [count, setCount] = useState();

  const removeData = async () => {
    await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/batchDelete",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + Cookies.get("keyFetch"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: deleteMessagesId,
        }),
      }
    );
    setParty("party");
  };

  console.log(deleteMessagesId);

  useEffect(() => {
    if (valueDate === "isNotOlderThanTwoMonthsFilter") {
      useDate("<2 maanden");
    }
    if (valueDate === "isBetweenTwoToSixMonthsOldFilter") {
      useDate("2 - 6 maanden");
    }
    if (valueDate === "isBetweenSixToTwelveMonthsOldFilter") {
      useDate("6 - 12 maanden");
    }
    if (valueDate === "isBetweenOneToTwoYearsOldFilter") {
      useDate("1 - 2 jaar");
    }
    if (valueDate === "isOlderThanTwoYearsFilter") {
      useDate(">2 jaar");
    }
  }, [valueDate]);

  useEffect(() => {
    setCount(deleteMessagesId.length);
  }, [deleteMessagesId]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="flex flex-col items-center h-screen relative">
        <div className="absolute left-1 top-1">
          <div className="flex flex-row items-center">
            <span className="block w-1 h-1 bg-red-600 mr-1 rounded-full"></span>
            <p className="text-14 font-medium">Delete</p>
          </div>
          <div className="flex flex-row items-center">
            <span className="block w-1 h-1 bg-green-600 mr-1 rounded-full"></span>
            <p className="text-14 font-medium">Bewaren</p>
          </div>
        </div>
        <h1 className="px-1 text-center text-40 leading-40 text-black relative z-10 effect mt-1">
          {valueFilter}
        </h1>
        <div className="relative w-min h-min">
          <div className="bg-block-value mx-auto mb-2 relative"></div>

          <div className="absolute top-1/2 left-3  transform  -translate-y-1/2">
            <p className="text-white text-28 leading-28 text-bold text-start w-full">
              {count}
              {deleteMessagesId.length > 1 ? " mails" : " mail"}
            </p>
            <p className="text-white text-28 leading-28  text-bold text-start w-full">
              {date}
            </p>
          </div>
        </div>
        <BubbelChartFilter />
        {deleteMessagesId.length > 0 && (
          <button className="w-[280px]" onClick={() => setIsModalOpen(true)}>
            <DeleteSelectie />
          </button>
        )}

        <button className="w-[140px] mt-[5px]" onClick={removeFilterData}>
          <Back />
        </button>
        <CarAnimation />
        <BundleBackground />
      </section>
      {isModalOpen && (
        <>
          <div className="absolute bg-black/80 top-0 bottom-0 right-0 left-0 w-full h-full z-[12]"></div>
          <Modal>
            <div className="flex flex-col h-full ">
              <h2 className="text-white text-24 leading-24 text-bold text-center w-full pt-9 px-10">
                {deleteMessagesId.length}{" "}
                {deleteMessagesId.length > 1 ? " mails" : " mail"} verwijderen?
              </h2>
              <div className="flex flex-row gap-2 justify-between px-3 mt-auto pb-6">
                <button className="w-[200px] ml-2" onClick={closeModal}>
                  <NoButton />
                </button>
                <button className="w-[200px] mr-2" onClick={removeData}>
                  <YesButton />
                </button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
}
export default MainAll;
