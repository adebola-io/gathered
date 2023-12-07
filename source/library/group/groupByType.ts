import { PathLike, lstatSync } from "fs";
import { Grouping, Grouper, FileType } from "../../types";
import { extname, join } from "path";

/**
 * Takes in a folder and groups its files according to its type.
 * @param folder The folder to organize.
 */
export const groupByType: Grouper = (folder, _map) => {
   let map = _map as unknown as Map<FileType, PathLike[]>;
   if (map.size === 0) {
      map.set("Images", []);
      map.set("Documents", []);
      map.set("Music", []);
      map.set("Other", []);
      map.set("Source Files", []);
      map.set("Videos", []);
   }
   for (const path of folder.entries) {
      let fullEntryPath = join(folder.path, path);
      let stats = lstatSync(fullEntryPath);
      if (!stats.isFile()) continue;
      let extension = extname(path).slice(1);
      map.get(getType(extension))?.push(fullEntryPath);
   }
   return {
      type: "type",
      groups: map,
   } as Grouping;
};

/**
 * Returns the type of the file based on the extension.
 * @param extension The file extension.
 */
const getType = (extension: string): FileType => {
   switch (extension) {
      case "png":
      case "jpeg":
      case "jpg":
      case "gif":
      case "webp":
      case "bmp":
      case "tiff":
      case "svg":
      case "eps":
         return "Images";
      case "pdf":
      case "txt":
      case "doc":
      case "docx":
      case "odt":
      case "rtf":
      case "epub":
      case "csv":
      case "ods":
      case "xls":
      case "xlsx":
         return "Documents";
      case "js":
      case "jsx":
      case "tsx":
      case "ts":
      case "rs":
      case "py":
      case "css":
      case "html":
      case "xhtml":
      case "psd":
      case "java":
      case "wrl":
      case "cpp":
      case "c":
      case "go":
      case "kt":
         return "Source Files";
      case "mp4":
      case "mkv":
      case "mov":
      case "wmv":
      case "webm":
      case "avchd":
         return "Videos";
      case "mp3":
      case "aac":
      case "wma":
      case "ogg":
      case "wav":
      case "alac":
      case "m4a":
      case "midi":
      case "dsd":
      case "opus":
         return "Music";
      default:
         return "Other";
   }
};
