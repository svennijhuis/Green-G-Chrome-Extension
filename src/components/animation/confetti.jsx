import confetti from "./confetti.json";
import { Player } from "@lottiefiles/react-lottie-player";

function Confetti() {
  return (
    <>
      <Player
        src={confetti}
        className="absolute top-0 right-0 w-[140vh] h-auto object-cover"
        loop
        autoplay
      />
    </>
  );
}
export default Confetti;
