export function logError(error: Error, errorCode: number = 99): void {
  console.error(`Error ${errorCode}: ${error.message}`);
}

export function logInfo(message: string, infoCode: number = 90): void {
  console.info(`Info ${infoCode}: ${message}`);
}
