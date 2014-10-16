module-sandbox
==============

Description
-----------

A library agnostic module/plugin framework. Register modules. Selectively initialise them. Pass in options. Interact with module apis in sandbox.

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