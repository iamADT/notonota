import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { routes } from "./app/router";

describe("App", () => {
  it("renders the capture route and primary navigation", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/capture"]
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("heading", { name: "Capture" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Capture" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Saved" })).toBeInTheDocument();
  });
});
