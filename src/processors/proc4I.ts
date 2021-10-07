import { ProcessorState as State } from "@cs101/microprocessor";
import { P as Processor } from "@cs101/microprocessor";
import { Fire, FirePeripheral } from "../peripherals/fire";

import { Lcd, LcdPeripheral } from "../peripherals/lcd";
import { Speaker, SpeakerPeripheral } from "../peripherals/speaker";

const lcd = new LcdPeripheral();
const speaker = new SpeakerPeripheral();
const fire = new FirePeripheral();

export const processor: Processor<Lcd & Speaker & Fire> = {
  name: "4-bit Microprocessor I",
  memoryBitSize: 4,
  registerBitSize: 4,
  numMemoryAddresses: 16,
  registerNames: ["IP", "IS", "R0", "R1"],
  peripherals: [
    lcd,
    speaker,
    fire
  ],
  getUndocumentedInstruction: (_instruction: number) => {
    return {
      description: "Undefined",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        fire.catchFire(peripherals);
      },
      ipIncrement: 1
    }
  },
  instructions: [
    {
      description: "Halt",
      execute: (ps) => {
        ps.state.isHalted = true;
      },
      ipIncrement: 1
    },
    {
      description: "Increment R0 (R0 = R0 + 1)",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        State.setRegister(ps, "R0", r0 + 1);
      },
      ipIncrement: 1
    },
    {
      description: "Decrement R0 (R0 = R0 - 1)",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        State.setRegister(ps, "R0", r0 - 1);
      },
      ipIncrement: 1
    },
    {
      description: "Increment R1 (R1 = R1 + 1)",
      execute: (ps) => {
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R1", r1 + 1);
      },
      ipIncrement: 1
    },
    {
      description: "Decrement R1 (R1 = R0 - 1)",
      execute: (ps) => {
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R1", r1 - 1);
      },
      ipIncrement: 1
    },
    {
      description: "Swap R0 with R1",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r1);
        State.setRegister(ps, "R1", r0);
      },
      ipIncrement: 1
    },
    {
      description: "Beep",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        speaker.beep(peripherals);
      },
      ipIncrement: 1
    },
    {
      description: "Print R0 (decimal value is printed)",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        const value = State.getRegister(ps, "R0");

        lcd.printNumber(peripherals, value);
      },
      ipIncrement: 1
    }
  ]
};
