import TelegramBot from "node-telegram-bot-api";

export const telegram = new TelegramBot(process.env.TELEGRAM_TOKEN ?? "", {
  polling: true,
});
