class ResponseError extends Error {
  constructor(status, messages) {
    super(messages);
    this.status = status;
  }
}

export { ResponseError };
