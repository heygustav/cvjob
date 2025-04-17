
import { ErrorMetadata } from './types';

export const ERROR_METADATA: Record<string, ErrorMetadata> = {
  NETWORK_ERROR: {
    category: 'network',
    severity: 'error',
    retryable: true,
    code: 'ERR_NETWORK'
  },
  AUTH_ERROR: {
    category: 'auth',
    severity: 'error',
    retryable: true,
    code: 'ERR_AUTH'
  },
  VALIDATION_ERROR: {
    category: 'validation',
    severity: 'warning',
    retryable: false,
    code: 'ERR_VALIDATION'
  },
  TIMEOUT_ERROR: {
    category: 'timeout',
    severity: 'error',
    retryable: true,
    code: 'ERR_TIMEOUT'
  },
  SECURITY_ERROR: {
    category: 'security',
    severity: 'critical',
    retryable: false,
    code: 'ERR_SECURITY'
  }
};
