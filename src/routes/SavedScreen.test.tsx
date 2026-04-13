import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { createPerson } from "../db/people";
import { SavedScreen } from "./SavedScreen";

describe("SavedScreen", () => {
  it("shows the newest entries first and labels incomplete ones", async () => {
    await createPerson({ name: "Older", memorableThing: "First entry" }, new Date("2026-04-10T12:00:00.000Z"));
    await createPerson({ name: "Newest" }, new Date("2026-04-11T12:00:00.000Z"));

    render(
      <MemoryRouter>
        <SavedScreen />
      </MemoryRouter>
    );

    const personHeadings = await screen.findAllByRole("heading", { level: 3 });
    expect(personHeadings[0]).toHaveTextContent("Newest");
    expect(personHeadings[1]).toHaveTextContent("Older");
    expect(screen.getByText("Needs detail")).toBeInTheDocument();
  });

  it("searches by descriptor instead of requiring the name", async () => {
    const user = userEvent.setup();

    await createPerson(
      { name: "Maya", memorableThing: "Round glasses", whereMet: "Design meetup" },
      new Date("2026-04-10T12:00:00.000Z")
    );
    await createPerson(
      { name: "Ayo", memorableThing: "Fintech founder", whereMet: "Coffee queue" },
      new Date("2026-04-11T12:00:00.000Z")
    );

    render(
      <MemoryRouter>
        <SavedScreen />
      </MemoryRouter>
    );

    await user.type(screen.getByRole("textbox"), "fintech");

    const listCard = await screen.findByText("Recent entries");
    const listSection = listCard.closest(".list-card");
    expect(listSection).not.toBeNull();
    expect(within(listSection as HTMLElement).getByText("Ayo")).toBeInTheDocument();
    expect(within(listSection as HTMLElement).queryByText("Maya")).not.toBeInTheDocument();
  });
});
