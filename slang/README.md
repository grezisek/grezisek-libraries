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

### Ways of adding library to project

- **Copy and Paste** [this](https://raw.githubusercontent.com/grezisek/grezisek-libraries/main/slang/slang.js) into your `<script>` tag or script file. Library will be usable in scope.
- **Link to a .js file** in your project by adding `<script>` with valid `src=""` attribute.

### Templates file

Add templates.txt to your project location and add `data-templates=./path/to/templates.txt` to `<script>` tag executing library.

This file holds every custom template used by library. Here you can write your code.
Inside file, start every new template with `[!uniqueTemplateName]` where `uniqueTemplateName` is an identifier you pick for future usage.


### Basic HTML

- **`[1][1.]` - `[6][6.]`** - `<h1></h1>` - `<h6></h6>`
- **`[7][7.]`** - `<strong></strong>`
- **`[8][8.]`** - `<b></b>` extra bold
- **`[9][9.]`** - `<b></b>` bold
- **`[10][10.]`** - `<b></b>` medium
- **`[]`** - `<p></p>`
- **`[-][-.]`** - `<span></span>`
- **`[#./path/to.jpg]`** - `<img src="./path/to.jpg">`
- **`[#./path/to.mp3]`** - `<audio><source src="./path/to.mp3" type="audio/mp3"></audio>`
- **`[#./path/to.mp4]`** - `<video><source src="./path/to.mp4" type="video/mp4"></video>`
- **`[@example.com][@.]`** - `<a href="example.com">example.com</a>`
- **`[@example@mail.com][@.]`** - `<a href="mailto:example@mail.com">example@mail.com</a>`
- **`[@123456789][@.]`** - `<a href="tel:123456789">123456789</a>`

### Layout

- **`[>][>.]`** - `<div></div>` - flex row
- **`[<][<.]`** - `<div></div>` - flex row-reverse
- **`[\][\.]`** - `<div></div>` - flex column
- **`[/][/.]`** - `<div></div>` - flex column-reverse
- **`[-][-.]`** - `<span></span>` - inline

### Parts with JS

- **`[+code]`** - popup with inner code
- **`[=codes]`** - slider where `codes` are parts to use as slides
- **`[$partid]`** - toggler where `partid` is id of toggler target

### Config

Config tells details about how things should work.

#### Page config

Add page config into templates.txt file:
`[~key]data`

```
[~screensizes]360,992,1300
[~fontsizes]6,8,10
```

#### Page config settings list

#### Part config

After opening `[part]` tag you can add three config options:
`[part](partSpecificConfig, partClassList, partIDList)`

```
[@my@mail.com](, link link--email, my_email)
    Mail me!
[@.]
```
#### Part config settings list


## Details
