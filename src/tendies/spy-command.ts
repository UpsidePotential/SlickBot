import { ICommand } from '../icommand';
import * as captureWebsite from 'capture-website';
import { Message } from 'discord.js';
import fs from 'fs';

export const SpyCommand: ICommand = {
  name: '!spy',
  helpDescription: 'Bot will respond with a box chart of spy',
  showInHelp: true,
  trigger: (msg: Message) => msg.content.startsWith('!spy'),
  command: async (msg: Message) => {
    
    await captureWebsite.file('https://finviz.com/map.ashx', 'screenshot.png', {
        element: 'canvas.chart',
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
          ],
        },
      });
    
      await msg.channel.send({ files: ['screenshot.png'] });
      fs.unlink('screenshot.png', () => {});
  },
};
