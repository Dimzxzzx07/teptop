# WebAssembly modules

Put compiled `.wasm` files in this directory and load them through
`createWebFramework().wasm('./wasm/module.wasm')`. The loader validates the file
extension and applies a 16 MiB default size limit.