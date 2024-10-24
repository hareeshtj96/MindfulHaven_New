import React from "react";

interface TableProps {
    columns: string[];
    data: { [key: string]: any }[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
    return (
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="py-2 px-4 border-b">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column} className="py-2 px-4 border-b text-center">
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

export default Table;