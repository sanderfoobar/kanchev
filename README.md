# Kanchev

Kanchev is a *cursed* blogging engine written for [nginx-njs](https://github.com/nginx/njs). 
Using Kanchev, you can point nginx to a directory containing Markdown files and 
those files will be rendered on-the-fly.

However, Kanchev does not work very well because `nginx-njs` just dies when there are 
too many blog posts due to memory limits (?). Using this project would be stupid.

Kanchev comes as a single, small 128kb javascript file.

## Features

- a theme
- a templating engine
- a markdown->HTML converter
- client-side syntax highlighting (via [PrismJS](https://prismjs.com/)).

Kanchev supports Markdown files written for Hugo, Pelican, and Jekyll.

## Quickstart
### nginx-njs
To install `nginx-module-njs` we'll (most likely) need [the official Nginx mirror](http://nginx.org/en/linux_packages.html#instructions).

```bash
sudo apt install -y nginx-module-njs
```

And then load the module inside `/etc/nginx/nginx.conf`:

```nginx
load_module modules/ngx_http_js_module.so;
```

### Kanchev

Move `kanchev.js` to `/var/www/html/kanchev/kanchev.js` and create a nginx `location {}` like the one below:

```nginx
location / {
    js_path /var/www/html/kanchev/;
    js_var $CWD "/var/www/html/kanchev/";
    js_var $BLOG_TITLE "The blogtitle";
    js_var $THEME "default";
    js_var $BLOG_META "devblog";
    js_var $ADMIN_SECRET "changeme";

    js_import kanchev from kanchev.js;
    js_content kanchev.router;
}
```

Create some `.md` files in `/var/www/html/kanchev/content/`.

## License

WTFPL