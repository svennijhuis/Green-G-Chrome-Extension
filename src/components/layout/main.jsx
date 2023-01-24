import BubbleChart from "../chart/bubble-chart";
import CarAnimation from "../animation/car";
import BundleBackground from "../svg/bundle-background";
import CarInformation from "../button/car-information";
import TitleStartScreen from "../svg/main-screen/title";

function Main({ Co2InGram }) {
  return (
    <>
      <section className="flex flex-col items-center h-screen relative">
        <div className="relative w-[300px] h-auto flex mt-2">
          <TitleStartScreen />
        </div>
        <h1 className="text-center text-40 leading-40 text-black relative z-[15] mb-1 effect">
          {Co2InGram} Gram CO2
        </h1>

        <BubbleChart />

        <CarInformation />
        <CarAnimation />
        <BundleBackground />
      </section>
    </>
  );
}
export default Main;
