# DNS Records — letsmoveit-right.com

## @ (Root Domain)

- **MX** — `10 postoffice.guardedhost.com` (TTL: 300)
- **A** — `3.248.248.14` (TTL: 86400)
- **TXT (SPF)** — `v=spf1 include:spf.guardedhost.com -all` (TTL: 300)

## _dmarc

- **TXT** — `v=DMARC1; p=reject; aspf=s` (TTL: 86400)

## ftp

- **A** — `216.239.136.169` (TTL: 300)

## omnis._domainkey

- **TXT (DKIM)** — (TTL: 86400)

```
v=DKIM1; h=sha256; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA9Kx4HflhH/MdmHtibgcsMEfnOgdnZaqqkWLdIIDBbXJNiGgie+2ZrNLf73a1ukxMqNhuK4C2JmpZ33FE7oWhusaRZl7Bdx8z5eaIEMl2Db45Qs/Ft/vTUeWJhWfsmLGlLxb2dQZRvC5R/FCPNtu/4U+XwSVSbLqbX35mAG5NrCv6fd4/UtIXAPh33t3JUvYWjnMIjkeUDy87jg19Syjp5AEwH09lvZNv5xtBSXAjUW8xsswGmxB9H98NNdQcH1ZV2Ii9cGaTL71kqaMqvcqP1oyG1vS1FzZzoUOx9yaM7SuDXccNtiwjuUP+0vs4iV0ZKlQC4o1t/QI/iyRywQ9l5QIDAQAB
```

## stats

- **A** — `216.239.136.169` (TTL: 300)

## www

- **A** — `3.248.248.14` (TTL: 86400)
