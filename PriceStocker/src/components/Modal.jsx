const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    // backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center  bg-white/85 backdrop-blur-sm"
    >
      <div onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2">
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
