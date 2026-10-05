const { cmd } = require('../command');
const config = require("../config");

cmd({
  pattern: "antilink",
  desc: "Enable/disable anti-link protection",
  category: "group",
  fromMe: true, // or isBotAdmins: true
  use: '<on/off>'
}, async (m, match) => {
  if (!m.isGroup) return m.reply("❌ This command only works in groups!");
  
  const action = match[1]?.toLowerCase();
  
  if (action === 'on') {
    config.ANTI_LINK = 'true';
    await m.reply("✅ *Anti-link enabled!* Links will now be auto-deleted 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ꨄ 𝙏𝙀𝘼𝙈 𝟴𝟭𝟬 𝙏𝙀𝘾𝙃 𝙈𝘿 ꨄ︎︎.");
  } 
  else if (action === 'off') {
    config.ANTI_LINK = 'false';
    await m.reply("❌ *Anti-link disabled!* Links are now allowed 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ꨄ 𝙏𝙀𝘼𝙈 𝟴𝟭𝟬 𝙏𝙀𝘾𝙃 𝙈𝘿 ꨄ");
  } 
  else {
    await m.reply(`🔍 Anti-link status: *${config.ANTI_LINK === 'true' ? 'ENABLED' : 'DISABLED'}*\n\nUsage: *.antilink on* or *.antilink off*`);
  }
});