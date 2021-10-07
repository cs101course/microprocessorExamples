
import { processor as robo4I } from "./processors/robo4I";
import { processor as robo4II } from "./processors/robo4II";
import { processor as robo4IV } from "./processors/robo4IV";

import { processor as proc4I } from "./processors/proc4I";
import { processor as proc4IV } from "./processors/proc4IV";
import { processor as proc8IV } from "./processors/proc8IV";

export { processor as robo4I } from "./processors/robo4I";
export { processor as robo4II } from "./processors/robo4II";
export { processor as robo4IV } from "./processors/robo4IV";

export { processor as proc4I } from "./processors/proc4I";
export { processor as proc4IV } from "./processors/proc4IV";
export { processor as proc8IV } from "./processors/proc8IV";

export {
  Coordinate,
  SupportedPeripherals,
  supportsAudio,
  supportsLcd,
  supportsPixels,
  supportsRobot
} from "./types";

export {
  Action
} from "./peripherals/actions";

export {
  Pixel,
  PixelDisplay
} from "./peripherals/pixelDisplay";

export {
  Robot
} from "./peripherals/robot";

import { SupportedPeripherals } from "./types";
import { instructionHeadings as proc8XHeadings } from "./processors/proc8IV";
import { P } from "@cs101/microprocessor";

const downgrade = (
  processor: P<SupportedPeripherals>,
  name: string,
  instructionRanges: Array<string>,
  registers?: Array<string>
) => {
  const newProcessor: P<SupportedPeripherals> = {
    ...processor,
    instructions: {
      ...processor.instructions,
    },
  };

  if (registers) {
    newProcessor.registerNames = processor.registerNames.filter(
      (registerName) => !registers.includes(registerName)
    );
  }

  newProcessor.name = name;

  instructionRanges.forEach((range) => {
    const split = range.split("-");
    const [start, end] = split.length == 2 ? split : [range, range];
    let currOpCode = Number(start);

    while (currOpCode <= Number(end)) {
      const opCode = Number(currOpCode);
      delete newProcessor.instructions[opCode];
      currOpCode = opCode + 1;
    }
  });

  return newProcessor;
};


const robots4Bit: Array<P<SupportedPeripherals>> = [
  robo4I,
  robo4II,
  robo4IV,
];


export const proc4II = downgrade(proc4IV, "4-Bit Microprocessor II", ["9", "11"]);
export const proc4III = downgrade(proc4IV, "4-Bit Microprocessor III", ["13-15"]);

const processors4Bit: Array<P<SupportedPeripherals>> = [
  proc4I,
  proc4II,
  proc4III,
  proc4IV,
];

export const proc8III = downgrade(proc8IV, "8-bit Microprocessor III", ["31-38", "70-71"], ["BP"]);
export const proc8II = downgrade(proc8III, "8-bit Microprocessor II", ["27-30"]);
export const proc8I = downgrade(proc8II, "8-bit Microprocessor I", ["8-15", "64-69"], ["SP"]);

const processors8Bit: Array<P<SupportedPeripherals>> = [
  proc8I,
  proc8II,
  proc8III,
  proc8IV
];

export const allProcessors = robots4Bit.concat(processors4Bit).concat(processors8Bit);
export const allHeadings = Array(allProcessors.length).fill(undefined);
allHeadings[allProcessors.length-4] = proc8XHeadings;
allHeadings[allProcessors.length-3] = proc8XHeadings;
allHeadings[allProcessors.length-2] = proc8XHeadings;
allHeadings[allProcessors.length-1] = proc8XHeadings;

const deviceLookup: Record<string, P<SupportedPeripherals>> = {
  "ri": robo4I,
  "rii": robo4II,
  "riv": robo4IV,
  
  "4i": proc4I,
  "4ii": proc4II,
  "4iii": proc4III,
  "4iv": proc4IV,

  "8i": proc8I,
  "8ii": proc8II,
  "8iii": proc8III,
  "8iv": proc8IV
};

export const getProcessors = (devices: Array<string>) => devices ? devices.map((deviceName) => deviceLookup[deviceName]) : allProcessors;
export const getHeadings = (devices: Array<string>) => devices ? devices.map((deviceName) => deviceName.startsWith('8') ? proc8XHeadings : undefined) : allHeadings;
