import { extname, join } from "path";
import { Grouping, Grouper } from "../../types";
import { lstatSync } from "fs";

/**
 * Takes in a list of files, and arranges them
 * according to their file extensions into a grouping.
 * @param folder The folder to organize.
 */
export const groupByExtension: Grouper = (folder, map) => {
   let folders = [];
   for (const path of folder.entries) {
      let fullEntryPath = join(folder.path, path);
      let stats = lstatSync(fullEntryPath);
      if (stats.isDirectory()) {
         folders.push(path);
      } else {
         let extension = extname(path.toString()).slice(1);
         if (map.has(extension)) {
            map.get(extension)?.push(fullEntryPath);
         } else {
            let group = [fullEntryPath];
            map.set(extension, group);
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
      groups: map,
   } as Grouping;
};
