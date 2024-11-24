import React from 'react';
import {
  IconButton,
  TextField,
  Box,
  Checkbox,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

function DataTable({ 
  data, 
  columns, 
  onEdit, 
  onDelete,
  searchable,
  selectable,
  selected,
  onSelectAll,
  onSelectOne 
}) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredData = searchable 
    ? data.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th scope="col" className="w-12 px-3 py-3.5">
                  <Checkbox
                    checked={selected?.length === data.length}
                    onChange={onSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  {column.label}
                </th>
              ))}
              <th scope="col" className="relative px-6 py-3.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredData.map((row, rowIdx) => (
              <tr
                key={row.id}
                className={`${
                  rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-50 transition-colors duration-200`}
              >
                {selectable && (
                  <td className="w-12 px-3 py-4">
                    <Checkbox
                      checked={selected?.includes(row.id)}
                      onChange={() => onSelectOne(row.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                  >
                    {column.render ? column.render(row) : row[column.id]}
                  </td>
                ))}
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(row)}
                      className="text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50 transition-colors duration-200"
                    >
                      <EditIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(row.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                    >
                      <DeleteIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable; 