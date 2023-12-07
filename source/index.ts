import * as colors from "colors";
import { wrap } from "./library/wrapper";
import { Grouping } from "./types";
import { groupByExtension, groupBySize, groupByType } from "./library/group";
import {
   createRuntimeError,
   distillGrouping,
   getAllFiles,
   move,
} from "./library/utils";
import { getFolder, getOptions } from "./library/cli";

const { bold, blue, green, underline } = colors;
const MODES = {
   GATHERING: 1,
   UNGATHERING: 2,
} as const;

function start(mode: 1 | 2) {
   const args = process.argv.slice(2);
   if (args.length === 0) {
      let correctFormat =
         (mode == 1 ? "gather" : "ungather") + " <folderPath> [...options]";
      let gather = underline(bold(green("Gathered")));
      let firstline = `${gather} (v0.0.1) is a command line tool for organizing files. 🎁`;
      let secondLine = bold(`Usage: ${correctFormat}`);
      console.log(firstline);
      console.log(secondLine);
      process.exit(1);
   }
}

/**
 * Entry into the program.
 * It parses the command line arguments and initiates gathering commands based on them.
 */
function gather() {
   start(MODES.GATHERING);
   let folder = getFolder(MODES.GATHERING);
   let options = getOptions(MODES.GATHERING);
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
            `Unknown grouping strategy. There is no support for grouping by "${options.by}".`
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
   let finalMessage = `🧹 Gathered ${noOfFiles} file${pluralFile} by ${grouping.type} into ${noOfFolders} folder${pluralFolder}.`;
   console.log(blue(finalMessage));
}

/**
 * Second Entry into the program.
 * It parses the command line arguments and initiates ungathering commands based on them.
 */
export function ungather() {
   start(MODES.UNGATHERING);
   let folder = getFolder(MODES.UNGATHERING);
   let options = getOptions(MODES.UNGATHERING);
   let outputFolder = options.target || folder.path;

   let files = getAllFiles(folder.path, { recursive: options.recursive });
   for (const file of files) {
      move(file, outputFolder);
   }
   let noOfFiles = files.length;
   let pluralFile = noOfFiles == 1 ? "" : "s";
   let finalMessage = `🧵 Unrolled ${noOfFiles} file${pluralFile} into folder.`;
   console.log(blue(finalMessage));
}

export const gatherFiles = () => wrap(gather);
export const ungatherFiles = () => wrap(ungather);
