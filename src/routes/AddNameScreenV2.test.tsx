import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { listPeople } from "../db/people";
import { AddNameScreenV2 } from "./AddNameScreenV2";

describe("AddNameScreenV2", () => {
  it("starts with the name prompt only", () => {
    render(
      <MemoryRouter>
        <AddNameScreenV2 />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add memorable thing" })).not.toBeInTheDocument();
    expect(screen.queryByText("Start with a name, then choose what detail you want to add.")).not.toBeInTheDocument();
  });

  it("reveals detail prompt choices when next confirms the name", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AddNameScreenV2 />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Name"), "Maya");
    expect(screen.queryByRole("button", { name: "Add memorable thing" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByRole("button", { name: "Add memorable thing" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add where you met" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add another detail" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
  });

  it("uses next to move through the detail flow and saves the draft", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AddNameScreenV2 />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Name"), "Ayo");
    await user.click(screen.getByRole("button", { name: "Confirm name" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByLabelText("Memorable thing")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Memorable thing"), "Fintech founder");
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.queryByLabelText("Memorable thing")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Saved Ayo");
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.queryByLabelText("Memorable thing")).not.toBeInTheDocument();

    const people = await listPeople();
    expect(people).toHaveLength(1);
    expect(people[0].memorableThing).toBe("Fintech founder");
    expect(people[0].dueAt).not.toBeNull();
  });

  it("clears the draft when delete is pressed", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AddNameScreenV2 />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Name"), "Maya");
    await user.click(screen.getByRole("button", { name: "Confirm name" }));
    await user.click(screen.getByRole("button", { name: "Add where you met" }));
    await user.type(screen.getByLabelText("Where you met"), "Design meetup");
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.queryByLabelText("Where you met")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add where you met" })).not.toBeInTheDocument();

    await waitFor(async () => {
      const people = await listPeople();
      expect(people).toHaveLength(0);
    });
  });
});
