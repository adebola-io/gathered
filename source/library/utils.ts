import { PathLike, existsSync, mkdirSync, rename, renameSync } from "fs";
import { GroupType, Grouping, RunTimeError } from "../types";
import { basename, join } from "path";

/**
 * Creates a new runtime error.
 * @param message The main message of the error.
 * @param additionalInfo Additional, helpful error info.
 */
export function createRuntimeError(
   message: string,
   ...additionalInfo: string[]
): RunTimeError {
   let error = new RunTimeError(message);
   if (additionalInfo !== undefined) {
      error.additionalInfo = additionalInfo;
   }
   return error;
}

/**
 * Takes a grouping and writes it to disk.
 * @param grouping the grouping to distill.
 */
export function distillGrouping(grouping: Grouping, targetFolder: PathLike) {
   const createSubFolder = (pathname: string) => {
      let newFolderPath = join(targetFolder.toString(), pathname);
      let suffix = 0;
      while (existsSync(newFolderPath)) {
         suffix += 1;
      }
      newFolderPath += suffix > 0 ? suffix : "";
      mkdirSync(newFolderPath);
      return newFolderPath;
   };
   let pattern = new Pattern(grouping.type);
   for (const [key, files] of grouping.groups.entries()) {
      if (files.length == 0) continue;
      let newFolder = createSubFolder(pattern.stringify(key));
      for (const file of files) {
         let baseName = basename(file.toString());
         renameSync(file, join(newFolder, baseName));
      }
   }
}

class Pattern {
   constructor(private type: GroupType) {}
   stringify(key: string): string {
      switch (this.type) {
         case "extension":
         case "size": {
            return `${key[0].toUpperCase() + key.slice(1)} files`;
         }
         case "type":
            return key;
         default: {
            throw createRuntimeError("No pattern type defined.");
         }
      }
   }
}
