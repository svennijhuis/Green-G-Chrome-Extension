import ModalSVG from "./modal-svg";
function Modal({ children }) {
  return (
    <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed w-[500px] h-auto z-[14]">
      <div className="relative w-full h-full">
        <ModalSVG />
        <div className="modal-body w-full h-full absolute top-0 right-0">
          {children}
        </div>
      </div>
    </div>
  );
}
export default Modal;
