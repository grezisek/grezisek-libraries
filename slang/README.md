# slang.js

This library will render html / slang markup into html, css and js code.

## Ways of adding library to project

- **Copy and Paste** [this](https://raw.githubusercontent.com/grezisek/grezisek-libraries/main/slang/slang.js) into your `<script>` tag or script file. Library will be usable in scope.
- **Link to a .js file** in your project by adding `<script>` with valid `src=""` attribute.

## Usage


### How to execute library
```
slang("required string with markup", "optional string with templates", outputContainer);
```

- **"required string with markup"** slang/html markup to render
- **"optional string with templates"** slang/html markup with templates
- **outputContainer** node reference to container for result

### How to use resulting code

The library will return a node reference to temporary node with code.

Additionally, if **outputContainer** is specified, node will be emptied and used as container for output.

You can store a result inside a variable or use it directly:

```
const markup = slang("test");
console.log(markup);

console.log(slang("test2"));
```

### Examples

```
document.body.prepend(slang("Hello World"));
document.body.prepend(slang("<template hello></template>", "<template-hello>Hello World</template-hello>"));
slang("<template hello></template>", "<template-hello>Hello World</template-hello>", document.body);
```

### Using structural elements

Structural elements let you organize content into rows and columns.

- start and end structural element with `<struct>` and `</struct>` tags

```
<struct>

</struct>
```

- add some code between tags

```
<struct>
    <h1>My article</h1>
    <p>is the best</p>
</struct>
```

- set properties (default: column)

```
<struct row>
    <h1>My article</h1>
    <p>is the best</p>
</struct>
```

- select correct html tag for container (default: div)

```
<struct row article>
    <h1>My article</h1>
    <p>is the best</p>
</struct>
```

**Properties syntax**

Use one of available structural element types:

- `row` - css flex `row`
- `wor` - css flex `row-reverse` 
- `col` - css flex `column`
- `loc` - css flex `column-reverse`

Group more types by separating them by a breakpoint (`-breakpointRules-`):

- `col-992-row` - `column` from 0px screen width to 991px, `row` starting from 992px

Choose which screen dimensions to use:

- `-992-` or `-992w-` - screen width
- `-992h-` - screen height
- `-992w?992h-` - screen width **or** screen height
- `-992w!992h-` - screen width **and** screen height


### Using template elements

Template elements let you reuse your markup.

**Definition**

- inside **"optional string with templates"** start and end template definition with `<template-templatename>` and `</template-templatename>` tags

```
<template-article>

</template-article>
```

- add some code between tags

```
<template-article>
    <article>
        <h1>

        </h1>
        <p>

        </p>
    </article>
</template-article>
```

- define data slots

```
<template-article>
    <article>
        <h1>
            <slot articletitle></slot>
        </h1>
        <p>
            <slot articlecontent></slot>
        </p>
    </article>
</template-article>
```

**Usage**

- inside **"required string with markup"** or **"optional string with templates"** start and end template element with `<template>` and `</template>` tags

```
<template>

</template>
```

- add name of template you want to use

```
<template article>

</template>
```

- use data slots

```
<template article>
    <articletitle>My article</articletitle>
    <articlecontent>is the best</articlecontent>
</template>
```


### Using data elements

- inside **"required string with markup"** or **"optional string with templates"** start and end data element with `<data>` and `</data>` tags

```
<data>

</data>
```

- add path to data source between tags

```
<data>
    ./video.mp4
</data>
```

- add desired HTML attributes

```
<data controls id="my-video">
    ./video.mp4
</data>
```

**List of supported data**

- **html / text** - content of a file
- **image** - html image node
- **audio / video** - html player 
- **style** - stylesheet link in head
- **script** - script source in head
- **iframe** - embedded iframe


## Event publishers and subscriptions

Subscribe and unsubscribe to some of available events.
Your function will run each time the event is taking place and take up to three arguments (eventName, oldNode, newNode).

```
slang.subscribe("eventName", callbackFunction);
slang.unsubscribe("eventName", callbackFunction);
```

- `renderStart` - before rendering process. `callbackFunction("renderStart", outputContainer, templates)`
- `renderEnd` - after rendering process.  `callbackFunction("renderEnd", outputContainer)`

- `eachStructRenderStart` - before rendering of struct element. `callbackFunction("eachStructRenderStart", node, newNode)`
- `eachStructRenderEnd` - after rendering of struct element. `callbackFunction("eachStructRenderEnd", node, newNode)`

- `eachTemplateRenderStart` - before rendering of template element. `callbackFunction("eachTemplateRenderStart", node, template)`
- `eachTemplateRenderEnd` - after rendering of template element. `callbackFunction("eachTemplateRenderEnd", node, template)`

- `eachDataRenderStart` - before rendering of data element. `callbackFunction("eachDataRenderStart", node, template)`
- `eachDataRenderEnd` - after rendering of data element. `callbackFunction("eachDataRenderEnd", node, template)`

### Example

**"optional string with templates"**:

```
<template-page>
    <data>
        ./style.css
    </data>
    
    <data>
        ./script.js
    </data>
    
    <div style="position:absolute;left:-300vw;">
        <h1 data-meta="title">
            <slot pagetitle></slot>
        </h1>
        <p data-meta="description">
            <slot pagescription></slot>
        </p>
    </div>

    <struct col header>
        <struct col-600-row>
            <slot pagethumb></slot>
            <h1 class="page-title">
                <slot pagetitle></slot>
            </h1>
        </struct>

        <p class="page-description">
            <slot pagedescription></slot>
        </p>
    </struct>

    <main>
        <slot pagecontent></slot>
    </main>
</template-page>
```

**"required string with markup"**

```
<template page>
    <pagethumb>
        <data>
            ./image.jpg
        </data>
    </pagethumb>
    
    <pagetitle>
        My page
    </pagetitle>
    
    <pagedescription>
        My page is the best
    </pagedescription>
    
    <pagecontent>
        <data>
            ./page-home.html
        </data>
    </pagecontent>
</template>
```

