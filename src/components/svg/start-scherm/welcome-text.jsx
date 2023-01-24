import styles from "./welcometext.module.scss";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
function WelcomeText() {
  const personData = jwt_decode(Cookies.get("token"));
  return (
    <>
      <div className={styles.block}>
        <div className={styles.block__inner_1}></div>
        <div className={styles.block__inner_2}></div>
        <div className={styles.block__inner_3}></div>
        <div className={styles.block__inner_4}></div>
        <h2 className="text-white text-40 font-medium top-[50px] left-[37%] absolute">
          Hallo
        </h2>
        <h2 className="text-white text-40 font-medium top-[110px] left-[16%] absolute w-[77%] text-center">
          {personData.name}
        </h2>
        <h2 className="text-white text-16 text-end top-[182px] left-[1%] absolute w-[90%]">
          Jouw mailbox kan volzitten met onbelangrijke e-mails
        </h2>
        <h2 className="text-white text-16 text-start top-[256px] left-[10%] absolute w-[80%]">
          Deze e-mails van jou hebben wel een effect op het CO2 uitstoot van de
          Google dataserver
        </h2>
      </div>
    </>
  );
}
export default WelcomeText;
