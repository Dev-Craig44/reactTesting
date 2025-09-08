import { delay, http, HttpResponse } from "msw";
import { server } from "./mocks/server";
// 3.) Create a helper function for delay to a specific endpoint
export const simulateDelay = (endpoint: string) => {
  server.use(
    http.get(endpoint, async () => {
      await delay();
      return HttpResponse.json([]);
    })
  );
};

export const simulateError = (endpoint: string) => {
  server.use(http.get(endpoint, () => HttpResponse.error()));
};
