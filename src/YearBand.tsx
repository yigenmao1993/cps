import React from 'react';
import { WeekLabel } from './data';

interface YearBandProps {
  spans: { year: string; count: number }[];
  colWidth: number;
}

const YearBand: React.FC<YearBandProps> = ({ spans, colWidth }) => {
  return (
    <div className="year-band">
      {spans.map((s, idx) => (
        <div
          key={idx}
          className="year-span"
          style={{ width: s.count * colWidth }}
        >
          {s.year}
        </div>
      ))}
    </div>
  );
};

export default YearBand;
