import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Cart from '@/lib/mongodb/models/Cart';
import { Basket_Access_Token, Basket_Referesh_Token } from '@/lib/types/basket_tokens';
import { ApiError } from 'next/dist/server/api-utils';
import type { StringValue } from 'ms';

// Ensure these are cast correctly
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as Secret;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as Secret;
const ACCESS_TOKEN_EXPIRY =
  (process.env.ACCESS_TOKEN_EXPIRY as StringValue) ?? ('15M' as StringValue); // default fallback
const REFRESH_TOKEN_EXPIRY =
  (process.env.REFRESH_TOKEN_EXPIRY as StringValue) ?? ('7D' as StringValue); // default fallback

const generateAccessAndRefreshTokens = async (
  basketId: string
): Promise<{ access_token: string; refresh_token: string }> => {
  try {
    const basketData = await Cart.findOne({ basketId });

    if (!basketData) {
      throw new ApiError(404, 'Basket not found');
    }

    const accessTokenPayload: Basket_Access_Token = {
      id: basketData.id.toString(),
      basketId: basketData.basketId,
    };

    const refreshTokenPayload: Basket_Referesh_Token = {
      id: basketData.id.toString(),
    };

    const access_token = generateAccessToken(accessTokenPayload);
    const refresh_token = generateRefreshToken(refreshTokenPayload);

    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    basketData.refreshToken = hashedRefreshToken;
    await basketData.save();

    return { access_token, refresh_token };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new ApiError(500, error.message || 'Something went wrong while generating tokens');
  }
};

const generateAccessToken = (payload: Basket_Access_Token): string => {
  const options: SignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  };

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
};

const generateRefreshToken = (payload: Basket_Referesh_Token): string => {
  const options: SignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  };

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
};

export const validateAndRegenrateAccessToken = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  let basketId: string | undefined;
  if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
    basketId = (decoded as { id: string }).id;
  }
  if (!basketId) {
    throw new ApiError(403, 'Invalid refresh token payload');
  }
  const basketData = await Cart.findOne({ id: basketId });

  if (!basketData) {
    throw new ApiError(500, 'Basket Not found');
  }

  const isMatch = await bcrypt.compare(refreshToken, basketData.refreshToken);
  if (!isMatch) {
    throw new ApiError(403, 'Invalid refresh token');
  }

  // Rename the destructured variable here
  const { access_token } = await generateAccessAndRefreshTokens(basketData.basketId);
  return access_token;
};

export default generateAccessAndRefreshTokens;
