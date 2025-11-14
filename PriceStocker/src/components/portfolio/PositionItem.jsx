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
      <div className="mt-1 grid grid-cols-[10rem_8rem_11rem_11rem_11rem_10rem_12rem_12rem_10rem] items-center border-t py-2 text-center">
        <div>{ticker}</div>
        <div>{quantity}</div>
        <div>{avg_price}</div>
        <div>{current_price}</div>
        <div>{total_cost}</div>
        <div>{total_value}</div>
        <div>${dollar_change}</div>
        <div>{percent_change}%</div>
        <div>
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-sm bg-blue-400 px-4 py-0.5 hover:bg-blue-600"
          >
            sell
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
