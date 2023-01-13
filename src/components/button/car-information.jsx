import styles from "./Information.module.scss";

function CarInformation() {
  return (
    <>
      <div className="absolute bottom-0 right-0">
        <div className={styles.block_text}>
          <p className="text-13 font-bold">Jouw gebruik staat gelijk aan</p>
          <p className={`text-30 font-bold ${styles.title}`}>93 km</p>
          <p className="text-12 font-bold">Jouw gebruik staat gelijk aan</p>
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
