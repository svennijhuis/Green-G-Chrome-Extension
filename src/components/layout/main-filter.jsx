import BubbleChart from "../chart/bubble-chart";
import data from "../../data.json";
import CarAnimation from "../animation/car";
import BundleBackground from "../svg/bundle-background";
import CarInformation from "../button/car-information";

function MainFilter({ data }) {
  // if (data) return <section>Loading....</section>;

  return (
    <>
      <section className="flex flex-col gap-3 items-center h-screen relative">
        <div className="relative w-[250px] h-[80px] flex justify-center items-center mt-3">
          <h1 className="text-center text-23 leading-22 text-white relative z-[15] px-3">
            the carbon footprint of your mailbox:
          </h1>
          <div className="absolute top-0 right-0 w-full h-full title-block z-10"></div>
        </div>
        <h2 className="text-center text-30 leading-22 text-black font-black relative z-[15] px-3 italic">
          20,78 KG CO2
        </h2>

        <BubbleChart data={data} />

        <CarInformation />
        <CarAnimation />
        <BundleBackground />
      </section>
    </>
  );
}
export default MainFilter;
