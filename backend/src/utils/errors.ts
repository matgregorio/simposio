export class AppError extends Error {
  public readonly statusCode: number;

  public readonly code: string;

  public readonly details?: unknown;

  public readonly log: boolean;

  constructor({
    message,
    statusCode = 400,
    code = 'APP_ERROR',
    details,
    log = false,
  }: {
    message: string;
    statusCode?: number;
    code?: string;
    details?: unknown;
    log?: boolean;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.log = log;
  }
}
