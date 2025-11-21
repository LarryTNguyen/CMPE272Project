import BuyForm from '../components/portfolio/BuyForm';
import Positions from '../components/portfolio/Positions';
import Modal from '../components/Modal';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { Plus } from 'lucide-react';

const ActiveTradeCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Current Positions</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Buy Stock
        </button>
      </div>

      {/* keep wide tables from squishing/wrapping */}
      <div className="mt-4 overflow-x-auto">
        <Positions
          onSell={(position) => {
            // hook up your Sell modal here if you have one
            console.log('Sell clicked:', position);
          }}
        />
      </div>

      {isOpen &&
        createPortal(
          <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <BuyForm onClose={() => setIsOpen(false)} />
          </Modal>,
          document.body,
        )}
    </div>
  );
};

export default ActiveTradeCard;
