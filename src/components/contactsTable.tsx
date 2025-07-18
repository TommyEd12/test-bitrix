import React, { useState } from "react";
import type { Person } from "../types/contact";
import { observer } from "mobx-react-lite";
import { personStore } from "../store/index";
import "./contactsTable.css";
import { useEffect } from "react";
import { FilterList } from "./filterList";
import { useNavigate } from "react-router-dom";

export const ContactsTable = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    personStore.fetchPersons();
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= personStore.totalPages) {
      personStore.setPage(page);
    }
  };

  const [nameFilter, setNameFilter] = useState("");
  const [lastNameFilter, setLastNameFilter] = useState("");
  const [birthDateFilter, setBirthDateFilter] = useState("");

  const handleSortName = (field: string) => {
    personStore.setSortName(field);
  };

  const handleSortLastName = (field: string) => {
    personStore.setSortLastName(field);
  };

  const handleNameFilterChange = (name: string) => {
    setNameFilter(name);
  };

  const handleFilterBirthDate = (birthdate: string) => {
    setBirthDateFilter(birthdate);
  };

  const handleLastNameFilterChange = (lastName: string) => {
    setLastNameFilter(lastName);
  };

  if (personStore.error) {
    return <div>Error: {personStore.error}</div>;
  }

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const { currentPage, totalPages } = personStore;

    // Always show first page
    pageNumbers.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`btn ${1 === currentPage ? "active" : ""}`}
      >
        1
      </button>
    );

    // Show ellipsis if current page is far from start
    if (currentPage > 3) {
      pageNumbers.push(<span key="ellipsis-start">...</span>);
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`btn ${i === currentPage ? "active" : ""}`}
          >
            {i}
          </button>
        );
      }
    }

    // Show ellipsis if current page is far from end
    if (currentPage < totalPages - 2) {
      pageNumbers.push(<span key="ellipsis-end">...</span>);
    }

    // Always show last page if there are multiple pages
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`btn ${totalPages === currentPage ? "active" : ""}`}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="contacts-table">
      <FilterList
        onBirthDateFilterChange={handleFilterBirthDate}
        onNameFilterChange={handleNameFilterChange}
        onLastNameFilterChange={handleLastNameFilterChange}
        nameFilter={nameFilter}
        birthDateFilter={birthDateFilter}
        lastNameFilter={lastNameFilter}
      />

      <table className="contacts">
        <thead>
          <tr>
            <th scope="col">
              <button onClick={() => handleSortName("NAME")}>
                Имя{" "}
                {personStore.sortName.field === "NAME"
                  ? personStore.sortName.direction === "ASC"
                    ? "▲"
                    : "▼"
                  : ""}
              </button>
            </th>
            <th scope="col">
              <button onClick={() => handleSortLastName("LAST_NAME")}>
                Фамилия{" "}
                {personStore.sortLastName.field === "LAST_NAME"
                  ? personStore.sortLastName.direction === "ASC"
                    ? "▲"
                    : "▼"
                  : ""}
              </button>
            </th>
            <th scope="col">Дата рождения</th>
          </tr>
        </thead>
        <tbody className="my-table">
          {personStore.persons.map((person: Person) => (
            <tr
              className="table-row"
              onClick={() => navigate(`/Card/${person.ID}`)}
              key={person.ID}
            >
              <td>{person.NAME}</td>
              <td>{person.LAST_NAME}</td>
              <td>{person.BIRTHDATE.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {personStore.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(personStore.currentPage - 1)}
            disabled={personStore.currentPage === 1}
            className="btn nav-btn"
          >
            {"<"}
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(personStore.currentPage + 1)}
            disabled={personStore.currentPage === personStore.totalPages}
            className="btn nav-btn"
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
});