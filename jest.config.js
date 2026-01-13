import { createDefaultPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export const testEnvironment = 'node';
export const transform = {
  ...tsJestTransformCfg,
};

/** @type {import("jest").Config} **/
const config = {
  transform,
  setupFiles: ['./__tests__/jest.setup.env.js'],
  testPathIgnorePatterns: ['/__tests__/jest.setup.env.js'],
  testMatch: ['**/__tests__/**/*.test.ts'],
};

export default config;
