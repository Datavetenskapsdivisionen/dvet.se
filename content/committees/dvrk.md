# DVRK
Fyll i denna sidan med kort och gott om eran kommité!

Ni kan använda GitHub markdown 
[GitHub markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
, eller alternativt HTML, med väldigt få begränsningar!

Hacka på och lek runt med *lite* CSS för att ge er sida lite style!

Som ett exempel har vi en fin WOW knapp:
<style>
.test-class {
    position: relative;
    transition-duration: 250ms;
    cursor: pointer;
}
.test-class:hover {
    color: blue;
}
.test-class::after {
    content: "WOW";
    position: absolute;
    left: 0; top: 0;
    transition-duration: 250ms;
}
.test-class:hover::after{
    color: red; top: -4px; left: -4px;
}
.test-class::before {
    content: "WOW";
    position: absolute;
    left: 0; top: 0;
    transition-duration: 250ms;
}
.test-class:hover::before {
    color: green; top: -2px; left: -2px;
}
</style>
<script>
const openUrl = () => {
    window.open("https://www.youtube.com/watch?v=Xm_dS-wEFvs");
};
</script>
<h1 class="test-class" onClick={openUrl}>
WOW
</h1>

Som kan defineras med en `style` tag, en `script` tag och en `h1`!
```html
<style>
.test-class {
    position: relative;
    transition-duration: 250ms;
    cursor: pointer;
}
.test-class:hover {
    color: blue;
}
.test-class::after {
    content: "WOW";
    position: absolute;
    left: 0; top: 0;
    transition-duration: 250ms;
}
.test-class:hover::after{
    color: red; top: -4px; left: -4px;
}
.test-class::before {
    content: "WOW";
    position: absolute;
    left: 0; top: 0;
    transition-duration: 250ms;
}
.test-class:hover::before {
    color: green; top: -2px; left: -2px;
}
</style>
<script>
const openUrl = () => {
    window.open("https://www.youtube.com/watch?v=Xm_dS-wEFvs");
};
</script>
<h1 class="test-class" onClick={openUrl}>
WOW
</h1>
```