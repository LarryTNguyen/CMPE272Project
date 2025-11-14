import React from "react";
import TransactionsPage from "../components/TransactionsPage";
const Transactions = ({ user }) => {
  return (
    <main className="p-6">
        <TransactionsPage user={user} />    
    </main>
    ); 
};

export default Transactions;