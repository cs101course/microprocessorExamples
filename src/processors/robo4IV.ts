import { RobotJourney, RobotPeripheral } from "../peripherals/robot";
import { Speaker, SpeakerPeripheral } from "../peripherals/speaker";
import { Actions, ActionsPeripheral } from "../peripherals/actions";

import { ProcessorState as State, P as Processor } from "@cs101/microprocessor";
import { Coordinate } from "../types";

const robot = new RobotPeripheral();
const speaker = new SpeakerPeripheral();
const actions = new ActionsPeripheral<Coordinate>();

export const processor: Processor<RobotJourney & Speaker & Actions<Coordinate>> = {
  name: "Robot IV",
  memoryBitSize: 4,
  registerBitSize: 4,
  numMemoryAddresses: 16,
  registerNames: ["IP", "IS", "R"],
  peripherals: [
    robot,
    speaker,
    actions
  ],
  getUndocumentedInstruction: (_instruction: number) => {
    return {
      description: "Undefined",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        speaker.beep(peripherals);
      },
      ipIncrement: 1
    }
  },
  instructions: {
    "0": {
      description: "Halt",
      execute: (ps) => {
        ps.state.isHalted = true;
      },
      ipIncrement: 1
    },
    "1": {
      description: "Increment R (R = R + 1)",
      execute: (ps) => {
        const r = State.getRegister(ps, "R");
        State.setRegister(ps, "R", r + 1);
      },
      ipIncrement: 1
    },
    "2": {
      description: "Increment R (R = R + 1)",
      execute: (ps) => {
        const r = State.getRegister(ps, "R");
        State.setRegister(ps, "R", r + 1);
      },
      ipIncrement: 1
    },
    "3": {
      description: "Drive forward one unit",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);

        robot.move(peripherals, 1);
      },
      ipIncrement: 1
    },
    "4": {
      description: "Turn Left",
      execute: (ps) => {
        robot.turnLeft(State.getPeripherals(ps));
      },
      ipIncrement: 1
    },
    "5": {
      description: "Turn Right",
      execute: (ps) => {
        robot.turnRight(State.getPeripherals(ps));
      },
      ipIncrement: 1
    },
    "6": {
      description: "Flip Switch",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        const lastState = peripherals.robotStates[peripherals.numRobotSteps];

        actions.performAction(peripherals, {
          name: "flipSwitch",
          data: {
            row: lastState.row,
            column: lastState.column,
          }
        });
      },
      ipIncrement: 1
    },
    "7": {
      description: "Beep",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        speaker.beep(peripherals);
      },
      ipIncrement: 1
    },
    "8": {
      description: "Load (direct) value <data> into R",
      execute: (ps) => {
        const value = State.getArgument(ps);
        
        State.setRegister(ps, "R", value);
      },
      ipIncrement: 2
    },
    "9": {
      description: "Load (indirect) value at address <data> into R",
      execute: (ps) => {
        const address = State.getArgument(ps);
        
        State.setRegister(ps, "R", State.getMemoryAddress(ps, address));
      },
      ipIncrement: 2
    },
    "12": {
      description: "Store R into address <data>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        
        State.setMemoryAddress(ps, address, State.getRegister(ps, "R"));
      },
      ipIncrement: 2
    },
    "13": {
      description: "Jump to address <data>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        State.setIp(ps, address);
      },
      ipIncrement: 2
    },
    "14": {
      description: "Jump to address <data> if R == 0",
      execute: (ps) => {
        if (State.getRegister(ps, "R") === 0) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2
    },
    "15": {
      description: "Jump to address <data> if R != 0",
      execute: (ps) => {
        if (State.getRegister(ps, "R") !== 0) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2
    }
  }
};
