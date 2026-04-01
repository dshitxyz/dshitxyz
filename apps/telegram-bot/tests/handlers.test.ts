import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handlePrice } from '../src/handlers/price';
import { handleOrders } from '../src/handlers/orders';
import { handleProposals } from '../src/handlers/governance';

describe('Price Handler', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = {
      from: { id: 12345 },
      sendChatAction: vi.fn(),
      reply: vi.fn().mockResolvedValue({}),
    };
  });

  it('should fetch and display price', async () => {
    await handlePrice(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalled();
    const message = mockCtx.reply.mock.calls[0][0];
    expect(message).toContain('DSHIT');
    expect(message).toContain('Price');
  });
});

describe('Orders Handler', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = {
      from: { id: 12345 },
      sendChatAction: vi.fn(),
      reply: vi.fn().mockResolvedValue({}),
    };
  });

  it('should fetch and display orders', async () => {
    await handleOrders(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalled();
    const message = mockCtx.reply.mock.calls[0][0];
    expect(message).toContain('Orders');
  });
});

describe('Proposals Handler', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = {
      from: { id: 12345 },
      sendChatAction: vi.fn(),
      reply: vi.fn().mockResolvedValue({}),
    };
  });

  it('should fetch and display proposals', async () => {
    await handleProposals(mockCtx);
    expect(mockCtx.reply).toHaveBeenCalled();
    const message = mockCtx.reply.mock.calls[0][0];
    expect(message).toContain('Proposals');
  });
});
