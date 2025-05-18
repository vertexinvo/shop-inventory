import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FaBoxOpen, FaCheck, FaEye, FaTrash } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';

const ProductGrid = ({
  products,
  selectId,
  setSelectId,
  filters,
  updateFilter,
  categories,
  brands,
  router,
  setIsDeleteModalOpen,
  show,
}) => {
  // Column Definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: '',
        field: 'checkbox',
        width: 60,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        cellRenderer: ({ data }) => (
          <div className="flex items-center ">
            <input
              id={`checkbox-${data.id}`}
              type="checkbox"
              className="hidden peer"
              checked={selectId.includes(data.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectId((prev) => [...prev, data.id]);
                } else {
                  setSelectId((prev) => prev.filter((id) => id !== data.id));
                }
              }}
            />
            
          </div>
        ),
      },
      { headerName: 'Sno', field: 'sno', width: 80, valueGetter: (params) => params.node.rowIndex + 1 },
      {
        headerName: 'Product',
        field: 'name',
        flex: 1,
        cellRenderer: ({ data }) => (
          <div
            className="cursor-pointer hover:text-cyan-600 transition"
            onClick={() => router.get(route('product.edit', data.id))}
          >
            <p className="font-medium text-gray-800">{data.name}</p>
            {data.model && <p className="text-sm text-gray-500">Model: {data.model}</p>}
          </div>
        ),
      },
      {
        headerName: 'Quantity',
        field: 'stock.quantity',
        width: 120,
        valueGetter: (params) => params.data?.stock?.quantity || 0,
      },
      {
        headerName: 'Purchase Price',
        field: 'purchase_price',
        width: 150,
        valueGetter: (params) => params.data.purchase_price || 'N/A',
      },
      {
        headerName: 'Selling Price',
        field: 'selling_price',
        width: 150,
        valueGetter: (params) => params.data.selling_price || 'N/A',
      },
      {
        headerName: 'Category',
        field: 'categories',
        width: 150,
        valueGetter: (params) =>
          params.data?.categories?.map((category) => category.name).join(', ') || 'N/A',
        headerComponent: () => (
          <div className="flex items-center gap-2">
            Category
            <select
              className="appearance-none bg-cyan-600 text-white text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
            >
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        ),
      },
      {
        headerName: 'Brand',
        field: 'brands',
        width: 150,
        valueGetter: (params) => params.data?.brands?.map((brand) => brand.name).join(', ') || 'N/A',
        headerComponent: () => (
          <div className="flex items-center gap-2">
            Brand
            <select
              className="appearance-none bg-cyan-600 text-white text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              value={filters.brand}
              onChange={(e) => updateFilter('brand', e.target.value)}
            >
              <option value="">All</option>
              {brands.map((brand) => (
                <option key={brand.name} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        ),
      },
      {
        headerName: 'Stock Status',
        field: 'stock.status',
        width: 150,
        cellRenderer: ({ data }) => (
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onClick={() =>
                router.put(route('product.status', data.id), {}, { preserveScroll: true })
              }
              className="sr-only peer"
              checked={data?.stock?.status || false}
            />
            <div className="w-11 h-6 flex items-center bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
          </label>
        ),
        headerComponent: () => (
          <div className="flex items-center gap-2">
            Stock Status
            <select
              className="appearance-none bg-cyan-600 text-white text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <option value="">All</option>
              <option value="1">In Stock</option>
              <option value="0">Out of Stock</option>
            </select>
          </div>
        ),
      },
      {
        headerName: 'Actions',
        field: 'actions',
        width: 150,
        cellRenderer: ({ data }) => (
          <div className="flex items-center space-x-4">
            <a
              href={route('product.show', data.code || data.id)}
              className="text-cyan-500 hover:text-cyan-700 transition text-sm flex items-center gap-1"
              title="View"
            >
              <FaEye className="w-4 h-4" />
            </a>
            <a
              href={route('product.edit', data.id)}
              className="text-yellow-500 hover:text-yellow-700 transition text-sm flex items-center gap-1"
              title="Edit"
            >
              <FaPencil className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsDeleteModalOpen(data)}
              className="text-red-500 hover:text-red-700 transition text-sm flex items-center gap-1"
              title="Delete"
            >
              <FaTrash className="w-4 h-4" />
            </button>
            {data.identity_type !== 'imei' && (
              <a
                href={route('stock.index', { product_id: data.id })}
                className="text-green-500 hover:text-green-700 transition text-sm flex items-center gap-1"
                title="Stock"
              >
                <FaBoxOpen className="w-4 h-4" />
              </a>
            )}
          </div>
        ),
      },
    ],
    [selectId, setSelectId, filters, updateFilter, categories, brands, router, setIsDeleteModalOpen]
  );

  // Row Class Rules for Conditional Styling
  const getRowClass = (params) => {
    if (params.data?.stock?.quantity === 0 || params.data?.stock?.quantity === null) {
      return 'bg-red-50 hover:bg-red-100';
    }
    return params.node.rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50';
  };

  // Handle Context Menu
  const onRowRightClicked = useCallback(
    (event) => {
      event.event.preventDefault();
      show({ event: event.event, props: event.data });
    },
    [show]
  );

  // Default Column Definitions
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      cellClass: 'text-gray-700 p-4',
    }),
    []
  );

  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      <div className="ag-theme-alpine h-[600px]">
        <AgGridReact
          rowData={products.data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressRowClickSelection
          getRowClass={getRowClass}
          onRowClicked={(event) => {
            // Prevent row selection on action clicks
            if (event.event.target.tagName !== 'INPUT' && event.event.target.tagName !== 'A') {
              const isSelected = selectId.includes(event.data.id);
              if (isSelected) {
                setSelectId((prev) => prev.filter((id) => id !== event.data.id));
              } else {
                setSelectId((prev) => [...prev, event.data.id]);
              }
            }
          }}
          onRowRightClicked={onRowRightClicked}
          noRowsOverlayComponent={() => (
            <div className="p-6 text-center text-gray-500">No products found.</div>
          )}
        />
      </div>
    </div>
  );
};

export default ProductGrid;