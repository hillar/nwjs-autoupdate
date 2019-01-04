# {{ name }}

> {{ description }}

#### Build Setup

``` bash
# install dependencies

npm install

# build application for very first version, so autoupdater can run

npm run build

# serve with hot reload at localhost:{{ devport }}

npm run dev

# build application for production
# packages go to {{ releasesdir}}
# zipped packages & autoupdater manifest to {{ appsdir }}

npm run build


# run tiny temporary http server
# so built app can get manifest and zip's

python -m SimpleHTTPServer {{ devport }}

```
