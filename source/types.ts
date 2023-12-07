import { PathLike } from "fs";

export type GroupType = "extension" | "size" | "date-modified";

export interface File {
   absolutePath: string;
}

export interface Folder {
   path: string;
   entries: string[];
}

export class RunTimeError {
   error: Error;
   additionalInfo: string[] = [];
   constructor(message: string) {
      this.error = new Error(message);
   }
}

export class RuntimeWarning {
   warningMessage: string;
   constructor(message: string) {
      this.warningMessage = message;
   }
}

export interface RuntimeOptions {
   by: GroupType;
   recursive: boolean;
   target?: PathLike;
}
export const DEFAULT_OPTIONS: RuntimeOptions = {
   by: "extension",
   recursive: false,
};

export interface Grouping {
   type: GroupType;
   groups: Map<string, PathLike[]>;
}

/**
 * A function that takes in a folder
 * and groups its files based on a particular
 * grouping strategy.
 */
export interface Grouper {
   (folder: Folder, map: Map<String, PathLike[]>): Grouping;
}
