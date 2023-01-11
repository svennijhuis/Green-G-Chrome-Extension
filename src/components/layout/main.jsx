import BubbleChart from "../chart/bubble-chart";
import data from "../../data.json";
import CarAnimation from "../animation/car";

function Main() {
  return (
    <>
      <section className="flex flex-col gap-3 my-5 items-center h-full">
        <h1 className="text-center text-30 leading-40 ">20,78 kg CO2</h1>
        <BubbleChart data={data} />
        <CarAnimation />
      </section>
    </>
  );
}
export default Main;
