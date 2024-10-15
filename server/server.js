import app from "../src";
import logger from "../src/utils/logging";

app.listen(process.env.PORT, () => {
  logger.info(`Listening on PORT: ${process.env.PORT}`);
});
