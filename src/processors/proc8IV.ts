import { Fire, FirePeripheral } from "../peripherals/fire";
import { Lcd, LcdPeripheral } from "../peripherals/lcd";
import { PixelDisplay, PixelDisplayPeripheral } from "../peripherals/pixelDisplay";
import { Speaker, SpeakerPeripheral } from "../peripherals/speaker";
import { ProcessorState as State } from "@cs101/microprocessor";

import { Instruction, P as Processor } from "@cs101/microprocessor";

const lcd = new LcdPeripheral();
const speaker = new SpeakerPeripheral();
const pixelDisplay = new PixelDisplayPeripheral();
const fire = new FirePeripheral();

const randByte = () => Math.floor(Math.random() * 256);

type PeripheralType = Lcd & Speaker & PixelDisplay & Fire;


const undocumentedInstructions: Record<string, Instruction<PeripheralType>> = {
  "0-42": {
    description: "Undefined",
    execute: (ps) => {
      // Set R0 to random value
      State.setRegister(ps, "R0", randByte());
    },
    ipIncrement: 1
  },
  "43-48": {
    description: "Undefined",
    execute: (ps) => {
      // HCF
      const peripherals = State.getPeripherals(ps);
      fire.catchFire(peripherals);
    },
    ipIncrement: 1
  },
  "49-63": {
    description: "Undefined",
    execute: (ps) => {
      // Random Jump
      State.setRegister(ps, "IP", randByte());
    },
    ipIncrement: 1
  },
  "64-255": {
    description: "Undefined",
    execute: (ps) => {
      // Peripheral Error
      const peripherals = State.getPeripherals(ps);
      lcd.printString(peripherals, "Error");
    },
    ipIncrement: 1
  }
};

export const instructionHeadings = {
  "0": "Arithmetic",
  "16": "Moving Data: Registers and Memory",
  "27": "Moving Data: Relative to Stack Pointer",
  "31": "Moving Data: Relative to Stack Base Pointer",
  "48": "Selection / Branching",
  "64": "Stack Management",
  "128": "Peripherals"
};

