# mouseeffects

This library will detect where the mouse currently is, then add CSS variables into all given elements, so you can add various mouse effects.
The values of these variables are refreshed with **practically no delay**, so if you are looking for performance improvements, you are definitely in the right place.

## Usage
Set the `has-mouse-effects` (or your own) class to the elements that will have mouse effects.

```
<div class="has-mouse-effects"></div>
```

Use the Start function to execute the process of searching elements and the library operation.
Function can take string as an argument, to search for your custom class name.

```
mouseEffects.Start();
mouseEffects.Start("custom-class");
```

Create your own effects in CSS based on 4 variables that show the current position of the mouse relative to the upper left corner of the element.

```
--cursor-top--px
--cursor-left--px
--cursor-top--percent
--cursor-left--percent
```

You can also deactivate all effects by using Stop function:

```
mouseEffects.Stop();
```

check the list of currently active elements:

```
console.log(mouseEffects);
```

or add / remove elements manually on the fly:

```
mouseEffects.Subscribe(nodeReference);
mouseEffects.Unsubscribe(nodeReference);
```


## Details

### Ways of adding library to project

- **Copy and Paste** [this](https://raw.githubusercontent.com/grezisek/grezisek-libraries/main/mouseeffects/mouseeffects.js) into your `<script>` tag or script file. The library will be usable in scope.
- **Link to a .js file** in your project by adding `<script>` tag with valid `src=""` attribute.

### When the effects are not working?

The library will throw an **error** if window.MouseEffects is already in use, and **warning** on touch devices. In both cases the effects **will not work**.
If none of the elements are being found, check if they are in the DOM tree when the Start function executes.

### When the effects are working?

All variables will be added after the first mouse move. When the element is ready to be styled, it will have the `mouse-effects-set` class.
To add styles only on devices with a mouse pointer, use the @media `(hover: hover)` condition.
