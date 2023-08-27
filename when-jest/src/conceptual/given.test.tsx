import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Section, given } from "./given";

const Counter = () => {
  const [counter, setCounter] = useState(0);

  return (
    <>
      <button onClick={(x) => setCounter((v) => v + 1)}>Increment</button>
      <p data-testid="counter-text">Counter is {counter}</p>
    </>
  );
};

describe("Counter", () => {
  const sectionCounter = new Section([
    {
      name: "incrementButton",
      selector: () => screen.getByRole("button"),
      behaviors: {
        click: (item: Element) => userEvent.click(item),
      },
    },
    {
      name: "counterText",
      selector: () => screen.getByTestId("counter-text"),
    },
  ]);

  const { when, expect } = given(sectionCounter);

  it("should be 0 at first", async () => {
    render(<Counter />);

    expect("counterText").toHaveTextContent("Counter is 0");
  });

  it("should be 1 after increment", async () => {
    render(<Counter />);

    when("click", "incrementButton");

    await waitFor(() => {
      expect("counterText").toHaveTextContent("Counter is 1");
    });
  });
});
