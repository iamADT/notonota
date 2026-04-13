import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the app placeholder", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Notonota" })).toBeInTheDocument();
    expect(
      screen.getByText("The app shell is in place. Feature work starts next.")
    ).toBeInTheDocument();
  });
});
