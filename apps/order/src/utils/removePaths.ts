export const removePaths = (url: string, numsPathToRemove: number): string =>
  url.replace(/\+$/, "").split("/").slice(0, -numsPathToRemove).join("/");
