# Credo-ts-Agent

## Set up process

1. Clone and the repo:

```
git clone https://github.com/Arif-Shahriar028/Credo-ts-Agent.git
```

2. Install modules and packages:

```
yarn install
```

## Run agents

1. In First terminal, run `Issuer` agent:

```
yarn issuer
```

2. In Second terminal, run `Holder` agent:

```
yarn holder
```

### Make terminal output faster

Add the following object into the package.json:

```
"resolutions": {
  "ref-napi": "npm:@2060.io/ref-napi",
  "@types/node": "^16.11.7"
}
```

Then: `yarn refresh`

### @TODO

- [x] connection establishment
- [x] issuer public did create
- [x] issuer schema creation
- [x] issuer credential definition creation
- [x] issuer credential offer
- [ ] holder credential request accept
- [ ] verifier proof request send
- [ ] holder proof response send
- [ ] verifier proof verification

#### Indy public ledger

`http://test.bcovrin.vonx.io/`
