import React from 'react';

export default function NoData({ emoji = '📭', message = 'No data found', subtext = '' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      color: '#888',
      minHeight: '200px',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{emoji}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: 500 }}>{message}</div>
      {subtext && <div style={{ marginTop: '0.5rem', fontSize: '1rem', color: '#aaa' }}>{subtext}</div>}
    </div>
  );
} 