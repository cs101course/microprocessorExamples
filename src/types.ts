import { Lcd } from "./peripherals/lcd";
import { PixelDisplay } from "./peripherals/pixelDisplay";
import { Fire } from "./peripherals/fire";
import { Speaker } from "./peripherals/speaker";
import { RobotJourney } from "./peripherals/robot";
import { Actions } from "./peripherals/actions";

import { PS } from "@cs101/microprocessor";
export interface Coordinate {
  row: number;
  column: number;
};

type AudioPeripherals = (Lcd & Fire & Speaker) | (Lcd & Speaker) | (Lcd & PixelDisplay & Fire & Speaker);
type LcdPeripherals = (Lcd & Fire & Speaker) | (Lcd & Speaker) | (Lcd & PixelDisplay & Fire & Speaker) | Lcd;
type FirePeripherals = (Lcd & Fire & Speaker) | (Lcd & PixelDisplay & Fire & Speaker);
type PixelPeripherals = (Lcd & PixelDisplay & Fire & Speaker);
type RobotPeripherals = RobotJourney & Speaker & Actions<Coordinate> | (RobotJourney & Speaker);

export type SupportedPeripherals = AudioPeripherals | LcdPeripherals | FirePeripherals | PixelPeripherals | RobotPeripherals

export const supportsAudio = (state: PS<any>): state is PS<AudioPeripherals> => {
  return state.state.peripherals.audioBuffer !== undefined;
};

export const supportsLcd = (state: PS<any>): state is PS<LcdPeripherals> => {
  return state.state.peripherals.lcdOutput !== undefined;
};

export const supportsFire = (state: PS<any>): state is PS<FirePeripherals> => {
  return state.state.peripherals.isOnFire !== undefined;
};

export const supportsPixels = (state: PS<any>): state is PS<PixelPeripherals> => {
  return state.state.peripherals.pixels !== undefined;
};

export const supportsRobot = (state: PS<any>): state is PS<RobotPeripherals> => {
  return state.state.peripherals.robotStates !== undefined;
};
