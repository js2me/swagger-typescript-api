import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";
import { consola } from "consola";

const FILE_PREFIX = `/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

`;

export class FileSystem {
  getFileContent = (path: string) => {
    return fs.readFileSync(path, { encoding: "utf8" });
  };

  readDir = (path: string) => {
    return fs.readdirSync(path);
  };

  pathIsDir = (path: string) => {
    if (!path) return false;

    try {
      const stat = fs.statSync(path);
      return stat.isDirectory();
    } catch (e) {
      return false;
    }
  };

  cropExtension = (fileName: string) => {
    const fileNameParts = fileName.split(".");

    if (fileNameParts.length > 1) {
      fileNameParts.pop();
    }

    return fileNameParts.join(".");
  };

  removeDir = (path: string) => {
    try {
      if (typeof fs.rmSync === "function") {
        fs.rmSync(path, { recursive: true });
      } else {
        fs.rmdirSync(path, { recursive: true });
      }
    } catch (e) {
      consola.debug("failed to remove dir", e);
    }
  };

  createDir = (path: string) => {
    try {
      fs.mkdirSync(path, { recursive: true });
    } catch (e) {
      consola.debug("failed to create dir", e);
    }
  };

  cleanDir = (path: string) => {
    this.removeDir(path);
    this.createDir(path);
  };

  pathIsExist = (path: string) => {
    return !!path && fs.existsSync(path);
  };

  createFile = ({ path: path_, fileName, content, withPrefix }) => {
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const absolutePath = path.resolve(__dirname, path_, `./${fileName}`);
    const fileContent = `${withPrefix ? FILE_PREFIX : ""}${content}`;

    return fs.writeFileSync(absolutePath, fileContent);
  };
}
