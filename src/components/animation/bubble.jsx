import bubble from "./bubblepop.json";
import { Player } from "@lottiefiles/react-lottie-player";

function Bubble() {
  return (
    <>
      <Player
        src={bubble}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full"
        autoplay
      />
    </>
  );
}
export default Bubble;
