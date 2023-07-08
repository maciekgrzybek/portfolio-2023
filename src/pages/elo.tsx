import React from 'react';

export const elo = (title?: string) => (
  <div
    style={{
      backgroundColor: 'black',
      backgroundSize: '150px 150px',
      height: '100%',
      width: '100%',
      display: 'flex',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      flexWrap: 'nowrap',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        justifyItems: 'center',
      }}
    >
      <img
        alt="Vercel"
        height={200}
        src="data:image/svg+xml,%3Csvg width='116' height='100' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M57.5 0L115 100H0L57.5 0z' /%3E%3C/svg%3E"
        style={{ margin: '0 30px' }}
        width={232}
      />
    </div>
    <div
      style={{
        fontSize: 60,
        fontStyle: 'normal',
        letterSpacing: '-0.025em',
        color: 'white',
        marginTop: 30,
        padding: '0 120px',
        lineHeight: 1.4,
        whiteSpace: 'pre-wrap',
      }}
    >
      {title}
    </div>
  </div>
);
