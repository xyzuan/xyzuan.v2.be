import TelegramBot from "node-telegram-bot-api";

export const telegram = new TelegramBot(Bun.env.TELEGRAM_TOKEN ?? "", {
  polling: true,
});
