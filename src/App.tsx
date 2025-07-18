import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { observer } from "mobx-react-lite";
import { type Person } from "./types/contact";
import { personStore } from "./store";
import { ContactsTable } from "./components/contactsTable";
import axios from "axios";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { router } from "./routes";

const App = observer(() => {
  return <RouterProvider router={router}></RouterProvider>;
});

export default App;
