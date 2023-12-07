import * as colors from "colors";
import { existsSync, lstatSync, readdirSync } from "fs";
import { join } from "path";

import { wrap } from "./library/wrapper";
import { DEFAULT_OPTIONS, Folder, Grouping, RuntimeOptions } from "./types";
import { groupByExtension } from "./library/groupByExtension";
import { createRuntimeError, distillGrouping } from "./library/utils";

const { bold, blue, green, underline } = colors;

/**
 * Entry into the program.
 * It parses the command line arguments and initiates commands based on them.
 */
function start() {
   const args = process.argv.slice(2);
   if (args.length === 0) {
      let gather = underline(bold(green("Gathered")));
      let firstline = `${gather} (v0.0.1) is a command line tool for organizing files. 🎁`;
      let secondLine = bold(`Usage: gather <folderPath> [..options]`);
      console.log(firstline);
      console.log(secondLine);
      return;
   }
   let folder = getFolder();
   let options = getOptions();
   let grouping: Grouping;
   switch (options.groupingType) {
      case "extension": {
         grouping = groupByExtension(folder);
         break;
      }
      default: {
         throw createRuntimeError("The grouping strategy was not specified.");
      }
   }
   distillGrouping(grouping, folder.path);
   let noOfFiles = folder.entries.length;
   let noOfFolders = grouping.groups.size;
   let pluralFile = noOfFiles == 1 ? "" : "s";
   let pluralFolder = noOfFolders == 1 ? "" : "s";
   let finalMessage = `🧹 ${noOfFiles} file${pluralFile} grouped by ${grouping.type} into ${noOfFolders} folder${pluralFolder}.`;
   console.log(blue(finalMessage));
}

function getFolder(): Folder {
   const args = process.argv.slice(2);
   let folderPath = args[0];
   if (folderPath === undefined || folderPath.startsWith("--")) {
      throw createRuntimeError(
         "The folder to group was not specified.",
         'The correct command format is "gather <folderPath> [...options]"'
      );
   }
   let absolutePath = join(process.cwd(), folderPath);
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
