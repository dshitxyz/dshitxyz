import axios from 'axios';
import type { TokenPrice, GovernanceStatus, MemeSubmission } from '../types.js';
import logger from './logger.js';

const API_URL = process.env.DSHIT_API_URL || 'http://localhost:3001';
const API_KEY = process.env.DSHIT_API_KEY || '';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { Authorization: `Bearer ${API_KEY}` })
  },
  timeout: 10000
});

export const dshitApi = {
  async getTokenPrice(): Promise<TokenPrice> {
    try {
      const response = await client.get('/api/public/token-stats');
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch token price', { error });
      throw error;
    }
  },

  async submitMeme(telegramId: number, title: string, description: string, imageUrl: string): Promise<MemeSubmission> {
    try {
      const response = await client.post('/api/memes', {
        title,
        description,
        imageUrl,
        submitterId: telegramId,
        platform: 'telegram'
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to submit meme', { error, telegramId });
      throw error;
    }
  },

  async getGovernanceStatus(walletAddress: string): Promise<GovernanceStatus> {
    try {
      const response = await client.get(`/api/public/governance-status/${walletAddress}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch governance status', { error, walletAddress });
      throw error;
    }
  },

  async getOrderStatus(orderId: string): Promise<{ status: string; details: object }> {
    try {
      const response = await client.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch order status', { error, orderId });
      throw error;
    }
  },

  async getActiveGovernanceProposals(): Promise<{ count: number; nextDeadline: string }> {
    try {
      const response = await client.get('/api/public/governance-proposals');
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch governance proposals', { error });
      throw error;
    }
  }
};

export default dshitApi;
