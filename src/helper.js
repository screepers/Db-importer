import fetch from "node-fetch";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default class Helper {
  hostname = "localhost"
  serverPort = 21025
  cliPort = 21026
  secret = "secret"

  constructor(settings) {
    if (settings.hostname) this.hostname = settings.hostname;
    if (settings.serverPort) this.serverPort = settings.serverPort;
    if (settings.cliPort) this.cliPort = settings.cliPort;
    if (settings.secret) this.secret = settings.secret;
  }

  async getUsers() {
    try {
      const usersResponse = await fetch(
        `http://${hostname}:${serverPort}/api/stats/users`,
        {
          headers: {
            key: secret,
          },
        }
      );
      const users = await usersResponse.json();

      const mappedUsers = {};
      for (let u = 0; u < users.length; u += 1) {
        const user = users[u];
        mappedUsers[user.username] = user._id;
      }

      return mappedUsers;
    } catch (error) {
      console.log(error)
      return {}
    }
  }

  convertList(users, collectionList) {
    Object.entries(collectionList).forEach(([collection, list]) => {
      list.forEach((item) => {
        if (item.username) {
          console.log(item.username, users[item.username]);
          item.user = users[item.username];
          delete item.username;
        }
      });
      collectionList[collection] = list;
    });

    return collectionList;
  }

  async executeList(collectionList) {
    const users = await this.getUsers();
    // eslint-disable-next-line no-param-reassign
    collectionList = this.convertList(users, collectionList);
    const collections = Object.keys(collectionList);

    for (let c = 0; c < collections.length; c += 1) {
      const collection = collections[c];
      const list = collectionList[collection];
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i];
        // eslint-disable-next-line no-await-in-loop
        await this.executeCliCommand(
          `storage.db['${collection}'].insert(${JSON.stringify(item)})`
        );
      }
    }
  }

  sleep(seconds) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  async executeCliCommand(command) {
    try {
      const result = await fetch(`http://${hostname}:${cliPort}/cli`, {
        method: "POST",
        body: command,
        headers: { "Content-Type": "text/plain" },
      });
      const text = await result.text();
      console.log(`> ${command}`);

      logger.debug(`> ${command} \r\n> ${text}`);
      await this.sleep(1);
      return text;
    } catch (error) {
      logger.error(error);
      console.log(error);
      return undefined;
    }
  }
}
