# slang.js

This library will parse slang markup and return HTML code with CSS and JS embedded directly inside. Resulting code **is not** a valid HTML document, but some part - you decide how big.

## Main goal

is to separate code different than HTML, CSS and JS does:

1. **data** - pure content. Literally letters and bytes of media files.
2. **structure** - markup containing: 
    - type of part - like text, data file or slider
    - config - part specific data to set - like number of slides or popup conditions
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

Add templates.txt to your project location and add `data-templates=./path/to/templates.txt` to `<script>` tag executing the library.

This file holds every custom template used by the library. Here you can write your code.

### Syntax

Use templates to reuse elements.

```
<template-name></template> to define new template called name

<template-example>
    <data-name> to define data slot called name
</template>

<template .example> to use template called example
    <name> to fill slot called name with data
        //some data 
    </name>
</template>
```

Use data elements to throw data into structure.

```
<data ./photo.jpg> image
<data ./audio.mp3> HTML5 audio player
<data ./video.mp4> HTML5 video player
<data ./style.css> stylesheet link
<data ./script.js> script source
<data ./example.txt> content of file
<data ./example.html> content of file
<data https://grezisek.github.io/> iframe
```

Use structure elements to hold data elements or other structure elements.

```
<struct>
    //some data
</struct>

<struct col-992-row></struct> column on mobile, row above 992px width
<struct loc-500h-wor-1300w?600h-grid></struct> column-reverse on mobile, row-reverse above 500px height, grid above 1300px width or 600px height
<struct .name></struct> if you want to reuse properties
<struct-name col-992w-row> if you want to define properties
<struct col-992-row.name3.name2></struct> if you need to combine many properties (last reusable properties are the most important)
```
