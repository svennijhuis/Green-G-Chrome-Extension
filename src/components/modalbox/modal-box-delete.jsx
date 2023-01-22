function Modal({ onClose, children }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <button onClick={onClose}>X</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
export default Modal;
