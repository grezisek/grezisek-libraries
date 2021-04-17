# slang.js

This library will parse slang markup and return HTML code with CSS and JS embedded directly inside. Resulting code **is not** a valid HTML document, but some part - you decide how big.

## Main goal

is to separate code different than HTML, CSS and JS does:

1. **data** - pure content. Literally letters and bytes of media files.
2. **structure** - markup containing: 
    - type of part - like text, data file or slider
    - config - part specific data to set - like template name, number of slides or popup conditions
    - inner (**data** or **structure**)

...but these two will result in code, that:
1. follows HTML standards
2. has critical (layout/RWD) CSS loaded first
3. respects full themability by external CSS styles
4. includes cross-compatible JS code extendable by external JS scripts
5. can be introduced into your code from small part to near full code
6. is aiming to be the fastest and the simpliest possible

## Usage

### Basic HTML

- **`[1][1.]` - `[6][6.]`** - `<h1></h1>` - `<h6></h6>`
- **`[7][7.]`** - `<strong></strong>`
- **`[8][8.]`** - `<b></b>` extra bold
- **`[9][9.]`** - `<b></b>` bold
- **`[10][10.]`** - `<b></b>` medium
- **`[]`** - `<p></p>`
- **`[-][-.]`** - `<span></span>`
- **`[#.path/to.jpg]`** - `<img src=".path/to.jpg">`
- **`[#.path/to.mp3]`** - `<audio><source src=".path/to.mp3" type="audio/mp3"></audio>`
- **`[#.path/to.mp4]`** - `<video><source src=".path/to.mp4" type="video/mp4"></video>`
- **`[@example.com][@.]`** - `<a href="example.com">example.com</a>`
- **`[@example@mail.com][@.]`** - `<a href="mailto:example@mail.com">example@mail.com</a>`
- **`[@123456789][@.]`** - `<a href="tel:123456789">123456789</a>`

### Layout

- **`[>][>.]`** - `<div></div>` - flex row
- **`[<][<.]`** - `<div></div>` - flex row-reverse
- **`[\][\.]`** - `<div></div>` - flex column
- **`[/][/.]`** - `<div></div>` - flex column-reverse
- **`[-][-.]`** - `<span></span>` - inline

### More




## Details
