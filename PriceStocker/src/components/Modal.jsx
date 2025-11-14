import { RxCross2 } from 'react-icons/rx';
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    // backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-windowbg border-bordergray relative h-[30rem] w-[30rem] rounded-2xl border pt-15"
      >
        <button onClick={onClose} className="absolute top-2 right-2">
          <RxCross2 className="text-2xl text-red-700" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
