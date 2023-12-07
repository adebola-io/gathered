import { green } from "colors";
import { existsSync, lstatSync, readdirSync } from "fs";
import path from "path";

import { wrap } from "./library/wrapper";
import { DEFAULT_OPTIONS, Folder, Grouping, RuntimeOptions } from "./types";
import { groupByExtension } from "./library/groupByExtension";
import { createRuntimeError, distillGrouping } from "./library/utils";

/**
 * Entry into the program.
 * It parses the command line arguments and initiates commands based on them.
 */
function start() {
   let folder = getFolder();
   let options = getOptions();
   let grouping: Grouping;
   switch (options.groupingType) {
      case "extension":
      default: {
         grouping = groupByExtension(folder);
         break;
      }
   }
   distillGrouping(grouping, folder.path);
   let noOfFiles = folder.entries.length;
   let noOfFolder = grouping.groups.keys.length;
   let finalMessage = `${noOfFiles} files grouped by ${grouping.type} into ${noOfFolder} folders.`;
   console.log(green(finalMessage));
}

function getFolder(): Folder {
   const args = process.argv.slice(2);
   let folderPath = args[0];
   if (folderPath == undefined) {
      throw createRuntimeError(
         "The folder to group was not specified.",
         'The correct command format is "gather <folderPath> [...options]"'
      );
   }
   let absolutePath = path.join(__dirname, folderPath);
   if (!existsSync(absolutePath)) {
      throw createRuntimeError(
         `The folder to group does not exist.`,
         `Folder specified: ${absolutePath}`
      );
   }
   if (!lstatSync(absolutePath).isDirectory()) {
      throw createRuntimeError(`${folderPath} does not refer to a folder.`);
   }
   const folder: Folder = {
      path: absolutePath,
      entries: readdirSync(absolutePath),
   };
   return folder;
}

function getOptions(): RuntimeOptions {
   return DEFAULT_OPTIONS;
}

wrap(start);
