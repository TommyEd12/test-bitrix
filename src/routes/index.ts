import { createBrowserRouter } from "react-router";
import { UserCard } from "../components/userCard";
import { ContactsTable } from "../components/contactsTable";

export const router = createBrowserRouter([
  { path: "/", Component: ContactsTable },
  { path: "/Card/:userId", Component: UserCard },
]);
