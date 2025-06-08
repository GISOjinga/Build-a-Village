# rbx-hot-reloader

## Basic Usage

```ts
const container = ReplicatedStorage;

const hotReloader = new HotReloader();

hotReloader.scan(container, (context) => {}, (context) => {});

const module = ReplicatedStorage.SomeModule

hotReloader.listen(module, (context) => {}, (context) => {})
```

### Advanced usage

```ts
// assume that this is some module

defineCleanupCallback(() => {
    // do some stuff;
})
```