export const processor: Processor<PeripheralType> = {
  name: "8-bit Microprocessor IV",
  memoryBitSize: 8,
  registerBitSize: 8,
  numMemoryAddresses: 256,
  registerNames: ["IP", "IS", "R0", "R1", "SP", "BP", "PORT"],
  columns: [
    "number",
    "mnemonic",
    "increment",
    "description",
    "code"
  ],
  peripherals: [
    lcd,
    speaker,
    pixelDisplay,
    fire
  ],
  getUndocumentedInstruction: (instruction: number) => {
    let result = null;
    Object.keys(undocumentedInstructions).forEach(key => {
      const [from, to] = key.split('-');
      if (instruction >= Number(from) && instruction <= Number(to)) {
        result = undocumentedInstructions[key];
      }
    });

    if (result) {
      return result;
    } else {
      return {
        description: "Undefined",
        execute: (ps) => {
          const peripherals = State.getPeripherals(ps);
          fire.catchFire(peripherals);
        },
        ipIncrement: 1
      }
    }
  },
  instructions: {
    "0": {
      description: "Halt",
      execute: (ps) => {
        ps.state.isHalted = true;
      },
      ipIncrement: 1,
      mnemonic: "HALT"
    },
    "1": {
      description: "Increment",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        State.setRegister(ps, "R0", r0 + 1);
      },
      ipIncrement: 1,
      mnemonic: "INC",
      code: "R0 = R0 + 1"
    },
    "2": {
      description: "Decrement",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        State.setRegister(ps, "R0", r0 - 1);
      },
      ipIncrement: 1,
      mnemonic: "DEC",
      code: "R0 = R0 - 1"
    },
    "3": {
      description: "Add",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r0 + r1);
      },
      ipIncrement: 1,
      mnemonic: "ADD",
      code: "R0 = R0 + R1"
    },
    "4": {
      description: "Subtract",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r0 - r1);
      },
      ipIncrement: 1,
      mnemonic: "SUB",
      code: "R0 = R0 - R1"
    },
    "5": {
      description: "Multiply",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r0 * r1);
      },
      ipIncrement: 1,
      mnemonic: "MUL",
      code: "R0 = R0 * R1"
    },
    "6": {
      description: "Integer Divide",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", Math.floor(r0 / r1));
      },
      ipIncrement: 1,
      mnemonic: "DIV",
      code: "R0 = R0 / R1"
    },
    "7": {
      description: "Modulo",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r0 % r1);
      },
      ipIncrement: 1,
      mnemonic: "MOD",
      code: "R0 = R0 % R1"
    },
    "8": {
      description: "Shift Left",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r0 << r1);
      },
      ipIncrement: 1,
      mnemonic: "SHL",
      code: "R0 = R0 << R1"
    },
    "9": {
      description: "Shift Right",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r0 >> r1);
      },
      ipIncrement: 1,
      mnemonic: "SHR",
      code: "R0 = R0 >> R1"
    },
    "10": {
      description: "Bitwise AND",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r0 & r1);
      },
      ipIncrement: 1,
      mnemonic: "AND",
      code: "R0 = R0 & R1"
    },
    "11": {
      description: "Bitwise OR",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r0 | r1);
      },
      ipIncrement: 1,
      mnemonic: "OR",
      code: "R0 = R0 | R1"
    },
    "12": {
      description: "Bitwise XOR",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r0 ^ r1);
      },
      ipIncrement: 1,
      mnemonic: "XOR",
      code: "R0 = R0 ^ R1"
    },
    "13": {
      description: "Bitwise NOT",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        State.setRegister(ps, "R0", ~r0);
      },
      ipIncrement: 1,
      mnemonic: "NOT",
      code: "R0 = ~R0"
    },
    "14": {
      description: "Minimum",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", Math.min(r0, r1));
      },
      ipIncrement: 1,
      mnemonic: "MIN",
      code: "R0 = min(R0, R1)"
    },
    "15": {
      description: "Maximum",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", Math.max(r0, r1));
      },
      ipIncrement: 1,
      mnemonic: "MAX",
      code: "R0 = max(R0, R1)"
    },

    "16": {
      description: "Swap the values of R0, R1",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r1);
        State.setRegister(ps, "R1", r0);
      },
      ipIncrement: 1,
      mnemonic: "SWAP",
      code: "tmp = R0; R0 = R1; R1 = tmp"
    },
    "17": {
      description: "Load (direct) <data> into R0",
      execute: (ps) => {
        const value = State.getArgument(ps);
        State.setRegister(ps, "R0", value);
      },
      ipIncrement: 2,
      mnemonic: "LDR0",
      code: "R0 = <data>"
    },
    "18": {
      description: "Load (direct) <data> into R1",
      execute: (ps) => {
        const value = State.getArgument(ps);
        State.setRegister(ps, "R1", value);
      },
      ipIncrement: 2,
      mnemonic: "LDR1",
      code: "R1 = <data>"
    },
    "19": {
      description: "Load (indirect) value at address <data> into R0",
      execute: (ps) => {
        const address = State.getArgument(ps);
        State.setRegister(ps, "R0", State.getMemoryAddress(ps, address));
      },
      ipIncrement: 2,
      mnemonic: "LIR0",
      code: "R0 = *(<data>)"
    },
    "20": {
      description: "Load (indirect) value at address <data> into R1",
      execute: (ps) => {
        const address = State.getArgument(ps);
        State.setRegister(ps, "R1", State.getMemoryAddress(ps, address));
      },
      ipIncrement: 2,
      mnemonic: "LIR1",
      code: "R1 = *(<data>)"
    },
    "21": {
      description: "Load (indirect) value at address R1 into R0",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        State.setRegister(ps, "R0", State.getMemoryAddress(ps, r0));
      },
      ipIncrement: 1,
      mnemonic: "LRR0",
      code: "R0 = *(R1)"
    },
    "22": {
      description: "Load (indirect) value at address R0 into R1",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        State.setRegister(ps, "R0", State.getMemoryAddress(ps, r0));
      },
      ipIncrement: 1,
      mnemonic: "LRR1",
      code: "R1 = *(R0)"
    },
    "23": {
      description: "Store R0 into address <data>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        State.setMemoryAddress(ps, address, State.getRegister(ps, "R0"));
      },
      ipIncrement: 2,
      mnemonic: "SDR0",
      code: "*(<data>) = R0"
    },
    "24": {
      description: "Store R1 into address <data>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        State.setMemoryAddress(ps, address, State.getRegister(ps, "R1"));
      },
      ipIncrement: 2,
      mnemonic: "SDR1",
      code: "*(<data>) = R1"
    },
    "25": {
      description: "Store R0 into address R1",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setMemoryAddress(ps, r1, r0);
      },
      ipIncrement: 1,
      mnemonic: "SRR0",
      code: "*(R1) = R0"
    },
    "26": {
      description: "Store R1 into address R0",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setMemoryAddress(ps, r0, r1);
      },
      ipIncrement: 1,
      mnemonic: "SRR1",
      code: "*(R0) = R1"
    },
    "27": {
      description: "Load value at address SP+<data> into R0",
      execute: (ps) => {
        const data = State.getArgument(ps);
        const sp = State.getRegister(ps, "SP");
        
        State.setRegister(ps, "R0", State.getMemoryAddress(ps, sp + data));
      },
      ipIncrement: 2,
      mnemonic: "LSR0",
      code: "R0 = *(SP + <data>)"
    },
    "28": {
      description: "Load value at address SP+<data> into R1",
      execute: (ps) => {
        const data = State.getArgument(ps);
        const sp = State.getRegister(ps, "SP");
        
        State.setRegister(ps, "R1", State.getMemoryAddress(ps, sp + data));
      },
      ipIncrement: 2,
      mnemonic: "LSR1",
      code: "R1 = *(SP + <data>)"
    },
    "29": {
      description: "Store R0 at address SP+<data>",
      execute: (ps) => {
        const data = State.getArgument(ps);
        const sp = State.getRegister(ps, "SP");
        
        State.setMemoryAddress(ps, sp + data, State.getRegister(ps, "R0"));
      },
      ipIncrement: 2,
      mnemonic: "SSR0",
      code: "*(SP + <data>) = R0"
    },
    "30": {
      description: "Store R1 at address SP+<data>",
      execute: (ps) => {
        const data = State.getArgument(ps);
        const sp = State.getRegister(ps, "SP");
        
        State.setMemoryAddress(ps, sp + data, State.getRegister(ps, "R1"));
      },
      ipIncrement: 2,
      mnemonic: "SSR1",
      code: "*(SP + <data>) = R1"
    },
    "31": {
      description: "Load value at address BP-<data> into R0",
      execute: (ps) => {
        const data = State.getArgument(ps);
        const bp = State.getRegister(ps, "BP");

        State.setRegister(ps, "R0", State.getMemoryAddress(ps, bp - data));
      },
      ipIncrement: 2,
      mnemonic: "LBR0",
      code: "R0 = *(BP - <data>)"
    },
    "32": {
      description: "Load value at address BP-<data> into R1",
      execute: (ps) => {
        const data = State.getArgument(ps);
        const bp = State.getRegister(ps, "BP");

        State.setRegister(ps, "R1", State.getMemoryAddress(ps, bp - data));
      },
      ipIncrement: 2,
      mnemonic: "LBR1",
      code: "R1 = *(BP - <data>)"
    },
    "33": {
      description: "Load (argument) value at address BP+<data> into R0",
      execute: (ps) => {
        const data = State.getArgument(ps);
        const bp = State.getRegister(ps, "BP");

        State.setRegister(ps, "R0", State.getMemoryAddress(ps, bp + data));
      },
      ipIncrement: 2,
      mnemonic: "LAR0",
      code: "R0 = *(BP + <data>)"
    },
    "34": {
      description: "Load (argument) value at address BP+<data> into R1",
      execute: (ps) => {
        const data = State.getArgument(ps);
        const bp = State.getRegister(ps, "BP");

        State.setRegister(ps, "R1", State.getMemoryAddress(ps, bp + data));
      },
      ipIncrement: 2,
      mnemonic: "LAR1",
      code: "R1 = *(BP + <data>)"
    },
    "35": {
      description: "Load (BP - <data>) into R0",
      execute: (ps) => {
        const data = State.getArgument(ps);
        const bp = State.getRegister(ps, "BP");
        State.setRegister(ps, "R0", bp - data);
      },
      ipIncrement: 2,
      mnemonic: "LBPR0",
      code: "R0 = BP - <data>"
    },
    "36": {
      description: "Load (BP - <data>) into R1",
      execute: (ps) => {
        const data = State.getArgument(ps);
        const bp = State.getRegister(ps, "BP");
        State.setRegister(ps, "R1", bp - data);
      },
      ipIncrement: 2,
      mnemonic: "LBPR1",
      code: "R0 = BP - <data>"
    },
    "37": {
      description: "Store R0 at address BP-<data>",
      execute: (ps) => {
        const data = State.getArgument(ps);
        const bp = State.getRegister(ps, "BP");

        State.setMemoryAddress(ps, bp - data, State.getRegister(ps, "R0"));
      },
      ipIncrement: 2,
      mnemonic: "SBR0",
      code: "*(BP - <data>) = R0"
    },
    "38": {
      description: "Store R1 at address BP-<data>",
      execute: (ps) => {
        const data = State.getArgument(ps);
        const bp = State.getRegister(ps, "BP");

        State.setMemoryAddress(ps, bp - data, State.getRegister(ps, "R1"));
      },
      ipIncrement: 2,
      mnemonic: "SBR1",
      code: "*(BP - <data>) = R1"
    },
    "48": {
      description: "Jump to address <data>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        State.setIp(ps, address);
      },
      ipIncrement: 2,
      mnemonic: "JMP",
      code: "IP = <data>"
    },
    "49": {
      description: "Jump to address <data> if R0 == 0",
      execute: (ps) => {
        if (State.getRegister(ps, "R0") === 0) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2,
      mnemonic: "JZ",
      code: "if (R0 == 0) { IP = <data> }"
    },
    "50": {
      description: "Jump to address <data> if R0 != 0",
      execute: (ps) => {
        if (State.getRegister(ps, "R0") !== 0) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2,
      mnemonic: "JNZ",
      code: "if (R0 != 0) { IP = <data> }"
    },
    "51": {
      description: "Jump to address <data> if R0 == R1",
      execute: (ps) => {
        if (State.getRegister(ps, "R0") === State.getRegister(ps, "R1")) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2,
      mnemonic: "JE",
      code: "if (R0 == R1) { IP = <data> }"
    },
    "52": {
      description: "Jump to address <data> if R0 != R1",
      execute: (ps) => {
        if (State.getRegister(ps, "R0") !== State.getRegister(ps, "R1")) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2,
      mnemonic: "JNE",
      code: "if (R0 != R1) { IP = <data> }"
    },
    "53": {
      description: "Jump to address <data> if R0 < R1",
      execute: (ps) => {
        if (State.getRegister(ps, "R0") < State.getRegister(ps, "R1")) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2,
      mnemonic: "JB",
      code: "if (R0 < R1) { IP = <data> }"
    },
    "54": {
      description: "Jump to address <data> if R0 <= R1",
      execute: (ps) => {
        if (State.getRegister(ps, "R0") <= State.getRegister(ps, "R1")) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2,
      mnemonic: "JBE",
      code: "if (R0 <= R1) { IP = <data> }"
    },
    "55": {
      description: "Jump to address <data> if (PORT & R0) != 0",
      execute: (ps) => {
        if ((State.getRegister(ps, "PORT") & State.getRegister(ps, "R0")) !== 0) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2,
      mnemonic: "JNZP",
      code: "if ((PORT & R0) != 0) { IP = <data> }"
    },
    "56": {
      description: "Jump to address <data> if (PORT & R0) == 0",
      execute: (ps) => {
        if ((State.getRegister(ps, "PORT") & State.getRegister(ps, "R0")) === 0) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2,
      mnemonic: "JZP",
      code: "if ((PORT & R0) == 0) { IP = <data> }"
    },
    "64": {
      description: "Pop (into R0)",
      execute: (ps) => {
        const sp = State.getRegister(ps, "SP");
        State.setRegister(ps, "R0", State.getMemoryAddress(ps, sp));
        State.setRegister(ps, "SP", sp + 1);
      },
      ipIncrement: 1,
      mnemonic: "POP",
      code: "R0 = *(SP); SP = SP + 1"
    },
    "65": {
      description: "Return (Pop into IP)",
      execute: (ps) => {
        const sp = State.getRegister(ps, "SP");
        State.setIp(ps, State.getMemoryAddress(ps, sp));
        State.setRegister(ps, "SP", sp + 1);
      },
      ipIncrement: 1,
      mnemonic: "RET",
      code: "IP = *(SP); SP = SP + 1"
    },
    "66": {
      description: "Push R0",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const sp = State.getRegister(ps, "SP") - 1;
        State.setRegister(ps, "SP", sp);
        State.setMemoryAddress(ps, sp, r0);
      },
      ipIncrement: 1,
      mnemonic: "PUSH",
      code: "SP = SP - 1; *(SP) = R0"
    },
    "67": {
      description: "Call function at address <data> (Push IP and Jump)",
      execute: (ps) => {
        const address = State.getArgument(ps);
        const ip = State.getIp(ps);
        const sp = State.getRegister(ps, "SP") - 1;
        State.setRegister(ps, "SP", sp);
        State.setMemoryAddress(ps, sp, ip);
        State.setIp(ps, address);
      },
      ipIncrement: 2,
      mnemonic: "CALL",
      code: "SP = SP - 1; *(SP) = IP; IP = <data>"
    },
    "68": {
      description: "Add <data> to SP (Shrink the stack)",
      execute: (ps) => {
        const bytes = State.getArgument(ps);
        const sp = State.getRegister(ps, "SP");
        State.setRegister(ps, "SP", sp + bytes);
      },
      ipIncrement: 2,
      mnemonic: "ADDSP",
      code: "SP = SP + <data>"
    },
    "69": {
      description: "Subtract <data> from SP (Grow the stack)",
      execute: (ps) => {
        const bytes = State.getArgument(ps);
        const sp = State.getRegister(ps, "SP");
        State.setRegister(ps, "SP", sp - bytes);
      },
      ipIncrement: 2,
      mnemonic: "SUBSP",
      code: "SP = SP - <data>"
    },
    "70": {
      description: "Creates a new call frame",
      execute: (ps) => {
        const bp = State.getRegister(ps, "BP");
        const sp = State.getRegister(ps, "SP") - 1;

        State.setRegister(ps, "SP", sp);
        State.setMemoryAddress(ps, sp, bp);
        State.setRegister(ps, "BP", sp);
      },
      ipIncrement: 1,
      mnemonic: "ENTER",
      code: "SP = SP - 1; *(SP) = BP; BP = SP"
    },
    "71": {
      description: "Restores old call frame",
      execute: (ps) => {
        const bp = State.getRegister(ps, "BP");
        State.setRegister(ps, "SP", bp);

        const sp = State.getRegister(ps, "SP");
        State.setRegister(ps, "BP", State.getMemoryAddress(ps, sp));
        State.setRegister(ps, "SP", sp + 1);
      },
      ipIncrement: 1,
      mnemonic: "LEAVE",
      code: "SP = BP; BP = *(SP); SP = SP + 1"
    },
    "128": {
      description: "Print R0 as unsigned integer",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        const r0 = State.getRegister(ps, "R0");

        lcd.printNumber(peripherals, r0);
      },
      ipIncrement: 1,
      mnemonic: "PRINT",
      code: "printf(\"%d\", R0)"
    },
    "129": {
      description: "Print R0 as ASCII character",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        const r0 = State.getRegister(ps, "R0");

        lcd.printAscii(peripherals, r0);
      },
      ipIncrement: 1,
      mnemonic: "PRINTC",
      code: "printf(\"%c\", R0)"
    },
    "130": {
      description: "Print R0 as a string (starting at address R0 until 0 value is reached)",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        const r0 = State.getRegister(ps, "R0");

        let i = 0;
        let char = -1;
        while (i < ps.processor.numMemoryAddresses && char !== 0) {
          char = State.getMemoryAddress(ps, r0 + i);
          lcd.printAscii(peripherals, char);
          i++;
        }
      },
      ipIncrement: 1,
      mnemonic: "PRINTS",
      code: "printf(\"%s\", R0)"
    },
    "131": {
      description: "Play a sound (R0 specifies the sound)",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        const r0 = State.getRegister(ps, "R0");

        speaker.sound(peripherals, r0);
      },
      ipIncrement: 1,
      mnemonic: "SOUND"
    },
    "132": {
      description: "Plot pixel <data> at coordinate R0, R1",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        const value = State.getArgument(ps);

        pixelDisplay.plot(peripherals, r0, r1, value);
      },
      ipIncrement: 2,
      mnemonic: "PLOT"
    }
  }
};
