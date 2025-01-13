import React, { useState } from 'react';
import '../styles/spreadsheet.css';

const rows = 20;
const cols = 10;

const Spreadsheet = () => {
    const [data, setData] = useState({});

    const handleInputChange = (row, col, value) => {
        const updatedData = { ...data, [`${row}-${col}`]: value };
        setData(updatedData);
    };

    return (
        <div className="spreadsheet">
            <div className="header-row">
                <div className="header-cell"></div>
                {Array.from({ length: cols }, (_, i) => (
                    <div key={i} className="header-cell">
                        {String.fromCharCode(65 + i)}
                    </div>
                ))}
            </div>
            {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="row">
                    <div className="row-header">{rowIndex + 1}</div>
                    {Array.from({ length: cols }, (_, colIndex) => (
                        <input
                            key={`${rowIndex}-${colIndex}`}
                            className="cell"
                            value={data[`${rowIndex}-${colIndex}`] || ''}
                            onChange={(e) =>
                                handleInputChange(rowIndex, colIndex, e.target.value)
                            }
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Spreadsheet;
