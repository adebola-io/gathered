import * as colors from "colors";
import { existsSync, lstatSync, readdirSync } from "fs";
import { join } from "path";

import { wrap } from "./library/wrapper";
import { DEFAULT_OPTIONS, Folder, Grouping, RuntimeOptions } from "./types";
import { groupByExtension, groupBySize, groupByType } from "./library/group";
import { createRuntimeError, distillGrouping } from "./library/utils";
import { getFolder, getOptions } from "./library/cli";

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
   let map = new Map();
   switch (options.by) {
      case "extension": {
         grouping = groupByExtension(folder, map);
         break;
      }
      case "size": {
         grouping = groupBySize(folder, map);
         break;
      }
      case "type": {
         grouping = groupByType(folder, map);
         break;
      }
      default: {
         throw createRuntimeError(
            `Unknown grouping strategy. There is no support for grouping by ${options.by}`
         );
      }
   }
   let outputFolder = options.target || folder.path;
   distillGrouping(grouping, outputFolder);

   let noOfFiles = 0;
   for (const values of grouping.groups.values()) {
      noOfFiles += values.length;
   }
   let noOfFolders = grouping.groups.size;
   let pluralFile = noOfFiles == 1 ? "" : "s";
   let pluralFolder = noOfFolders == 1 ? "" : "s";
   let finalMessage = `🧹 ${noOfFiles} file${pluralFile} grouped by ${grouping.type} into ${noOfFolders} folder${pluralFolder}.`;
   console.log(blue(finalMessage));
}

wrap(start);
