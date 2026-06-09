import "server-only";

import { randomBytes, randomInt, scryptSync, timingSafeEqual } from "node:crypto";

export function generateFourDigitPin() {
  return randomInt(0, 10000).toString().padStart(4, "0");
}

export function generatePinSalt() {
  return randomBytes(16).toString("hex");
}

export function hashPin(pin: string, salt: string) {
  return scryptSync(pin, salt, 64).toString("hex");
}

export function verifyPin(pin: string, hash: string, salt: string) {
  const expected = Buffer.from(hash, "hex");
  const received = Buffer.from(hashPin(pin, salt), "hex");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function generateSlug() {
  return randomBytes(24).toString("base64url");
}

export function isValidPin(pin: string) {
  return /^\d{4}$/.test(pin);
}
