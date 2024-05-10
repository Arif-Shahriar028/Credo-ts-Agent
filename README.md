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

Change the directory to `agents` folder and open two individual terminal.

1. In First terminal, run `Acme` agent:

```
npx ts-node acme.ts
```

2. In Second terminal, run `Bob` agent:

```
npx ts-node bob.ts
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
- [ ] issuer public did create
- [ ] issuer schema creation
- [ ] issuer credential definition creation
- [ ] issuer credential offer
- [ ] holder credential request accept
- [ ] verifier proof request send
- [ ] holder proof response send
- [ ] verifier proof verification

#### Indy public ledger

`http://test.bcovrin.vonx.io/`
