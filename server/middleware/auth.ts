import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    walletAddress?: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email?: string;
      walletAddress?: string;
    };

    const { rows: userRows } = await pool.query(
      "SELECT user_id, email, wallet_address FROM users WHERE user_id = $1",
      [decoded.userId]
    );

    let wrongAuth = false;
    if (userRows.length === 0) {
      wrongAuth = true;
    } else {
      // Get existing user data and compare against token data
      const { email: existingEmail, wallet_address: existingWalletAddress } =
        userRows[0];
      if (decoded.email) {
        // Web2 Authentication (email-based)
        if (decoded.email !== existingEmail) {
          wrongAuth = true;
        }
      } else if (decoded.walletAddress) {
        // Web3 Authentication (wallet-based)
        if (
          !existingWalletAddress ||
          decoded.walletAddress.toLowerCase() !==
            existingWalletAddress.toLowerCase()
        ) {
          wrongAuth = true;
        }
      } else {
        // Neither email nor wallet address provided
        wrongAuth = true;
      }
    }

    if (wrongAuth === true) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
