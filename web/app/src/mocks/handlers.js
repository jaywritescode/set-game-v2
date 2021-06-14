import { rest } from 'msw';

const handlers = [
  rest.post('/api/create', (req, res, ctx) => {
    console.log('test');

    return res(ctx.status(200), ctx.json({
      room: 'aaaa',
    }));
  }),
];

export default handlers;