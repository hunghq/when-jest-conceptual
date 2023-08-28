import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { useState } from "react";
import { Section, given } from "./given";

const Counter = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div data-testid="counter-wrapper">
      <button onClick={(x) => setCounter((v) => v + 1)}>Increment</button>
      <p data-testid="counter-text">Counter is {counter}</p>
    </div>
  );
};

describe("Counter", () => {
  const sectionCounter = new Section([
    {
      name: "Counter",
      selector: () => screen.getByTestId("counter-wrapper"),
    },
    {
      name: "incrementButton",
      selector: (section) =>
        within(section.retrieve("Counter")).getByRole("button"),
      behaviors: {
        click: fireEvent.click,
      },
    },
    {
      name: "counterText",
      selector: (section) =>
        within(section.retrieve("Counter")).getByTestId("counter-text"),
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
