/**
 * Node 18 lacks global File; undici (@sanity/client) needs it.
 * Loaded before the seed script via: node --import ./scripts/register-file-polyfill.mjs
 */
import { Blob } from "node:buffer";

if (typeof globalThis.File === "undefined") {
  class File extends Blob {
    constructor(bits, name, options = {}) {
      super(bits, options);
      this.name = String(name);
      this.lastModified = options.lastModified ?? Date.now();
    }
    get [Symbol.toStringTag]() {
      return "File";
    }
  }
  globalThis.File = File;
}
