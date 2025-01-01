import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import { pool } from "../config/database";
import { web3LoginMessage } from "../config/web3Config";

const router = express.Router();

// Get nonce for a user using wallet address
router.post(
  "/get-nonce-web3",
  [body("walletAddress").notEmpty().withMessage("Wallet address is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Checksumed address
      const walletAddress = ethers.getAddress(req.body.walletAddress);

      if (!ethers.isAddress(walletAddress)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }

      const nonceExists = await pool.query(
        `SELECT nonce, expire_at FROM nonces WHERE wallet_address = $1`,
        [walletAddress]
      );

      const now = new Date();
      const oneMinuteBuffer = 1 * 60 * 1000; // 1 minute in milliseconds
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now

      let nonce;

      if (nonceExists.rows.length > 0) {
        // Nonce for the provided address exists
        const { nonce: existingNonce, expire_at: expireAt } =
          nonceExists.rows[0];
        const expireAtDate = new Date(expireAt);

        // If the nonce is expired or close to expiration, generate a new nonce
        if (expireAtDate.getTime() - now.getTime() <= oneMinuteBuffer) {
          nonce = ethers.hexlify(ethers.randomBytes(16)); // Generate a new random nonce
          await pool.query(
            `UPDATE nonces
            SET nonce = $1, expire_at = $2
            WHERE wallet_address = $3`,
            [nonce, fiveMinutesFromNow, walletAddress]
          );
        } else {
          // Use the existing nonce
          nonce = existingNonce;
        }
      } else {
        // If no entry exists, generate a new nonce and create a new record
        nonce = ethers.hexlify(ethers.randomBytes(16));
        await pool.query(
          `INSERT INTO nonces (
              wallet_address, nonce, expire_at
            ) VALUES ($1, $2, $3)`,
          [walletAddress, nonce, fiveMinutesFromNow]
        );
      }

      return res.status(200).json({ nonce });
    } catch (error) {
      console.error("Web3: get nonce error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Login or register a user using wallet address
router.post(
  "/login-web3",
  [
    body("walletAddress").notEmpty().withMessage("Wallet address is required"),
    body("signature").notEmpty().withMessage("Signature is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { walletAddress: rawWalletAddress, signature } = req.body;

      // Get checksumed address
      const walletAddress = ethers.getAddress(rawWalletAddress);

      // Fetch nonce from database
      const { rows: nonceRows } = await pool.query(
        `SELECT nonce, expire_at FROM nonces WHERE wallet_address = $1`,
        [walletAddress]
      );

      if (nonceRows.length === 0) {
        return res
          .status(400)
          .json({ error: "Nonce not found for wallet address" });
      }

      const { nonce, expire_at: expireAt } = nonceRows[0];
      const now = new Date();

      // Check if the nonce has expired
      if (new Date(expireAt) <= now) {
        return res
          .status(400)
          .json({ error: "Nonce has expired. Please request a new one." });
      }

      // Verify signature
      const recoveredAddress = ethers.verifyMessage(
        web3LoginMessage(nonce as string),
        signature
      );
      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(400).json({ error: "Invalid signature" });
      }

      // Check if user exists
      const { rows: userRows } = await pool.query(
        `SELECT user_id FROM users WHERE wallet_address = $1`,
        [walletAddress]
      );

      let userId;
      if (userRows.length > 0) {
        userId = userRows[0].user_id;
      } else {
        // Create user
        const { rows: newUserRows } = await pool.query(
          `INSERT INTO users (wallet_address) VALUES ($1) RETURNING user_id`,
          [walletAddress]
        );
        userId = newUserRows[0].user_id;
      }

      // Update last login
      await pool.query(
        `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1`,
        [userId]
      );

      // Delete the used nonce
      await pool.query(`DELETE FROM nonces WHERE wallet_address = $1`, [
        walletAddress,
      ]);

      const token = jwt.sign(
        { userId, walletAddress },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );

      res.json({
        token,
        user: { userId, walletAddress },
      });
    } catch (error) {
      console.error("Web3: login error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
