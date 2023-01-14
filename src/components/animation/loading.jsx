import loading from "./loading.json";
import { Player } from "@lottiefiles/react-lottie-player";

function LoadingAnimation() {
  return (
    <>
      <div className="mx-auto my-auto pb-3">
        <Player src={loading} className="player" loop autoplay />
      </div>
    </>
  );
}
export default LoadingAnimation;
