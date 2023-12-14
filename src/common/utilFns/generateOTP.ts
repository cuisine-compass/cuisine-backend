import * as crypto from 'crypto';

export function generateOTP(n: number, mixed = false): string {
  const chars = mixed
    ? '0123456789abcdefjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let otp = '';
  while (otp.length < n) {
    const randomByte = crypto.randomBytes(1)[0];
    if (randomByte < (256 / chars.length) * chars.length) {
      otp += chars.charAt(randomByte % chars.length);
    }
  }

  return otp;
}

export default generateOTP;
