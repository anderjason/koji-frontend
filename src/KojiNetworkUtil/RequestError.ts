export class RequestError extends Error {
  constructor(message?: string) {
    super(message || "The request could not be completed");

    Object.setPrototypeOf(this, RequestError.prototype);
  }
}
