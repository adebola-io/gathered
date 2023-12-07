import {
   PathLike,
   existsSync,
   lstatSync,
   mkdirSync,
   readdirSync,
   renameSync,
} from "fs";
import { GroupType, Grouping, RunTimeError } from "../types";
import { basename, isAbsolute, join } from "path";

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
export function distillGrouping(grouping: Grouping, target: PathLike) {
   let targetFolder = folderToAbsolutePath(target);
   const createSubFolder = (pathname: string) => {
      let newFolderPath = join(targetFolder.toString(), pathname);
      newFolderPath = mkDirOrGetExisting(newFolderPath);
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

type GetFilesOptions = {
   recursive?: boolean;
};

export function folderToAbsolutePath(target: PathLike) {
   let targetFolder = target.toString();
   if (!isAbsolute(targetFolder)) {
      targetFolder = join(process.cwd(), target.toString());
   }
   if (existsSync(targetFolder)) {
      if (!lstatSync(targetFolder).isDirectory()) {
         throw createRuntimeError(
            `The target specified does not refer to a folder.`
         );
      }
   } else mkdirSync(targetFolder);
   return targetFolder;
}

/**
 * Creates a folder, iff the folder does not already exist.
 */
export function mkDirOrGetExisting(newFolderPath: string) {
   if (existsSync(newFolderPath)) {
      return newFolderPath;
   }
   mkdirSync(newFolderPath);
   return newFolderPath;
}

/**
 * Retrieves a list of the absolute paths of all files in a folder.
 * By default it only checks the first level of subfolders.
 * @param dir The folder to return files from.
 * @param options Retrieval options.
 */
export function getAllFiles(
   dir: PathLike,
   options?: GetFilesOptions,
   _level?: number
): PathLike[] {
   let level = _level || 0;
   let dirEntries = readdirSync(dir);
   let files: PathLike[] = [];

   for (const entry of dirEntries) {
      let fullEntryPath = join(dir.toString(), entry);
      let stats = lstatSync(fullEntryPath);
      if (!stats.isFile()) {
         if (level == 0 && stats.isDirectory()) {
            files.push(...getAllFiles(fullEntryPath, options, level + 1));
         } else if (options && options.recursive && stats.isDirectory()) {
            files.push(...getAllFiles(fullEntryPath, options, level + 1));
         }
      } else if (level > 0) {
         files.push(fullEntryPath);
      }
   }
   return files;
}

/**
 * Function to move a file into a folder.
 * @param file The file to move
 * @param target The folder to move it into.
 */
export function move(file: PathLike, target: PathLike) {
   let base = basename(file.toString());
   let newHome = join(target.toString(), base);
   let suffix = 0;
   while (existsSync(newHome + `${suffix > 0 ? "_" + suffix : ""}`)) {
      suffix += 1;
   }
   newHome += `${suffix > 0 ? "_" + suffix : ""}`;
   renameSync(file, newHome);
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
