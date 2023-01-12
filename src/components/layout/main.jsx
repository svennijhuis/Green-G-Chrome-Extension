import BubbleChart from "../chart/bubble-chart";
import data from "../../data.json";
import CarAnimation from "../animation/car";
import BundleBackground from "../svg/bundle-background";

function Main() {
  // if (data) return <section>Loading....</section>;

  return (
    <>
      <section className="flex flex-col gap-3 items-center h-screen relative">
        <h1 className="text-center text-30 leading-40 ">20,78 kg CO2</h1>
        <BubbleChart data={data} />
        <CarAnimation />
        <BundleBackground />
      </section>
    </>
  );
}
export default Main;
