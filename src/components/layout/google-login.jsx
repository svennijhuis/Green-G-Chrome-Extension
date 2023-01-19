import CarAnimation from "../animation/car";
import BundleBackground from "../svg/bundle-background";
import LoginGmailButton from "../svg/login-scherm/google-login-button";
import LoginGmail from "../svg/login-scherm/login-gmail";

function GoogleLogin({ children }) {
  return (
    <>
      <section className="flex flex-col gap-3 items-center h-screen relative">
        <div className="relative w-[400px] h-auto flex justify-center items-center mt-3">
          <LoginGmail />
        </div>
        <div className="relative w-[350px] h-auto">
          <div className="absolute w-full h-auto">
            <LoginGmailButton />
          </div>
          <div className="absolute top-[28px] right-[85px]">{children}</div>
        </div>

        <BundleBackground />
      </section>
    </>
  );
}
export default GoogleLogin;
