import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { createPerson, listPeople } from "../db/people";
import { ReviewScreen } from "./ReviewScreen";

describe("ReviewScreen", () => {
  it("completes one review step and advances the schedule", async () => {
    const user = userEvent.setup();

    await createPerson(
      { name: "Maya", memorableThing: "Round glasses" },
      new Date("2026-04-10T12:15:00.000Z")
    );

    render(
      <MemoryRouter>
        <ReviewScreen />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole("button", { name: "Got it" }));

    await screen.findByText("Nothing due right now");

    const [entry] = await listPeople();
    expect(entry.reviewStage).toBe(1);
  });

  it("reveals then resets the card on missed it", async () => {
    const user = userEvent.setup();

    const [entry] = await Promise.all([
      createPerson(
        { name: "Maya", memorableThing: "Round glasses" },
        new Date("2026-04-10T12:15:00.000Z")
      )
    ]);

    render(
      <MemoryRouter>
        <ReviewScreen />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole("button", { name: "Missed it" }));

    expect(await screen.findByRole("heading", { name: "Maya" })).toBeInTheDocument();

    await waitFor(async () => {
      const [updatedEntry] = await listPeople();
      expect(updatedEntry.reviewStage).toBe(0);
      expect(updatedEntry.id).toBe(entry.id);
    });
  });
});

