import { Lcd, LcdPeripheral } from "../peripherals/lcd";
import { Speaker, SpeakerPeripheral } from "../peripherals/speaker";
import { ProcessorState as State } from "@cs101/microprocessor";

import { P as Processor } from "@cs101/microprocessor";
import { Fire, FirePeripheral } from "../peripherals/fire";

const lcd = new LcdPeripheral();
const speaker = new SpeakerPeripheral();
const fire = new FirePeripheral();

export const processor: Processor<Lcd & Speaker & Fire> = {
  name: "4-bit Microprocessor IV",
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
      description: "Add (R0 = R0 + R1)",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r0 + r1);
      },
      ipIncrement: 1
    },
    {
      description: "Subtract (R0 = R0 - R1)",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r0 - r1);
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
    },
    {
      description: "Load (direct) value <data> into R0",
      execute: (ps) => {
        const value = State.getArgument(ps);
        
        State.setRegister(ps, "R0", value);
      },
      ipIncrement: 2
    },
    {
      description: "Load (indirect) value at address <data> into R0",
      execute: (ps) => {
        const address = State.getArgument(ps);
        
        State.setRegister(ps, "R0", State.getMemoryAddress(ps, address));
      },
      ipIncrement: 2
    },
    {
      description: "Load (indirect) value at address <data> into R1",
      execute: (ps) => {
        const address = State.getArgument(ps);
        
        State.setRegister(ps, "R1", State.getMemoryAddress(ps, address));
      },
      ipIncrement: 2
    },
    {
      description: "Store R0 into address <data>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        
        State.setMemoryAddress(ps, address, State.getRegister(ps, "R0"));
      },
      ipIncrement: 2
    },
    {
      description: "Store R1 into address <data>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        
        State.setMemoryAddress(ps, address, State.getRegister(ps, "R1"));
      },
      ipIncrement: 2
    },
    {
      description: "Jump to address <data>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        State.setIp(ps, address);
      },
      ipIncrement: 2
    },
    {
      description: "Jump to address <data> if R0 == 0",
      execute: (ps) => {
        if (State.getRegister(ps, "R0") === 0) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2
    },
    {
      description: "Jump to address <data> if R0 != 0",
      execute: (ps) => {
        if (State.getRegister(ps, "R0") !== 0) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2
    }
  ]
};
