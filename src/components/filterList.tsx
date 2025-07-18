import React from "react";
import { observer } from "mobx-react-lite";
import { personStore } from "../store/index";
import "./filterList.css";
import { debounce } from "../utils/debounce";
import dayjs from "dayjs";

interface FilterListProps {
  onNameFilterChange: (name: string) => void;
  onBirthDateFilterChange: (date: string) => void;
  onLastNameFilterChange: (lastName: string) => void;
  nameFilter: string;
  birthDateFilter: string;
  lastNameFilter: string;
}

export const FilterList: React.FC<FilterListProps> = observer(
  ({
    birthDateFilter,
    onBirthDateFilterChange,
  }) => {
    const debouncedNameFilter = React.useMemo(
      () =>
        debounce((value: string) => {
          personStore.setFilterName(value);
        }, 300),
      []
    );

    const debouncedLastNameFilter = React.useMemo(
      () =>
        debounce((value: string) => {
          personStore.setFilterLastName(value);
        }, 300),
      []
    );

    const filterByDate = (value: string) => {
      personStore.setFilterBirthDate(dayjs(value).toDate());
    };


    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      personStore.filterName = value; 
      debouncedNameFilter(value); 
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      personStore.filterLastName = value; 
      debouncedLastNameFilter(value); 
    };

    return (
      <div className="filter-list">
        <div className="cont">
          <label htmlFor="nameFilter">Имя:</label>
          <input
            type="text"
            id="nameFilter"
            value={personStore.filterName}
            onChange={handleNameChange}
          />
        </div>
        <div className="cont">
          <label htmlFor="lastNameFilter">Фамилия:</label>
          <input
            type="text"
            id="lastNameFilter"
            value={personStore.filterLastName}
            onChange={handleLastNameChange}
          />
        </div>
        <div className="cont">
          <label htmlFor="birthDateFilter">Дата рождения от:</label>
          <input
            type="date" 
            id="birthDateFilter"
            value={dayjs(personStore.filterBirthDate).toISOString().slice(0,10)}
            placeholder={
              personStore.filterBirthDate?.toDateString() || "01.01.1900"
            }
            onChange={(e) => {
              onBirthDateFilterChange(e.target.value);
            }}
          />
          <button onClick={() => filterByDate(birthDateFilter)}>Найти</button>
        </div>
      </div>
    );
  }
);