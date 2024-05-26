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

2. In Second terminal, run `Verifier` agent:

```
yarn verifier
```

Use Bifold mobile wallet app as a holder.

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
- [x] holder credential request accept
- [x] verifier proof request send
- [x] holder proof response send
- [x] verifier proof verification

### During credential exchange

**Issuer States**

- proposal-received (Optional)
- offer-sent (1)
- request-received (4)
- credential-issued (5)
- done (8)

**Holder States**

- proposal-sent (Optional)
- offer-received (2)
- request-sent (3)
- credential-received (6)
- done (7)

#### Indy public ledger

`http://test.bcovrin.vonx.io/`
