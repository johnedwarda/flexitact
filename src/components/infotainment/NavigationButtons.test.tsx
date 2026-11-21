import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import NavigationButtons from "./NavigationButtons";
import { InfotainmentProvider } from "./InfotainmentContext";

// jsdom has no PointerEvent, so coordinates would be dropped without this.
if (!("PointerEvent" in window)) {
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number;
    constructor(type: string, init: MouseEventInit & { pointerId?: number } = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 0;
    }
  }
  (window as unknown as { PointerEvent: unknown }).PointerEvent = PointerEventPolyfill;
}

// jsdom has no layout or pointer capture, so stub the bits the dial drag relies on.
const mockRing = (ring: HTMLElement) => {
  ring.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON() {} }) as DOMRect;
  ring.setPointerCapture = vi.fn();
};

// Point on a circle of radius 50 around (50, 50), angle in degrees (0 = right, 90 = down).
const at = (deg: number) => ({
  clientX: 50 + 50 * Math.cos((deg * Math.PI) / 180),
  clientY: 50 + 50 * Math.sin((deg * Math.PI) / 180),
});

const rotation = (ring: HTMLElement) => Number(/rotate\((-?[\d.]+)deg\)/.exec(ring.style.transform)?.[1]);

describe("NavigationButtons dial", () => {
  it("has no separate rotate buttons", () => {
    render(
      <InfotainmentProvider>
        <NavigationButtons />
      </InfotainmentProvider>,
    );
    expect(screen.queryByLabelText("Rotate clockwise")).toBeNull();
    expect(screen.queryByLabelText("Rotate counter-clockwise")).toBeNull();
  });

  it("rotates in 15 degree steps when dragged around the ring", () => {
    render(
      <InfotainmentProvider>
        <NavigationButtons />
      </InfotainmentProvider>,
    );
    const ring = screen.getByRole("slider");
    mockRing(ring);

    fireEvent.pointerDown(ring, { pointerId: 1, ...at(-90) });
    fireEvent.pointerMove(ring, { pointerId: 1, ...at(-59) }); // +31 deg clockwise: two 15 deg steps
    expect(rotation(ring)).toBe(30);

    fireEvent.pointerMove(ring, { pointerId: 1, ...at(-79) }); // -20 deg: one step back
    expect(rotation(ring)).toBe(15);

    fireEvent.pointerUp(ring, { pointerId: 1 });
    fireEvent.pointerMove(ring, { pointerId: 1, ...at(0) }); // ignored after release
    expect(rotation(ring)).toBe(15);
  });
});
