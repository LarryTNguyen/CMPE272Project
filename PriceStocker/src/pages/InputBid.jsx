import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
const InputBid = () => {


    const navigate = useNavigate();

    const [stock, setStock] = useState({
        ticker: '',
        name: '',
        price: '',
        shares: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("ticker", stock.ticker)
        data.append("name", stock.name)
        data.append("shares", stock.shares)
        data.append("price",stock.price)

        console.log(data)

    }
    const handleTickerChange = (e) => {
        setStock({
            ...stock,
            ticker: e.target.value
        })
    }
    const handleNameChange = (e) => {
        setStock({
            ...stock,
            name: e.target.value
        });
    }
    const handlePriceChange = (e) => {
        setStock({
            ...stock,
            price: e.target.value
        });
    }
    const handleSharesChange = (e) => {
        setStock({
            ...stock,
            shares: e.target.value
        });
    }


    return (
        <div >
            <Navbar />
            <Outlet />
            <form onSubmit={handleSubmit} >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <label style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        width: '100%',
                        maxWidth: '320px',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        color: '#1f2937'
                    }}>
                        Stock Ticker:
                        <input
                            value={stock.ticker}
                            onChange={handleTickerChange}
                            style={{
                                backgroundColor: 'lightgrey',
                                borderRadius:'5px'
                            }}
                        />
                    </label>

                    <label style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        width: '100%',
                        maxWidth: '320px',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        color: '#1f2937'
                    }}>
                        Name:
                        <input
                            value={stock.name}
                            onChange={handleNameChange}
                            style={{
                                backgroundColor: 'lightgrey',
                                borderRadius:'5px'
                            }}

                        />
                    </label>
                    <label style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        width: '100%',
                        maxWidth: '320px',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        color: '#1f2937'
                    }}>
                        Price:
                        <input
                            value={stock.price}
                            onChange={handlePriceChange}
                                                        style={{
                                backgroundColor: 'lightgrey',
                                borderRadius:'5px'
                            }}
                        />
                    </label>
                    <label style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        width: '100%',
                        maxWidth: '320px',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        color: '#1f2937'
                    }}>
                        Shares:
                        <input
                            value={stock.shares}
                            onChange={handleSharesChange}
                                                        style={{
                                backgroundColor: 'lightgrey',
                                borderRadius:'5px'
                            }}
                        />
                    </label>
                    <button type="submit"                             style={{
                                backgroundColor: 'lightgrey',
                                marginTop:'10px',
                                padding:'3px',
                                borderRadius:'5px'
                                
                            }}>Submit</button>
                </div>
            </form>
        </div>
    );
}
export default InputBid