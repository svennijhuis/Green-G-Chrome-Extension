import { Player } from "@lottiefiles/react-lottie-player";
import car from "./drivingcar.json";
import road from "./road.json";

function CarAnimation() {
  return (
    <>
      <div className="mt-auto">
        <Player
          src={car}
          className="player-car"
          loop
          autoplay
          style={{ height: "60px" }}
        />
        <Player
          src={road}
          className="player"
          loop
          autoplay
          style={{ height: "10px", marginTop: "-18px" }}
        />
      </div>
    </>
  );
}
export default CarAnimation;
