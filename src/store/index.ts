import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import type { Person } from "../types/contact";
import dayjs from "dayjs";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "X-Custom-Header": "foobar",
    "Content-Type": "application/json",
  },
});

const PAGE_SIZE = 50;

type SortOrder = "ASC" | "DESC";

interface SortingState {
  field: string | null;
  direction: SortOrder;
}

class PersonStore {
  persons: Person[] = [];
  loading: boolean = false;
  error: string | null = null;
  currentPage: number = parseInt(localStorage.getItem("page") || "1");
  totalPersons: number = 0;
  totalPages: number = 1;
  filterName: string = localStorage.getItem("name") || "";
  filterLastName: string = localStorage.getItem("lastName") || "";
  filterBirthDate: Date | null = dayjs(
    localStorage.getItem("date") || dayjs("1990-01-01 19:00")
  ).toDate();
  sortName: SortingState = { field: null, direction: "ASC" };
  sortLastName: SortingState = { field: null, direction: "ASC" };

  constructor() {
    makeAutoObservable(this);
  }

  setPage(page: number) {
    this.currentPage = page;
    localStorage.setItem("page", `${page}`);
    this.fetchPersons();
  }

  setFilterBirthDate(birthdate: Date) {
    this.filterBirthDate = birthdate;
    localStorage.setItem("date", `${birthdate}`);
    this.fetchPersons();
  }

  async setFilterName(name: string) {
    localStorage.setItem("name", `${name}`);
    this.filterName = name;
    this.currentPage = 1;
    await this.fetchPersons();
  }

  async setFilterLastName(lastName: string) {
    localStorage.setItem("lastName", `${lastName}`);
    this.filterLastName = lastName;
    this.currentPage = 1;
    await this.fetchPersons();
  }

  setSortName(field: string) {
    this.sortName =
      this.sortName.field === field
        ? {
            field,
            direction: this.sortName.direction === "ASC" ? "DESC" : "ASC",
          }
        : { field, direction: "ASC" };
    this.fetchPersons();
  }

  setSortLastName(field: string) {
    this.sortLastName =
      this.sortLastName.field === field
        ? {
            field,
            direction: this.sortLastName.direction === "ASC" ? "DESC" : "ASC",
          }
        : { field, direction: "ASC" };
    this.fetchPersons();
  }

  async fetchPersons() {
    this.loading = true;
    this.error = null;

    const start = (this.currentPage - 1) * PAGE_SIZE;

    const filter: any = {};
    if (this.filterName) {
      filter["%NAME"] = this.filterName;
    }
    if (this.filterLastName) {
      filter["%LAST_NAME"] = this.filterLastName;
    }
    if (this.filterBirthDate) {
      filter[">=BIRTHDATE"] = this.filterBirthDate;
    }

    const order: any = {};
    if (this.sortName.field) {
      order[this.sortName.field] = this.sortName.direction;
    }
    if (this.sortLastName.field) {
      order[this.sortLastName.field] = this.sortLastName.direction;
    }

    try {
      const response = await api.post<{ result: Person[]; total: number }>(
        "crm.contact.list",
        {
          start: start,
          filter: filter,
          order: order,
        }
      );

      runInAction(() => {
        this.persons = response.data.result;
        if (response.data.total !== undefined) {
          this.totalPersons = response.data.total;
          this.totalPages = Math.ceil(this.totalPersons / PAGE_SIZE);
          if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
          }
        } else {
          console.warn("Total Persons not supplied");
        }

        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || "Failed to fetch persons";
        this.loading = false;
      });
      console.error("Error fetching persons:", error);
    }
  }
}

export const personStore = new PersonStore();
