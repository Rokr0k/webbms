![GitHub commit activity](https://img.shields.io/github/commit-activity/y/rokr0k/webbms) ![GitHub contributors](https://img.shields.io/github/contributors/rokr0k/webbms)
# Web BMS

BMS streaming application based on Web Audio API and HTML5 Canvas.

# How to run

Put BMS files in `public/bms/` directory, and type
```sh
npm start [port number]
```
in terminal.

Then, the server will be open.

You may need to modify your BMS files for these problems
- Some BMS files have `.ogg` files even though they use `.wav` files, or vice versa. Most BMS players seem to automatically fix this, but we don't do that here. Modify the `#WAVxx` commands.
- Web browsers does not support `.mpg` or `.mpeg` formats. Instead, they recommends to use `.mp4` or `.webm`. Convert them with, for example, FFmpeg, and modify the `#BMPxx` commands.
- If there were encoding problems, it wouldn't look good. Encode with UTF-8 and check if everything is fine.
