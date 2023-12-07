import { bgRed, blue, bold, red } from "colors";
import { RunTimeError } from "../types";

/**
 * A safe wrapper around the running program to catch errors.
 * @param entry The entry function.
 */
export function wrap(entry: () => void) {
   try {
      entry();
   } catch (err) {
      if (err instanceof RunTimeError) {
         let error = err as unknown as RunTimeError;
         logError(error);
      } else {
         let error = err as unknown as Error;
         logError(new RunTimeError(error.message));
         console.log(error.stack);
      }
   }
}

/**
 * Logs an error to the terminal output.
 */
function logError({ error, additionalInfo }: RunTimeError) {
   let firstLine = red("❌ An error occured.");
   let secondLine = `${bold(bgRed(" ERROR "))} ${red(error.message)}`;
   console.error(firstLine);
   console.error(secondLine);
   if (additionalInfo.length > 0) {
      for (const info of additionalInfo) {
         console.log(blue(info));
      }
   }
}
