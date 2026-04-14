import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { routes } from "./app/router";

describe("App", () => {
  it("renders the default route and primary navigation", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/add-name"]
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("heading", { name: "notonota" })).toBeInTheDocument();
    expect(screen.getByText("remember who you met", { selector: ".topbar__screen" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add name" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Saved" })).toBeInTheDocument();
  });

  it("renders the experimental add-name v2 route", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/add-name-v2"]
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText("Who did you meet?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add name" })).toHaveClass("bottom-nav__link--active");
    expect(screen.getByRole("link", { name: "Saved" })).not.toHaveClass("bottom-nav__link--active");
  });
});
