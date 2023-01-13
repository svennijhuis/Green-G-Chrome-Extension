import BubbleChart from "../chart/bubble-chart";
import data from "../../data.json";
import CarAnimation from "../animation/car";
import BundleBackground from "../svg/bundle-background";
import CarInformation from "../button/car-information";

function Main() {
  // if (data) return <section>Loading....</section>;

  return (
    <>
      <section className="flex flex-col gap-3 items-center h-screen relative">
        <div className="relative w-[250px] h-[80px] flex justify-center items-center mt-3">
          <h1 className="text-center text-17 leading-17 text-white relative z-[15]">
            the carbon footprint of your mailbox:
          </h1>
          <div className="absolute top-0 right-0 w-full h-full title-block z-10"></div>
        </div>
        <div className="h-[50vh]">
          <BubbleChart data={data} />
        </div>
        <CarInformation />
        <CarAnimation />
        <BundleBackground />
      </section>
    </>
  );
}
export default Main;
