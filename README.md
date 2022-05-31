![GitHub commit activity](https://img.shields.io/github/commit-activity/y/rokr0k/webbms) ![GitHub contributors](https://img.shields.io/github/contributors/rokr0k/webbms) ![GitHub](https://img.shields.io/github/license/rokr0k/webbms) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/rokr0k/webbms) ![GitHub top language](https://img.shields.io/github/languages/top/rokr0k/webbms) [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FRokr0k%2Fwebbms&count_bg=%2300A0FF&title_bg=%23555555&icon=github.svg&icon_color=%23FFFFFF&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)
# Web BMS

BMS streaming application based on Web Audio API and HTML5 Canvas.

# How to run

Put BMS files in `public/bms/` directory (symlinks available), and type
```sh
npm start
```
in terminal. Then, the server will be open on port 80.

If you want to open the server on different port, create a file named `.env` and write
```env
PORT=[Port Number]
```
inside it.

## Warning

Web browsers do not support `.mpg` or `.mpeg` formats. Instead, they recommend to use `.mp4` or `.webm`. Convert them with, for example, FFmpeg.  
For the same reason, convert `.bmp` into `.png` or `.jpg`.  
The parser will automatically detect them, so you don't have to modify the BMS file.
