import CarAnimation from "../animation/car";
import BundleBackground from "../svg/bundle-background";
import WelcomeText from "../svg/start-scherm/welcome-text";

function AppLogin({ children, name }) {
  return (
    <>
      <section className="flex flex-col gap-3 items-center h-screen relative">
        <WelcomeText />
        <div className="mt-auto mb-[215px] mr-auto">{children}</div>
        <BundleBackground />
      </section>
    </>
  );
}
export default AppLogin;
