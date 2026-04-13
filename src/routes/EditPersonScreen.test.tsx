import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { createPerson, getPerson } from "../db/people";
import { EditPersonScreen } from "./EditPersonScreen";
import { PersonDetailScreen } from "./PersonDetailScreen";

function renderEditFlow(id: string) {
  const router = createMemoryRouter(
    [
      { path: "/person/:id/edit", element: <EditPersonScreen /> },
      { path: "/person/:id", element: <PersonDetailScreen /> },
      { path: "/saved", element: <p>Saved screen</p> }
    ],
    {
      initialEntries: [`/person/${id}/edit`]
    }
  );

  return render(<RouterProvider router={router} />);
}

describe("EditPersonScreen", () => {
  it("shows a confirmation dialog before deletion", async () => {
    const user = userEvent.setup();
    const entry = await createPerson({ name: "Maya", memorableThing: "Round glasses" });

    renderEditFlow(entry.id);

    await user.click(await screen.findByRole("button", { name: "Delete entry" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument();
  });

  it("preserves review progress for typo-only edits", async () => {
    const user = userEvent.setup();
    const entry = await createPerson({ name: "Maya", memorableThing: "Round glases" });

    const existing = await getPerson(entry.id);
    await waitFor(() => expect(existing).not.toBeNull());

    renderEditFlow(entry.id);

    const memorableThingInput = (await screen.findByLabelText("Add memorable thing")) as HTMLInputElement;
    await user.clear(memorableThingInput);
    await user.type(memorableThingInput, "Round glasses");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await screen.findByText("Saved person");

    const updated = await getPerson(entry.id);
    expect(updated?.reviewStage).toBe(0);
    expect(updated?.dueAt).toBe(entry.dueAt);
  });

  it("resets review progress for meaningful edits", async () => {
    const user = userEvent.setup();
    const entry = await createPerson({ name: "Maya", memorableThing: "Round glasses" });
    const originalDueAt = entry.dueAt;

    renderEditFlow(entry.id);

    const memorableThingInput = (await screen.findByLabelText("Add memorable thing")) as HTMLInputElement;
    await user.clear(memorableThingInput);
    await user.type(memorableThingInput, "Works in fintech");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await screen.findByText("Saved person");

    const updated = await getPerson(entry.id);
    expect(updated?.reviewStage).toBe(0);
    expect(updated?.dueAt).not.toBe(originalDueAt);
  });
});
