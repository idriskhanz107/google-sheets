import React, { useState } from 'react';
import '../styles/spreadsheet.css';

const rows = 20;
const cols = 10;

const Spreadsheet = () => {
    const [data, setData] = useState({});
    const [draggedValue, setDraggedValue] = useState(null);
    const [formulaInput, setFormulaInput] = useState('');


    const handleInputChange = (row, col, value) => {
        const updatedData = { ...data, [`${row}-${col}`]: value };
        setData(updatedData);
    };

    const handleDragStart = (row, col) => {
        const cellKey = `${row}-${col}`;
        setDraggedValue(data[cellKey] || '');
    };

    const handleDrop = (row, col) => {
        if (draggedValue !== null) {
            handleInputChange(row, col, draggedValue);
        }
    };
    const handleCellClick = (row, col) => {
        setSelectedCell(`${row}-${col}`);
        setFormulaInput(data[`${row}-${col}`] || '');
    };

    const handleFormulaChange = (e) => {
        const value = e.target.value;
        setFormulaInput(value);
        if (selectedCell) {
            const [row, col] = selectedCell.split('-').map(Number);
            handleInputChange(row, col, value);
        }
    };
    return (
        <div>
            <div className="formula-bar">
                <input
                    type="text"
                    value={formulaInput}
                    onChange={handleFormulaChange}
                    placeholder="Enter a formula or value"
                />
            </div>
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
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        draggable
                                onDragStart={() => handleDragStart(rowIndex, colIndex)}
                                onDrop={() => handleDrop(rowIndex, colIndex)}
                                onDragOver={(e) => e.preventDefault()}
                        />
                    ))}
                </div>
            ))}
        </div>
        </div>
    );
};

export default Spreadsheet;
