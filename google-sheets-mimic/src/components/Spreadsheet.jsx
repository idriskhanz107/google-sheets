import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/spreadsheet.css';

const rows = 20;
const cols = 10;


const Spreadsheet = () => {
    const [data, setData] = useState({});
    const [selectedRange, setSelectedRange] = useState('');
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [draggedValue, setDraggedValue] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);
    const [formulaInput, setFormulaInput] = useState('');

    // useEffect to fetch data from the backend
    useEffect(() => {
        axios.get('http://localhost:3001/cells')
            .then((response) => {
                const fetchedData = {};
                response.data.forEach((cell) => {
                    const key = `${cell.row_number}-${cell.column_number}`;
                    fetchedData[key] = cell.value;
                });
                setData(fetchedData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);
    const applyTrim = () => {
        updateRange((value) => value.trim());
    };

    const applyUpperCase = () => {
        updateRange((value) => value.toUpperCase());
    };

    const applyLowerCase = () => {
        updateRange((value) => value.toLowerCase());
    };

    const applyFindAndReplace = () => {
        updateRange((value) =>
            value.replace(new RegExp(findText, 'g'), replaceText)
        );
    };

    const removeDuplicates = () => {
        const uniqueValues = new Set();
        updateRange((value) => {
            if (uniqueValues.has(value)) return '';
            uniqueValues.add(value);
            return value;
        });
    };

    const updateRange = (transformFn) => {
        if (!selectedRange) return;

        const [start, end] = selectedRange.split(':');
        const [startRow, startCol] = cellToIndex(start);
        const [endRow, endCol] = cellToIndex(end);

        const updatedData = { ...data };
        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                const key = `${i}-${j}`;
                if (updatedData[key]) {
                    updatedData[key] = transformFn(updatedData[key]);
                }
            }
        }
        setData(updatedData);

        // Optional: Save updated data to the backend
        Object.keys(updatedData).forEach((key) => {
            const [row, col] = key.split('-').map(Number);
            axios.post('http://localhost:3001/cells', {
                row,
                col,
                value: updatedData[key],
            });
        });
    };

   /* const cellToIndex = (cell) => {
        const col = cell.charCodeAt(0) - 65; // 'A' = 65
        const row = parseInt(cell.slice(1), 10) - 1;
        return [row, col];
    };
    */

    // Parse formula entered by the user
    const parseFormula = (formula) => {
        try {
            if (!formula.startsWith('=')) return formula; // Not a formula

            const cleanFormula = formula.slice(1).toUpperCase(); // Remove '=' and convert to uppercase
            if (cleanFormula.startsWith('SUM')) {
                return handleSum(cleanFormula);
            } else if (cleanFormula.startsWith('AVERAGE')) {
                return handleAverage(cleanFormula);
            } else if (cleanFormula.startsWith('MAX')) {
                return handleMax(cleanFormula);
            } else if (cleanFormula.startsWith('MIN')) {
                return handleMin(cleanFormula);
            } else if (cleanFormula.startsWith('COUNT')) {
                return handleCount(cleanFormula);
            } else {
                return 'Invalid Formula';
            }
        } catch (error) {
            console.error('Error parsing formula:', error);
            return 'Error';
        }
    };

    // Formula calculation functions (SUM, AVERAGE, MAX, MIN, COUNT)
    const handleSum = (formula) => {
        const range = extractRange(formula, 'SUM');
        return calculateRange(range, (values) => values.reduce((a, b) => a + b, 0));
    };

    const handleAverage = (formula) => {
        const range = extractRange(formula, 'AVERAGE');
        return calculateRange(range, (values) => values.reduce((a, b) => a + b, 0) / values.length);
    };

    const handleMax = (formula) => {
        const range = extractRange(formula, 'MAX');
        return calculateRange(range, (values) => Math.max(...values));
    };

    const handleMin = (formula) => {
        const range = extractRange(formula, 'MIN');
        return calculateRange(range, (values) => Math.min(...values));
    };

    const handleCount = (formula) => {
        const range = extractRange(formula, 'COUNT');
        return calculateRange(range, (values) => values.length);
    };

    const extractRange = (formula, funcName) => {
        const match = formula.match(`${funcName}\\((.*)\\)`);
        if (!match) throw new Error('Invalid range');
        return match[1];
    };

    const calculateRange = (range, operation) => {
        const [start, end] = range.split(':');
        const [startRow, startCol] = cellToIndex(start);
        const [endRow, endCol] = cellToIndex(end);

        const values = [];
        for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
                const key = `${i}-${j}`;
                const value = parseFloat(data[key]) || 0;
                values.push(value);
            }
        }
        return operation(values);
    };

    const cellToIndex = (cell) => {
        const col = cell.charCodeAt(0) - 65; // 'A' = 65
        const row = parseInt(cell.slice(1), 10) - 1;
        return [row, col];
    };

    // Handle changes in cell value
    const handleInputChange = (row, col, value) => {
        const updatedData = { ...data, [`${row}-${col}`]: value };
        setData(updatedData);

        // Optionally save the data to the backend
        axios.post('http://localhost:3001/cells', {
            row,
            col,
            value,
        }).catch((error) => {
            console.error('Error saving data:', error);
        });
    };

    // Render the value of a cell, handling formulas
    const renderCellValue = (row, col) => {
        const key = `${row}-${col}`;
        const value = data[key] || '';
        if (value.startsWith('=')) {
            return parseFormula(value);
        }
        return value;
    };

    // Drag and drop functionality
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
            <div className="spreadsheet-container">
            <div className="toolbar">
                <input
                    type="text"
                    placeholder="Select Range (e.g., A1:B3)"
                    value={selectedRange}
                    onChange={(e) => setSelectedRange(e.target.value.toUpperCase())}
                />
                <button onClick={applyTrim}>TRIM</button>
                <button onClick={applyUpperCase}>UPPER</button>
                <button onClick={applyLowerCase}>LOWER</button>
                <button onClick={removeDuplicates}>REMOVE DUPLICATES</button>
                <input
                    type="text"
                    placeholder="Find"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Replace"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                />
                <button onClick={applyFindAndReplace}>FIND & REPLACE</button>
            </div>
            </div>
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
                ) 
                )}
            </div>
        </div>
    );
};

export default Spreadsheet;
