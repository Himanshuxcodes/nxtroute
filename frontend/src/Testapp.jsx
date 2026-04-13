import { useState } from 'react';
import api from './api';

export default function TestApp() {
  const [data, setData] = useState(null);

  const create = async () => {
    const res = await api.post('/api/interviews/create', {
      title: "JavaScript",
      accessCode: "NXT-123"
    });
    setData(res.data);
  };

  return (
    <div style={{ padding: 40 }}>
      <button onClick={create}>Create Interview</button>

      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}