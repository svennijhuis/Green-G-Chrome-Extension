import Background from "./background-bottom";
import BackgroundMount from "./background-mount";

function BundleBackground() {
  return (
    <>
      <section className="absolute bottom-0 right-0 -z-50 left-0">
        <div className="relative">
          <Background />
          <BackgroundMount />
        </div>
      </section>
    </>
  );
}
export default BundleBackground;
