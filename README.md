# heng-front-end

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## example

### auth.json

```json
{
	"ak": "1754b3bf6e5687046af11da6f12ba418c4340f2b6011b430c9da11b0e05b10191f895c5333009d59651209595b4b35065484e706959cac37d949e15bd5a8ab28",
	"sk": "c16ef3ed7871dcbdf65b827117537399725d28e6f1ea8329ac0c0675ee8fa65b9311dfdcf92114546cd05adfe8c7eaf25ec382c18869875e23d81af48b097f8b",
	"prefix": "http://lev.xxxx.edu.cn/c/v1/"
}
```

### nginx

```properties
location /c/v1 {
    if ($request_method = OPTIONS){
        return 200;
    }
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Methods' 'GET, PUT, POST, DELETE, OPTIONS';
    add_header 'Access-Control-Allow-Headers' '*';
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://127.0.0.1:8080;
}
```