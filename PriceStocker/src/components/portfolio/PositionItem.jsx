import { useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from '../Modal';
import SellForm from './SellForm';

const PositionItem = ({
  ticker,
  quantity,
  avg_price,
  current_price,
  total_cost,
  total_value,
  dollar_change,
  percent_change,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="mt-1 grid grid-cols-9 items-center border-t py-2 text-center">
        <div>{ticker}</div>
        <div>{quantity}</div>
        <div>{avg_price}</div>
        <div>{current_price}</div>
        <div>{total_cost}</div>
        <div>{total_value}</div>
        <div
          className={
            total_cost < total_value
              ? 'text-green-500'
              : total_cost > total_value
                ? 'text-red-500'
                : ''
          }
        >
          ${dollar_change}
        </div>
        <div
          className={
            total_cost < total_value
              ? 'text-green-500'
              : total_cost > total_value
                ? 'text-red-500'
                : ''
          }
        >
          {percent_change}%
        </div>
        <div>
          <button
            onClick={() => setIsOpen(true)}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:scale-95 transition font-medium"          >
            Sell
          </button>
        </div>
        {isOpen &&
          createPortal(
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
              <SellForm onClose={() => setIsOpen(false)} />
            </Modal>,
            document.body,
          )}
      </div>
    </>
  );
};

export default PositionItem;

