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

Load file with templates as text.

This file holds every custom template used by the library. Here you can write your code.

### Syntax

Use templates to reuse elements.

```
<template-name></template-name> to define new template called name

<template-example>
    <slot name> to define slot called name
</template-example>

<template example>
    <name> to fill slot called name with data
        //some data 
    </name>
</template>
```

### Example code

Template file:

```
<template-page>
    <h1>
        <slot pagetitle/>
    </h1>
    <p>
        <slot pagedescription/>
    </p>
</template-page>

<template-home>
    <template page>
    
        <pagetitle>
            My page
        </pagetitle>
        
        <pagedescription>
            Description of my page
        </pagedescription>
        
    </template>
</template-home>
```

HTML file:

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example slang page</title>
</head>
<body>
    <main>
    </main>

    <script src="./slang.js"></script>
    <script>
        async function init() {
            const templates = await fetch("./templates.txt").then(response => response.text());
            const mainContainer = document.querySelector("main");

            const database = {
                "" : "<template home></template>",
                "page" : {
                    "home" : "<template home></template>",
                    "contact" : "<template contact></template>"
                },
                "404" : "<template pagenotfound></template>"
            }

            const searchParams = new URLSearchParams(window.location.search).entries().next();

            if (searchParams.done) {
                if (database[window.location.search])
                    return slang(
                        database[window.location.search],
                        templates,
                        mainContainer
                    )
                else return slang(
                    database["404"],
                    templates,
                    mainContainer
                )
            }
                

            if (typeof database[searchParams.value[0]] === "string" ||
                database[searchParams.value[0]] instanceof String
            ) return slang(
                database[searchParams.value[0]],
                templates,
                mainContainer
            );
            
            if (typeof database[ searchParams.value[0] ][ searchParams.value[1] ] === "string" ||
                database[ searchParams.value[0] ][ searchParams.value[1] ] instanceof String
            ) return slang(
                database[ searchParams.value[0] ][ searchParams.value[1] ],
                templates,
                mainContainer
            );

            return slang(
                database["404"],
                templates,
                mainContainer
            );
        }

        init();
    </script>
</body>
</html>
```

## Alpha stage

Features are still in development
