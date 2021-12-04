# Web BMS

BMS streaming application based on Web Audio API and HTML5 Canvas.

Not playable, just listening and watching :)

# How to run

Put BMS files in `public/bms/` directory, and type
```sh
npm start
```
in terminal.

Then, the server will be open in port 3000.

You may need to modify your BMS files for these problems
- Some BMS files have `.ogg` files even though they use `.wav` files or vice versa. Most BMS players seem to automatically fix this, but we don't do that here. Modify the `#WAV` commands.
- Web browsers does not support `.mpg` or `.mpeg` formats. Instead, they recommends to use `.mp4` or `.webm`. Convert them with, for example, FFmpeg, and modify the `#BMP` command.
- For now, Web BMS only accepts video file specified with `#BMP01` as BGA. It will be extended later.
- If there were encoding problems, it wouldn't look good. Encode with UTF-8 and check if everything is fine.