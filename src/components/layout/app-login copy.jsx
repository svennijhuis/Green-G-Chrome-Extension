import CarAnimation from "../animation/car";
import BundleBackground from "../svg/bundle-background";

function AppLogin({ children, name }) {
  return (
    <>
      <section className="flex flex-col gap-3 items-center h-screen relative">
        <div className="relative w-[250px] h-[80px] flex justify-center items-center mt-3">
          <h1 className="text-center text-23 leading-22 text-white relative z-[15] px-3">
            Heey {name}
          </h1>
          <div className="absolute top-0 right-0 w-full h-full title-block z-10"></div>
        </div>
        <div className="mt-10 p-2 bg-black rounded-xl border-white border-2 mx-5">
          {children}
        </div>

        <CarAnimation />
        <BundleBackground />
      </section>
    </>
  );
}
export default AppLogin;
