import { lstatSync } from "fs";
import { Grouping, Grouper } from "../../types";
import { join } from "path";

/** Maximum size for a tiny file (1mb) */
const TINY_FILE_MAX = 1024 * 1024;
/** Maximum size for a small file (10mb) */
const SMALL_FILE_MAX = 1024 * 1024 * 10;
/** Maximum size for a medium file (100mb) */
const MEDIUM_FILE_MAX = 1024 * 1024 * 100;
/** Maximum size for a large file (1GB) */
const LARGE_FILE_MAX = 1024 * 1024 * 1024;

/**
 * Takes in a folder and groups its files according to their size.
 * @param folder The folder to organize.
 */
export const groupBySize: Grouper = (folder, map) => {
   if (map.size === 0) {
      map.set("tiny", []);
      map.set("small", []);
      map.set("medium", []);
      map.set("large", []);
      map.set("colossal", []);
   }
   for (const path of folder.entries) {
      let fullEntryPath = join(folder.path, path);
      let stats = lstatSync(fullEntryPath);
      if (!stats.isFile()) continue;
      if (stats.size < TINY_FILE_MAX) {
         map.get("tiny")?.push(fullEntryPath);
      } else if (stats.size < SMALL_FILE_MAX) {
         map.get("small")?.push(fullEntryPath);
      } else if (stats.size < MEDIUM_FILE_MAX) {
         map.get("medium")?.push(fullEntryPath);
      } else if (stats.size < LARGE_FILE_MAX) {
         map.get("large")?.push(fullEntryPath);
      } else {
         map.get("colossal")?.push(fullEntryPath);
      }
   }
   return {
      type: "size",
      groups: map,
   } as Grouping;
};
