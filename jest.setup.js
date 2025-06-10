// Jest DOM 확장 기능 추가
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/jest-globals";
// Fetch polyfill 추가
import "whatwg-fetch";

// MSW 서버 설정 (임시 주석처리)
// import { server } from './src/__mocks__/server'

// 각 테스트 전에 MSW 서버 시작
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// 각 테스트 후 핸들러 리셋
// afterEach(() => server.resetHandlers())

// 모든 테스트 후 서버 종료
// afterAll(() => server.close())

// console.error와 console.warn을 테스트에서 숨기기 (필요시)
global.console = {
  ...console
  // uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
