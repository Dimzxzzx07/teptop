export const isSuccess = status => status >= 200 && status < 300; export const isRetryable = status => status === 408 || status >= 500;
