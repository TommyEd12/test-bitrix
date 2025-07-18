import React, { useEffect, useState } from "react";
import { api } from "../http";
import type { Person } from "../types/contact";
import "./userCard.css";

export const UserCard = () => {
  const userId = document.URL.split("/").at(-1);
  const [person, setPerson] = useState<Person>();
  useEffect(() => {
    const callApi = async () => {
      const response = await api.post<{ result: Person[]; total: number }>(
        "crm.contact.list",
        {
          SELECT: ["ID", "NAME", "LAST_NAME", "EMAIL", "BIRTHDATE"],
          FILTER: { ID: userId },
        }
      );
      setPerson(response.data.result[0]);
    };
    callApi();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h2>
          {person?.NAME + " "}
          {person?.LAST_NAME}
        </h2>
      </div>
      <div className="card-body">
        <span>
          Email пользователя: <strong>{person?.EMAIL[0].VALUE}</strong>
        </span>{" "}
        <span>
          Дата рождения: <strong>{person?.BIRTHDATE.slice(0, 10)}</strong>
        </span>
      </div>
    </div>
  );
};
