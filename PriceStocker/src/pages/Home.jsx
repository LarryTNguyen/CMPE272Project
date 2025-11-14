// import AddFunds from '../components/AddFunds';
import BuyForm from '../components/portfolio/BuyForm';
import Positions from '../components/portfolio/Positions';
import Modal from '../components/Modal';
import { createPortal } from 'react-dom';
import { useState } from 'react';
const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-blue-500 p-2"
      >
        Buy Stock
      </button>
      <Positions />
      {isOpen &&
        createPortal(
          <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <BuyForm onClose={() => setIsOpen(false)} />
          </Modal>,
          document.body,
        )}
    </>
  );
};

export default Home;
