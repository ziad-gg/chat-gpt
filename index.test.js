import { Client, GatewayIntentBits, Events } from 'discord.js';
import { ChatGPTAPIBrowser } from 'chatgpt';
import { Application } from 'handler.djs';
import * as dotenv from 'dotenv';
import path, { resolve } from 'path';
import { setTimeout as wait } from 'node:timers/promises'

dotenv.config();

const api = new ChatGPTAPIBrowser({
  email: process.env.OPENAI_EMAIL,
  password: process.env.OPENAI_PASSWORD
})


const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMessages
    ] 
});

const App = new Application({
    client,
    commandsPath: path.join('C:\Users\zemad\OneDrive\Desktop\chat-gpt\commands') 
});

App.setData({
    ai: api
});


let _contact = "e";

async function setUp() {
  const page = await api._browser.newPage();
  await page.goto('https://chat.openai.com/c/4067abd6-43bd-4942-b9ac-c87317863805');

  return async function (content) {
    return new Promise(async (resolve, reject) => {

    await page.waitForSelector('[class="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"]');
    await page.type('[class="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"]', content);
    await wait(500);
    await page.keyboard.press('Enter');
    await wait(500);
    await page.keyboard.press('Enter');
   
    

    while (true) {
      const lastElementText = await page.$$eval('.group.w-full.text-gray-800.dark\\:text-gray-100.border-b.border-black\\/10.dark\\:border-gray-900\\/50.bg-gray-50.dark\\:bg-\\[\\#444654\\]', elements => {
        const lastElement = elements[elements.length - 1];
        lastElement.textContent;
        return lastElement.textContent;
      });
      await wait(200)
      _contact = lastElementText;
      if ((lastElementText.endsWith("?") || lastElementText.endsWith(".") ) && _contact === lastElementText) return resolve(lastElementText.replaceAll("1 / 1", ''));
      
    };

    

   });
  };

};



client.on(Events.ClientReady, async ({user}) => {
  await api.initSession();
//   await App.build();
  console.log(' %s is Ready', user.tag);
  console.log('connected to Chatgpt');
  const sendMessage = await setUp();
  client.sendMessage = sendMessage;
});





function formatResponse(response) {
  const codeMatch = response.match(/```([\w\s\S]*?)```/);
  const code = codeMatch ? codeMatch[1].trim() : null;
  const message = response.replace(/```([\w\s\S]*?)```/g, '').trim();
  
  return { message, code };
}


client.on(Events.MessageCreate, async (message) => {

 if (message.author.username.toLowerCase().includes("zia")) {
   const res = await client.sendMessage(message.content);
  //  console.log(res);
  console.log(formatResponse(res))
   message.channel.send({content: res});
 };

});

client.login(process.env.token);