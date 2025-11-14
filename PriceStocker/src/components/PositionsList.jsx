// src/components/PositionsList.jsx
import { useEffect, useState } from 'react';
import { getPositions } from '../lib/api';

export default function PositionsList() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    getPositions().then(({ data }) => setRows(data)).catch(setErr);
  }, []);

  if (err) return <div>Error: {String(err)}</div>;
  return (
    <ul>
      {rows.map((r) => (
        <li key={`${r.ticker}-${r.updated_at}`}>{r.ticker}: {r.quantity} @ {r.average_price}</li>
      ))}
    </ul>
  );
}
