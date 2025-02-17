import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useReactTable,
  getFilteredRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { fetchSimilarMeals } from "../../redux/mealSlice";
import { RootState, AppDispatch } from "../../redux/store";
import "./SimilarMealsTable.css";

const SimilarMealsTable = ({ category }: { category: string }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const meals = useSelector((state: RootState) => state.meals.similarMeals);
  const [globalFilter, setGlobalFilter] = useState(""); // Local state for filtering

  // Fetch similar meals when category changes
  useEffect(() => {
    if (category) {
      dispatch(fetchSimilarMeals(category)); // Assuming the API fetches by category
    }
  }, [category, dispatch]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("", {
      id: "S.No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: "S.No",
    }),
    columnHelper.accessor("strMealThumb", {
      cell: (info) => (
        <img src={info.getValue()} alt="Meal" className="meal-image" />
      ),
      header: "Image",
    }),
    columnHelper.accessor("strMeal", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Name",
    }),
    columnHelper.accessor("idMeal", {
      cell: (info) => (
        <button
          className="view-btn"
          onClick={() => navigate(`/meal/${info.getValue()}`)}
        >
          View
        </button>
      ),
      header: "Action",
    }),
  ];
  

  // Apply filtering manually
  const filteredMeals = meals.filter((meal) =>
    meal?.strMeal?.toLowerCase().includes(globalFilter.toLowerCase())
  );

  const table = useReactTable({
    data: filteredMeals,
    columns,
    state: {
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="table-container">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search meals..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="meal-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, i) => (
              <tr key={row.id} className={i % 2 === 0 ? "even-row" : "odd-row"}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="no-data">
              <td colSpan={5}>No Records Found!</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default SimilarMealsTable;
