import CarAnimation from "../animation/car";
import BundleBackground from "../svg/bundle-background";
import BubbelChartFilter from "../chart/bubble-chart-filter";
import Cookies from "js-cookie";
import { useDataContext } from "../../context/data";
import { useEffect, useState } from "react";
import Modal from "../modalbox/modal-box-delete";
import Back from "../button/back";
import Delete from "../button/delete";
import YesButton from "../button/yes-button";
import NoButton from "../button/no-button";

function MainFilter() {
  const {
    setValueFilter,
    deleteMessagesId,
    setDeleteMessagesId,
    setParty,
    valueFilter,
    dataMessages,
  } = useDataContext();
  const removeFilterData = () => {
    setValueFilter(undefined);
    setDeleteMessagesId(undefined);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(0);
  const [count, setCount] = useState();

  useEffect(() => {
    if (dataMessages && dataMessages.children) {
      setData(
        dataMessages.children.filter((item) => {
          if (typeof item.from !== undefined && item.from[0]) {
            return item.from[0][1] === valueFilter;
          }
        })
      );
    }
  }, [dataMessages]);

  useEffect(() => {
    if (data) {
      const initialValue = 0;
      const sumWithInitial = data.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.sizeInGramsOfCo2,
        initialValue
      );

      setCount(sumWithInitial.toFixed(0));
    }
  }, [data]);

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

  useEffect(() => {}, [deleteMessagesId]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="flex flex-col items-center h-screen relative">
        <h1 className="px-1 text-center text-40 leading-40 text-black relative z-10 effect mt-1">
          {valueFilter}
        </h1>
        <div className="relative w-min h-min">
          <div className="bg-block-value mx-auto mb-2 relative"></div>

          <div className="absolute top-1/2 left-3  transform  -translate-y-1/2">
            <p className="text-white text-28 leading-28 text-bold text-start w-full">
              {data.length} Mails
            </p>
            <p className="text-white text-28 leading-28  text-bold text-start w-full">
              {count} gram CO2
            </p>
          </div>
        </div>
        <BubbelChartFilter />
        <button className="w-[280px]" onClick={() => setIsModalOpen(true)}>
          <Delete />
        </button>
        <button className="w-[140px]" onClick={removeFilterData}>
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
                {deleteMessagesId.length} mails verwijderen?
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
export default MainFilter;
