import BuyForm from '../components/portfolio/BuyForm';
import Positions from '../components/portfolio/Positions';
import Modal from '../components/Modal';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { Plus } from 'lucide-react';
const ActiveTradeCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 rounded-2xl border bg-background shadow-sm px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-ring`}>
      <Plus className="h-4 w-4" />
      
        Buy Stock
      </button>
      <div className="mt-2 flex gap-4">
      <Positions />
      {isOpen &&
        createPortal(
          <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <BuyForm onClose={() => setIsOpen(false)} />
          </Modal>,
          document.body,
        )}

      </div>
    </>
  );
};

export default ActiveTradeCard;