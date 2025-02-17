import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useReactTable,
  getFilteredRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { fetchSimilarMeals } from "../../redux/mealSlice";
import { RootState, AppDispatch } from "../../redux/store";
import "./SimilarMealsTable.css";
import { Meal } from "../../interfaces/mealInterfaces";

const SimilarMealsTable = ({ category }: { category: string }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const meals = useSelector((state: RootState) => state.meals.similarMeals);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  // Fetch similar meals when category changes
  useEffect(() => {
    if (category) {
      dispatch(fetchSimilarMeals(category)); 
      setPageIndex(0); 
    }
  }, [category, dispatch]);

  const columnHelper = createColumnHelper<Meal>();

  const columns: ColumnDef<Meal>[] = [
    columnHelper.display({
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
          onClick={() => {
            setPageIndex(0);
            navigate(`/meal/${info.getValue()}`);
            window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top smoothly
          }}
          
        >
          View
        </button>
      ),
      header: "Action",
    }),
  ];



  const table = useReactTable({
    data: meals || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      }
    },
  });

  return (
    <div className="table-container">
     

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
        <span>
          Showing {meals.length} meals
        </span>
      </div>
    </div>
  );
};

export default SimilarMealsTable;
