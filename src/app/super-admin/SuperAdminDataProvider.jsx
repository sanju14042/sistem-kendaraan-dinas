"use client";

import { createContext, useContext, useState } from "react";
import {
  mockAgencies,
  mockEmployees,
  mockLoans,
  mockVehicles,
} from "@/lib/mock-data";

const SuperAdminDataContext = createContext(null);

export function SuperAdminDataProvider({ children }) {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [employees, setEmployees] = useState(mockEmployees);
  const [agencies, setAgencies] = useState(mockAgencies);
  const [loans, setLoans] = useState(mockLoans);

  return (
    <SuperAdminDataContext.Provider
      value={{
        vehicles,
        setVehicles,
        employees,
        setEmployees,
        agencies,
        setAgencies,
        loans,
        setLoans,
      }}
    >
      {children}
    </SuperAdminDataContext.Provider>
  );
}

export function useSuperAdminData() {
  const context = useContext(SuperAdminDataContext);
  if (!context) {
    throw new Error(
      "useSuperAdminData harus digunakan di dalam SuperAdminDataProvider.",
    );
  }

  return context;
}
