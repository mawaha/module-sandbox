module-sandbox
==============

Description
-----------

A library agnostic module/plugin framework. Easily register modules. Selectively initialise them. Interact with module apis in sandbox. Inject dependencies.

Instructions
------------

1) Registering a module

```Javascript
CC.registerModule("myModuleName", function(){
  var doSomethingAwesome = function(){
    console.log("Awesomeness!");
  };
  
  
  return {
    doSomethingAwesome: doSomethingAwesome
  };
});
```

2) Initialising modules

`CC(scope, modules, sandbox);`

```Javascript
CC.(document, "myModuleName", function(myModuleName){
  myModuleName.doSomethingAwesome();
});
```
