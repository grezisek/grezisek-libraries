# slang.js

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

If **outputContainer** is 

**not specified**, library will return a node reference to container with code.
You can store it inside a variable or use directly:

```
const markup = slang("test");
console.log(markup);

console.log(slang("test2"));
```

**specified**, node will be emptied and used as container for output

### Examples

```
document.body.prepend(slang("Hello World"));
document.body.prepend(slang("<template hello></template>", "<template-hello>Hello World</template-hello>"));
slang("<template hello></template>", "<template-hello>Hello World</template-hello>", document.body);
```

### Using structural elements

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

- set properties

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

**Result**

html:

```
<article class="row">
    <h1>My article</h1>
    <p>is the best</p>
</article>
```

css (in head):

```
.row{display:flex;flex-direction:row;}
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

- add data slots

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

- inside **"required string with markup"** start and end template element with `<template>` and `</template>` tags

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

### Example

**"optional string with templates"**:

```
<template-page>
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

    <script>
        ((metatitle, metadescription) => {
            if (!metatitle) metatitle = document.createElement("title");
            if (!metadescription) metadescription = document.createElement("meta");
            metadescription.name = "description";
            metatitle.innerHTML = document.querySelector('[data-meta="title"]').innerHTML;
            metadescription.content = document.querySelector('[data-meta="description"]').innerHTML;

        })(document.head.querySelector("title"), document.head.querySelector("meta[name='description']"));
    </script>
</template-page>
```

**"required string with markup"**

```
<template page>
    <pagethumb>
        <img src="image.jpg">
    </pagethumb>
    
    <pagetitle>
        My page
    </pagetitle>
    
    <pagedescription>
        My page is the best
    </pagedescription>
    
    <pagecontent>
        This is my page and it is the best
    </pagecontent>
</template>
```

## Event publishers and subscriptions

Subscribe to some of available events. Your function will run each time the event is taking place.

```
slang.subscribe("eventName", callbackFunction);
```

- `renderStart` - fires near beginning of rendering process. Arguments passed to callback: 
        - `eventName` - the same as when subscribing
        - `outputContainer` - container node before processing
        - `templates` - object with template node references assigned by template name
- `renderEnd` - fires near end of rendering process. Arguments passed to callback: 
        - `eventName`
        - `outputContainer` - container node after processing
- `eachStructRenderStart` - fires near beginning of each struct rendering process. Arguments passed to callback: 
        - `eventName`
        - `node` - original struct node
        - `struct` - struct node before processing
- `eachStructRenderEnd` - fires near end of each struct rendering process. Arguments passed to callback: 
        - `eventName`
        - `struct` - struct node after processing
- `eachTemplateRenderStart` - fires near beginning of each template rendering process. Arguments passed to callback: 
        - `eventName`
        - `node` - original template node
        - `template` - template node before processing
- `eachTemplateRenderEnd` fires near end of each template rendering process. Arguments passed to callback: 
        - `eventName`
        - `template` - template node after processing


