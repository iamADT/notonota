import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { listPeople } from "../db/people";
import { CaptureScreen } from "./CaptureScreen";

describe("CaptureScreen", () => {
  it("keeps save disabled until a name is entered", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CaptureScreen />
      </MemoryRouter>
    );

    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton).toBeDisabled();

    await user.type(screen.getByLabelText("Name"), "Maya");

    expect(saveButton).toBeEnabled();
  });

  it("creates a name-only entry, clears the form, and shows a success toast", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CaptureScreen />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText("Name");

    await user.type(nameInput, "Maya");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Saved Maya");
    expect(nameInput).toHaveValue("");

    const people = await listPeople();
    expect(people).toHaveLength(1);
    expect(people[0].dueAt).toBeNull();
  });

  it("creates a reviewable entry when one detail is provided", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CaptureScreen />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Name"), "Ayo");
    await user.click(screen.getByText("Add more details"));
    await user.type(screen.getByLabelText("Add memorable thing"), "Fintech founder");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByRole("status");
    const people = await listPeople();

    expect(people[0].dueAt).not.toBeNull();
  });

  it("shows a duplicate warning before allowing another save", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CaptureScreen />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Name"), "Maya");
    await user.click(screen.getByRole("button", { name: "Save" }));
    await screen.findByRole("status");

    await user.type(screen.getByLabelText("Name"), "Maya");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText(/Possible duplicate/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save anyway" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save anyway" }));

    await waitFor(async () => {
      const people = await listPeople();
      expect(people).toHaveLength(2);
    });
  });
});

