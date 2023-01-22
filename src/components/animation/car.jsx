import { Player } from "@lottiefiles/react-lottie-player";
import car from "./standalonecar.json";
import smoke from "./smokecloud.json";
import road from "./road.json";
import { useDataContext } from "../../context/data";
import { useEffect, useState } from "react";

function CarAnimation() {
  const { dataMessages } = useDataContext();

  const [height, setHeight] = useState(60);

  useEffect(() => {
    if (dataMessages.children) {
      setHeight(dataMessages.children.length);
    }
  }, [dataMessages]);
  return (
    <>
      <div className="mt-auto">
        <Player
          src={smoke}
          className="player absolute bottom-[5px] left-10"
          loop
          autoplay
          style={{ height: `${height / 2}px`, maxHeight: "150px" }}
        />
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
