import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  //testEnvironment: "node",
  //transform: {
  //  //"^.+\\.tsx?$": "ts-jest",
  //  "^.+\\.(ts|tsx)$": "ts-jest",
  //  "^.+\\.(js|jsx)$": "babel-jest" // 🔹 Permitir JSX
  //},
  testEnvironment: "jsdom",  // ✅ Para pruebas en React
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePaths: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!(snupie/src)/)"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy" // Evitar errores de importación de CSS en SignUp.js
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // ✅ Configuración adicional
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      isolatedModules: false
    }
  },
  testPathIgnorePatterns: [
    '<rootDir>/snupie/src/__tests__' // 🔹 Ignorar pruebas dentro de /snupie
  ],
};

export default config;
