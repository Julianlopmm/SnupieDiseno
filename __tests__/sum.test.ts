// sum.test.ts
import { sum } from "../src/sum";

test("Suma 2 + 3 y devuelve 5", () => {
  expect(sum(2, 3)).toBe(5);
});

test("Suma números negativos", () => {
  expect(sum(-2, -3)).toBe(-5);
});

test("Suma con cero", () => {
  expect(sum(0, 5)).toBe(5);
});
