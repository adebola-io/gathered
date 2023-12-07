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
   groupingType: GroupType;
}
export const DEFAULT_OPTIONS: RuntimeOptions = {
   groupingType: "extension",
};

export interface Grouping {
   type: GroupType;
   groups: Map<string, PathLike[]>;
}
