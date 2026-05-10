import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import HomeDashboard from "./HomeDashboard";
import rootReducer from "../../../State/index";

function renderWithRole(authority) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      user: {
        isLoading: false,
        isError: false,
        error: null,
        isAuthenticate: true,
        name: "",
        token: "test-token",
        user: {
          username: "pat",
          id: 1,
          roles: [{ authority }],
        },
        profilePicture: "",
      },
    },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="/home" element={<HomeDashboard />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

test("contractor sees create report and connections", () => {
  renderWithRole("contractor");
  expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /^profile$/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /view reports/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /create report/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /connections/i })).toBeInTheDocument();
});

test("trainee does not see create report", () => {
  renderWithRole("trainee");
  expect(screen.queryByRole("link", { name: /create report/i })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /view reports/i })).toBeInTheDocument();
});

test("school does not see create report but sees connections", () => {
  renderWithRole("school");
  expect(screen.queryByRole("link", { name: /create report/i })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /connections/i })).toBeInTheDocument();
});
