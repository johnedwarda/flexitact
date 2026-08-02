// Lightweight bridge so keyboard shortcuts trigger the same visual feedback
// (button press highlight / dial rotation) as touch on the virtual hardware.
export type HardwareInput =
  | "joy-left"
  | "joy-right"
  | "joy-center"
  | "dial-left"
  | "dial-right"
  | "dial-up"
  | "dial-down"
  | "dial-center"
  | "rotate-cw"
  | "rotate-ccw";

const EVENT_NAME = "hw-input";

export const emitHardwareInput = (input: HardwareInput) => {
  window.dispatchEvent(new CustomEvent<HardwareInput>(EVENT_NAME, { detail: input }));
};

export const onHardwareInput = (handler: (input: HardwareInput) => void) => {
  const listener = (e: Event) => handler((e as CustomEvent<HardwareInput>).detail);
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
};
