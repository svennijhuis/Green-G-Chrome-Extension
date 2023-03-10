import styles from "./Information.module.scss";
import { useDataContext } from "../../context/data";

function CarInformation() {
  const { co2InGram } = useDataContext();
  const CalcCo2InGram = ((co2InGram / 1000) * 4.5).toFixed(1);
  return (
    <>
      <div className="absolute bottom-0 right-0">
        <div className={styles.block_text}>
          <p className="text-16 font-medium italic">
            jouw CO2 verbruik staat gelijk aan
          </p>
          <h1 className={`text-35 ${styles.title}`}>{CalcCo2InGram} km</h1>
          <p className="text-16 font-medium italic">rijden met de auto</p>
        </div>
        <div className={styles.div_shapes}>
          <div className={styles.div_shapes__inner}>
            <div className="absolute top-0 left-0 w-full h-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CarInformation;
