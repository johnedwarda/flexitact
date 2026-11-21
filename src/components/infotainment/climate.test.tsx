import { describe, it, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import ClimateAppView from "./ClimateAppView";
import { InfotainmentProvider } from "./InfotainmentContext";

class RO {
  observe() {}
  disconnect() {}
  unobserve() {}
}
(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = RO;

const setup = () =>
  render(
    <InfotainmentProvider>
      <ClimateAppView />
    </InfotainmentProvider>,
  );

describe("ClimateAppView", () => {
  it("renders every cabin control", () => {
    setup();
    for (const name of [
      "Driver warmer",
      "Passenger cooler",
      "Driver seat heating, level 1",
      "Steering wheel heating",
      "Windscreen defrost",
      "Left mirror heating",
      "Right mirror heating",
      "Fan faster",
    ]) {
      expect(screen.getByLabelText(name)).toBeTruthy();
    }
  });

  it("adjusts only the chosen zone", () => {
    setup();
    fireEvent.click(screen.getByLabelText("Passenger warmer"));
    expect(screen.getAllByText("23°").length).toBe(1); // passenger only
    fireEvent.click(screen.getByLabelText("Driver cooler"));
    expect(screen.getAllByText("21°").length).toBe(1);
    expect(screen.getAllByText("23°").length).toBe(1);
  });

  it("cycles seat heat 0-3 and toggles steering heat", () => {
    setup();
    const heat = () => screen.getByLabelText(/^Passenger seat heating/);
    expect(heat().getAttribute("aria-label")).toContain("level 0");
    fireEvent.click(heat());
    expect(heat().getAttribute("aria-label")).toContain("level 1");
    fireEvent.click(heat());
    fireEvent.click(heat());
    fireEvent.click(heat());
    expect(heat().getAttribute("aria-label")).toContain("level 0");

    const wheel = screen.getByLabelText("Steering wheel heating");
    expect(wheel.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(wheel);
    expect(wheel.getAttribute("aria-pressed")).toBe("true");
  });

  it("Sync makes driver and passenger temperatures follow each other", () => {
    setup();
    fireEvent.click(screen.getByLabelText("Passenger warmer")); // passenger 23, driver 22
    fireEvent.click(screen.getByTitle("Sync driver and passenger temperatures"));
    expect(screen.getAllByText("22°").length).toBe(2); // passenger snaps to driver
    fireEvent.click(screen.getByLabelText("Passenger warmer"));
    expect(screen.getAllByText("23°").length).toBe(2); // both move together
  });
});
