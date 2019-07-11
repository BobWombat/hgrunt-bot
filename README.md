# hgrunt-bot
This is a discord.js bot that can play hgrunt/VOX lines in a voice channel, generate HDTF banners, get garfield comics, and more.

[Add HGrunt](https://discordapp.com/oauth2/authorize/?permissions=3196992&scope=bot&client_id=396884008501510144)

# Support
Join [HGrunt Hangout](https://discord.gg/trWuQMv).

# Running your own instance
```
git clone https://github.com/IntriguingTiles/hgrunt-bot.git
cd hgrunt-bot
mkdir gmg
mkdir voice
cd voice
mkdir hgrunt
mkdir vox
mkdir metropolice
mkdir combine_soldier
mkdir overwatch
cd ..
npm install
```
Now just put your token in the `DISCORD_TOKEN` environment variable and you should be good to go.

If you want Cleverbot to work, put your info from [cleverbot.io](https://cleverbot.io/) in `CB_KEY` and `CB_USER`.

If you want `!say` to work, grab the audio files for `hgrunt` and `vox` from Half-Life 1 and `metropolice`, `combine_soldier`, and `overwatch` from Half-Life 2. You'll also need FFmpeg.

If you want `!gmg` to work, you'll have to scrape images from [garfield minus garfield](http://garfieldminusgarfield.net/) and place them in `gmg`.

# Credits
- Miloteza#7639 for the custom VOX lines
- HeadCrabbed#1477 for the HDTF character set
- NetwideRogue#0908 for the sqrt command
