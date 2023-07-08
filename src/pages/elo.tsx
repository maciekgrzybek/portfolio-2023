import React from 'react';

export const elo = (title?: string) => (
  <div
    style={{
      backgroundColor: 'white',
      backgroundSize: '150px 150px',
      height: '100%',
      width: '100%',
      display: 'flex',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      paddingBottom: '20px',
    }}
  >
    <div
      style={{
        fontSize: 60,
        fontStyle: 'normal',
        letterSpacing: '-0.025em',
        color: 'rgba(62, 51, 85)',
        marginTop: 30,
        padding: '0 120px',
        lineHeight: 1.4,
        whiteSpace: 'pre-wrap',
        fontFamily: 'Space Grotesk',
      }}
    ></div>
    <div
      style={{
        fontSize: 60,
        fontStyle: 'normal',
        letterSpacing: '-0.025em',
        color: 'rgba(62, 51, 85)',
        marginTop: 30,
        padding: '0 120px',
        lineHeight: 1.4,
        whiteSpace: 'pre-wrap',
        fontFamily: 'Space Grotesk',
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontSize: 30,
        fontStyle: 'normal',
        letterSpacing: '-0.025em',
        color: 'rgba(62, 51, 85)',
        marginTop: 30,
        padding: '0 120px',
        lineHeight: 1.4,
        whiteSpace: 'pre-wrap',
        fontFamily: 'Space Grotesk',
      }}
    >
      Maciek Grzybek - Software Engineer
    </div>
  </div>
);
