# Credo-ts-Agent

## Set up process

1. Clone and the repo:

```
git clone https://github.com/Arif-Shahriar028/Credo-ts-Agent.git
```

2. Change endpoints:

Change issuer and verifier endpoints in values.ts file located at `./utils/values.ts`. Place your computers ip address at the url or you can keep the ip as `localhost`.

3. Add cosmos_payer_seed at .env file:

Create a .env file under project root following the .env.sample file. Add your cheqd secret phrase in cosmos_payer_seed field.

4. Install modules and packages:

```
yarn install
```

## Run agents

1. In First terminal, run `Issuer` agent:

```
yarn issuer
```

After running issuer agent, you will get an invitation url and qr code on terminal. Use them as your need.

2. In Second terminal, run `Verifier` agent:

```
yarn verifier
```

After running verifier agent, you will get an invitation url and qr code on terminal. Use them as your need.

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
