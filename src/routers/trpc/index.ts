import { router } from './context';
import { urlRouter } from './url';

export const trpcRouter = router({
  // Define your routes here
  url: urlRouter,
});
