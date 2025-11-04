import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createClient } from '@supabase/supabase-js'
import supabase from '../services/superbase';

const InputBid = () => {


    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error', error);
            } else if (user) {
                console.log('logged in : ', user);
                setUser(user);
            } else {
                console.log('No user logged in');
            }
        };

        fetchUser();
    }, []);


    const navigate = useNavigate();

    const [stock, setStock] = useState({
        ticker: '',
        name: '',
        price: '',
        shares: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('user_portfolio')
            .insert([
                {
                    symbol: stock.ticker,
                    quantity: stock.shares,
                    purchase_price: stock.price,
                    user_id: user.id
                }
            ]);
        if (error) {
            console.error('Error: ', error);
        } else {
            console.log('successful', data);
            navigate('/dashboard')
        }

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
                                borderRadius: '5px'
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
                                borderRadius: '5px'
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
                                borderRadius: '5px'
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
                                borderRadius: '5px'
                            }}
                        />
                    </label>
                    <button type="submit" style={{
                        backgroundColor: 'lightgrey',
                        marginTop: '10px',
                        padding: '3px',
                        borderRadius: '5px'

                    }}>Submit</button>
                </div>
            </form>
        </div>
    );
}
export default InputBid