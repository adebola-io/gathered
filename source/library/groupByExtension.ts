import { extname, join } from "path";
import { Folder, Grouping } from "../types";
import { PathLike, lstatSync } from "fs";
import { warnings } from "./warnings";

/**
 * Takes in a list of files and returns a grouping
 * of them according to their file extensions.
 * @param
 */
export function groupByExtension(folder: Folder): Grouping {
   let groups: Map<string, PathLike[]> = new Map();
   let folders = [];

   for (const path of folder.entries) {
      let fullEntryPath = join(folder.path, path);
      let stats = lstatSync(fullEntryPath);
      if (stats.isDirectory()) {
         folders.push(path);
      } else {
         let extension = extname(path.toString()).slice(1);
         if (groups.has(extension)) {
            groups.get(extension)?.push(fullEntryPath);
         } else {
            let group = [fullEntryPath];
            groups.set(extension, group);
         }
      }
   }
   // if (folders.length > 0) {
   //    warnings.push(
   //       `${folders.length} folders were found in the root of the target folder. To sort all nested files, run the command with --recursive.`
   //    );
   // }
   return {
      type: "extension",
      groups,
   };
}
