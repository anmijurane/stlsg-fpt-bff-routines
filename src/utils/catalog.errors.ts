import { DateTime } from 'luxon';

const now = () =>
  DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss', { locale: 'es-MX' });

export const errors = {
  AUTH_001: () => ({
    data: null,
    pagination: null,
    notifications: [
      {
        category: 400,
        code: 'E_FPT_ROUTINES_401_001',
        // TODO: add in middleware
        status: 401,
        meta: {
          timestamp: now(),
          log: 'AUTH_001',
        },
      },
    ],
  }),
  AUTH_002: () => ({
    data: null,
    pagination: null,
    notifications: [
      {
        category: 400,
        code: 'E_FPT_ROUTINES_401_002',
        // TODO: add in middleware
        status: 401,
        meta: {
          timestamp: now(),
          log: 'AUTH_002',
        },
      },
    ],
  }),
  AUTH_003: () => ({
    data: null,
    pagination: null,
    notifications: [
      {
        category: 400,
        code: 'E_FPT_ROUTINES_401_003',
        // TODO: add in middleware
        status: 401,
        meta: {
          timestamp: now(),
          log: 'AUTH_003',
        },
      },
    ],
  }),
  AUTH_004: () => ({
    data: null,
    pagination: null,
    notifications: [
      {
        category: 400,
        code: 'E_FPT_ROUTINES_401_004',
        status: 401,
        meta: {
          timestamp: now(),
          log: 'AUTH_004',
        },
      },
    ],
  }),
  AUTH_005: () => ({
    data: null,
    pagination: null,
    notifications: [
      {
        category: 400,
        code: 'E_FPT_ROUTINES_401_005',
        status: 401,
        meta: {
          timestamp: now(),
          log: 'AUTH_005',
        },
      },
    ],
  }),
  AUTH_006: () => ({
    data: null,
    pagination: null,
    notifications: [
      {
        category: 400,
        code: 'E_FPT_ROUTINES_401_006',
        status: 401,
        meta: {
          timestamp: now(),
          log: 'AUTH_006',
        },
      },
    ],
  }),
  BAD_REQ_GEN: (code: string) => ({
    data: null,
    pagination: null,
    notifications: [
      {
        category: 400,
        code: `E_FPT_ROUTINES_400_${code}`,
        status: 400,
        meta: {
          timestamp: now(),
          log: `BAD_REQ_${code}`,
        },
      },
    ],
  }),
  INTERNAL_001: () => ({
    data: null,
    pagination: null,
    notifications: [
      {
        category: 500,
        code: 'E_FPT_ROUTINES_500_001',
        // TODO: add in middleware
        status: 500,
        meta: {
          timestamp: now(),
          log: 'STLSG-001',
        },
      },
    ],
  }),
  INTERNAL_002: () => ({
    data: null,
    pagination: null,
    notifications: [
      {
        category: 500,
        code: 'E_FPT_ROUTINES_500_002',
        // TODO: add in middleware
        status: 500,
        meta: {
          timestamp: now(),
          log: 'STLSG-002',
        },
      },
    ],
  }),
  INTERNAL_003: () => ({
    data: null,
    pagination: null,
    notifications: [
      {
        category: 500,
        code: 'E_FPT_ROUTINES_500_003',
        // TODO: add in middleware
        status: 500,
        meta: {
          timestamp: now(),
          log: 'STLSG-003',
        },
      },
    ],
  }),
};
