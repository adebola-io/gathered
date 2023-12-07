import { join } from "path";
import { DEFAULT_OPTIONS, Folder, RuntimeOptions } from "../types";
import { createRuntimeError } from "./utils";
import { existsSync, lstatSync, readdirSync } from "fs";

/**
 * Utility function to retrieve the folder name from the
 * command line arguments.
 */
export function getFolder(mode: 1 | 2): Folder {
   const args = process.argv.slice(2);
   let folderPath = args[0];
   if (folderPath === undefined || folderPath.startsWith("--")) {
      let correctFormat =
         (mode == 1 ? "gather" : "ungather") + " <folderPath> [...options]";
      throw createRuntimeError(
         "The folder to group was not specified.",
         `The correct command format is ${correctFormat}`
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

const SUPPORTED_OPTIONS = [
   "by", // set the grouping strategy.
   "recursive", // set the grouping to be recursive into nested folders.
   "target", // specifies the folder where the grouping should be output.
] as const;

/**
 * Utility function to retrieve the options
 * from the command line arguments.
 */
export function getOptions(mode: 1 | 2): RuntimeOptions {
   const args = process.argv.slice(3);
   let options = {} as RuntimeOptions;
   for (const argument of args) {
      if (argument.startsWith("--")) {
         let argumentMapping = argument
            .slice(2)
            .split("=")
            .map((a) => a.toLowerCase());
         if (argumentMapping.length !== 2) {
            throw createRuntimeError(
               `Could not parse the command line option ${argument}.`,
               'The syntax for an option is "--optionName=value".'
            );
         }
         const [argname, argvalue] = argumentMapping as unknown as [
            keyof RuntimeOptions,
            string
         ];
         if (options[argname] !== undefined) {
            throw createRuntimeError(`Duplicate option --${argname}.`);
         } else {
            (options as any)[argname] = argvalue;
            switch (argname) {
               case "recursive": {
                  if (!/true|false/.test(argvalue)) {
                     throw createRuntimeError(
                        "Unrecognized value for command --recursive",
                        "The supported values are --recursive=true and --recursive=false."
                     );
                  }
                  break;
               }
               case "by":
                  if (mode === 2) {
                     throw createRuntimeError(
                        '--by can only be used for gathering with the "gather" command.'
                     );
                  }
            }
         }
      } else {
         throw createRuntimeError(
            `Could not parse the command line option ${argument}.`,
            'The syntax for an option is "--optionName=value".'
         );
      }
   }
   return { ...DEFAULT_OPTIONS, ...options };
}
