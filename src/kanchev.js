"use strict";
var fs = require("fs");
import utils from './utils.js'
import templating from './templating.js'
import markdown from './markdown.js'
import highlight from './highlight.js'

var G = {};  // the all-seeing G object, inspired by Flask

function MarkdownItem(path) {
    this.path = path
    this.is_article = path.includes("/posts/");
    this.is_page = !this.is_article;
    this.is_static = false;

    this.mime = "text/html";
    this.title = null;
    this.slug = null;
    this.author = null;
    this.date = new Date('2000-01-01T00:00');
    this.date_str = null;

    this.markdown = null;
    this.data = null;
}

MarkdownItem.prototype.load = function() {
    if(this.path == null || this.path == undefined)
        return _err(`cannot load(); path is undefined`);

    G.req.warn('loading: ' + this.path);
    let _err = (msg) => { G.req.warn(msg); }
    if(!utils.fileMayRead(this.path))
        return _err(`ignoring ${this.path} - file not readable`);

    let content = utils.readFile(this.path);
    let from;
    let header_regexp = /^[-|\+]{3}$([\s\S]*?)[-|\+]{3}$/gm;
    let header_kv_regexp = /^(\w+) ?[\:|\=] ?(.*)$/g;
    let header = [];

    let hugo_jekyll_match = header_regexp.exec(content);
    if(hugo_jekyll_match != null) {
        header = hugo_jekyll_match[1].trim().split('\n');
        this.markdown = content.substring(hugo_jekyll_match[0].length).trim();
    }

    if(header.length === 0) {
        let spl = content.trim().split("\n");
        for(let line in spl) {
            line = spl[line];
            if(!line.includes(':'))
                break;

            if(header_kv_regexp.exec(line))
                header.push(line);
            header_kv_regexp.lastIndex = 0;
        }

        from = header[header.length -1]
        this.markdown = content.substring(content.indexOf(from) + from.length).trim();
    }

    if(header.length === 0) {
        return _err(`ignoring ${this.path} - error parsing header, it did not match regexp ${header_regexp}`);
    }

    for(let line in header) {
        line = header[line];
        header_kv_regexp.lastIndex = 0;
        header_regexp.lastIndex = 0;

        let match = header_kv_regexp.exec(line);
        if(!match) {
            G.req.warn(`${this.path} - skipping line '${line}', regex not matched`);
            continue
        }

        let key = match[1].trim().toLowerCase();
        let val = match[2].trim();
        if(val.startsWith("\"") && val.endsWith("\""))
            val = val.slice(1, -1);

        if(key === "date") {
            val = val.trim();
            val = val.replace(" ", "T");
            val = new Date(val);
            if(isNaN(val))
                continue;
        }

        this[key] = val;
    }

    if(this.title === null || this.title === "")
        return _err(`ignoring ${this.path} - error parsing header, key 'title' not found`);

    this.date_str = utils.dateStr(this.date);
    this.data = markdown.to_html(this.markdown);
    this.slug = `/${this.date_str}/${utils.slugify(this.title)}.html`;
}

MarkdownItem.prototype.save = function() {
    let content = `+++
title: ${this.title}
date: ${utils.dateStr(this.date)}
author: ${this.author}
+++

${this.markdown}`;
    G.req.warn('writing markdown to path: ' + this.path);
    fs.writeFileSync(this.path, content);
}

function StaticFile(path) {
    this.path = path;
    this.slug = this.path.substring(G.cwd.length);
    if(!this.slug.startsWith('/'))
        this.slug = `/${this.slug}`;

    this.date = new Date('2000-01-01T00:00');
    this.date_str = null;
    this.is_article = false;
    this.is_page = false;
    this.is_static = true;

    this.ext = utils.mimeGuess(this.slug);
    this.mime = "text/plain";

    if(utils.mimeMap.hasOwnProperty(this.ext))
        this.mime = utils.mimeMap[this.ext];

    this.data = null;
}

StaticFile.prototype.load = function() {
    let path = `${G.cwd}${this.slug}`;
    this.data = utils.readFile(path); // @TODO: async
}

function Theme(name) {
    this.name = name
    this.base = `${G.cwd}/templates/${name}/`;
    this._data = {};
}

Theme.prototype.tmpl = function(name) {
    if(this._data.hasOwnProperty(name)) return this._data[name];
    if(this.base === null) throw `cannot read '${name}'`;
    const path = `${this.base}${name}`;
    let tmpl = utils.readFile(path);

    this._data[name] = tmpl;
    return tmpl;
}

Theme.prototype.render = function(item) {
    const tmpl_base = this.tmpl('base.html');
    let tmpl = this.tmpl(item.is_article ? "article.html" : "page.html");
    tmpl = tmpl_base.replace("{{content}}", tmpl);

    const data = utils.mergeDicts(G, {
        "title": item.title,
        "item": item
    });

    const html = templating.mustache(tmpl, data);
    return html;
}

function Blog() {
    this.themes = {};
    this.theme = null;

    this.themes_dir = `${G.cwd}/templates/`;
    this.content_dir = `${G.cwd}/content/`;

    this.items = [];
}

Blog.prototype.load_default_templates = function() {
    for (let theme_name in utils.default_themes) {
        let obj = utils.default_themes[theme_name];
        let theme = new Theme(theme_name);
        theme._data = obj;
        this.themes[theme_name] = theme;
    }
}

Blog.prototype.scan_templates = function() {
    this._scan_custom_templates(this.themes_dir);

    if(!this.themes.hasOwnProperty(G.theme))
        throw `Theme '${G.theme}' not found or available. Please change the $THEME variable.`;

    this.theme = this.themes[G.theme];
}

Blog.prototype._scan_custom_templates = function(fp) {
    let rtn = {};
    let fp_stat;

    // skip if custom template directory does not exist
    try { fp_stat = fs.lstatSync(fp) }
    catch(err) { return; }
    if(!fp_stat.isDirectory())
        return;

    let templates = utils.walk(fp);
    for(let _path in templates) {
        _path = templates[_path];
        _path = utils.normalizePathFast(_path);

        if(!fs.lstatSync(_path).isDirectory())
            continue;

        const theme_name = utils.basename(_path);
        if(theme_name === "_admin")
            continue;

        let bad = false;
        let data = {};

        const required = ['article.html', 'base.html', 'index.html', 'page.html']
        const theme_files = utils.walk(_path).join(" ");

        for(let _req in required) {
            _req = required[_req];
            if(!theme_files.includes(_req)) {
                G.req.warn(`skipping theme '${theme_name}' because '${_path}/${_req}' was not found`)
                bad = true;
                break;
            }
        }

        if(bad)
            continue;

        const theme = new Theme(theme_name);
        this.themes[theme_name] = theme;
    };
}

Blog.prototype.scan_content = function() {
    if(!utils.fileMayRead(this.content_dir)) {
        G.req.warn(`Content directory '${this.content_dir}' did not exist, creating.`);
        fs.mkdirSync(this.content_dir);
        fs.mkdirSync(`${this.content_dir}/pages/`);
        fs.mkdirSync(`${this.content_dir}/posts/`);
    }

    let paths = utils.walk(this.content_dir, true);
    let count_markdown = 0;

    paths.forEach(_path => {
        _path = utils.normalizePathFast(_path);

        let item;
        if(_path.endsWith(".md")) {
            item = new MarkdownItem(_path);
            this.items.push(item);
            count_markdown += 1;
        }
        else {
            item = new StaticFile(_path);
            this.items.unshift(item);
        }
    });

    if(count_markdown === 0)
        G.req.warn("No .md files found in the content directory.")
}

Blog.prototype.overview = function() {
    this.scan_templates();

    const tmpl_base = this.theme.tmpl('base.html');
    const tmpl_index = this.theme.tmpl('index.html');

    let articles = this.items.filter(article => {
        return article.is_article;
    });

    articles.forEach((article) => article.load());
    articles = utils.arr_date_sort(articles);

    let data = utils.mergeDicts(G, {
        "title": "Overview",
        "articles": articles
    });

    const tmpl = tmpl_base.replace("{{content}}", tmpl_index);
    const html = templating.mustache(tmpl, data);

    G.req.headersOut['content-type'] = 'text/html; charset=utf-8';
    return G.req.return(200, html);
}

Blog.prototype.by_uri = function(uri) {
    const post_regexp = /^(\/\d+\-\d+\-\d+\/[\S\s]+)/g;
    const is_article = post_regexp.exec(uri);
    const items = this.items.filter(a => {
        return is_article ? !a.is_static : a.is_static;
    });

    for(let item in items) {
        item = items[item];

        if(!item.is_static)
            item.load();

        if(item.slug !== uri)
            continue;

        if(item.data === null)
            item.load();

        return item;
    }

    return null;
}

function router(r) {
    setCtx(r);
    G.req.headersOut['content-type'] = 'text/html; charset=utf-8';
    if(r.uri === "/favicon.ico")
        return r.return(404, 'go fav yourself');

    const vendored = {
        "/vendored/prismjs.js": highlight.js_prism,
        "/vendored/prismjs-light.css": highlight.css_prism_light,
        "/vendored/prismjs-dark.css": highlight.css_prism_dark,
    }

    if(vendored.hasOwnProperty(r.uri)) {
        let mime = utils.mimeGuess(r.uri);
        G.req.headersOut['content-type'] = `${mime}; charset=utf-8`;
        return r.return(200, vendored[r.uri]);
    }

    G.db = new Blog();
    G.db.load_default_templates()
    G.db.scan_content();

    if(r.uri.startsWith("/admin"))
        return route_admin(r);

    if(r.uri === "/")
        return G.db.overview();

    let item = G.db.by_uri(r.uri);
    if(item === null)
        return G.req.return(404, "404");

    G.req.headersOut['content-type'] = `${item.mime}; charset=utf-8`;
    if(item.is_static)
        return G.req.return(200, item.data);

    G.db.scan_templates();
    const tmpl = G.db.theme.render(item);
    return G.req.return(200, tmpl);
}

function route_admin_api(r) {
    let req_obj;
    let data;
    G.req.headersOut['content-type'] = 'application/json; charset=utf-8';

    if(r.uri === '/admin/api/login' && r.method == 'POST') {
        // Set cookie if valid password supplied
        req_obj = JSON.parse(r.requestText);
        if(!req_obj.hasOwnProperty('login'))
            throw 'login';
        let valid = req_obj.login === G.admin_secret;
        if(valid)
            G.req.headersOut['Set-Cookie'] = `auth=${utils.sha256Hash(req_obj.login)}; Path=/; HttpOnly`;
        return G.req.return(200, JSON.stringify({ 'result': valid }));
    }

    if(!G.auth)
        return utils.redirect(r, '/admin/login');

    // Markdown -> HTML API
    if(r.uri === '/admin/api/md2html' && r.method == 'POST') {
        req_obj = JSON.parse(r.requestText);
        if(!req_obj.hasOwnProperty('markdown'))
            throw 'missing key markdown';
        let html = markdown.to_html(req_obj.markdown);
        return G.req.return(200, JSON.stringify({ 'html': html }));
    }

    // Add or edit Markdown files
    if (r.uri === '/admin/api/edit' && r.method == "POST") {
        let obj = JSON.parse(r.requestText);

        let required = ['date', 'markdown', 'slug', 'title'];
        for(let req in required) {
            req = required[req];
            if(!obj.hasOwnProperty(req))
                throw `key '${req}' not present`;
        }

        if(obj.title.trim() === "")
            throw 'Title cannot be empty';
        if(obj.markdown.trim() === "")
            throw 'The content cannot be empty';
        if(!obj.hasOwnProperty('author') || obj.author.trim() === "")
            obj.author = "admin";
        let date_regexp = /^\d{4}-\d{2}-\d{2}$/g;
        let date_match = date_regexp.exec(obj.date);
        if(date_match === null)
            throw 'date format should be: YYYY-MM-DD';

        let item;
        let obj_slug = obj.slug.trim();

        if(obj_slug !== "") {
            let articles = G.db.items.filter(article => {
                return article.is_article;
            });
            for(let article in G.db.items) {
                article = G.db.items[article];
                article.load();
                if(article.slug == obj_slug) {
                    item = article;
                }
            }
            if(item == null)
                throw 'could not find and edit article';
        } else {
            obj.slug = utils.slugify(obj.title);
            let path = utils.normalizePathFast(`${G.db.content_dir}/posts/${obj.slug}`);
            path = path.replace(".html.md", ".md");
            item = new MarkdownItem(path);
        }

        item.title = obj.title;
        item.slug = obj.slug;
        item.author = obj.author;
        item.markdown = obj.markdown;
        item.date = new Date(`${obj.date.trim()}T00:00`);
        item.date_str = utils.dateStr(item.date);
        item.save();

        return G.req.return(200, JSON.stringify({
            'result': 'ok',
            'url': `${obj.slug}`
        }));
    }

    return G.req.return(404, JSON.stringify({}));
}

function route_admin(r) {
    let tmpl = '';
    const tmpl_base = utils.readFile(`${G.cwd}templates/_admin/base.html`);

    if(r.uri.startsWith('/admin/api/')) {
        try {
            return route_admin_api(r);
        }
        catch(err) {
            return G.req.return(200, JSON.stringify({
                'error': err
            }));
        }
    }

    if(r.uri === '/admin/login') {
        tmpl = utils.readFile(`${G.cwd}templates/_admin/login.html`);
        tmpl = tmpl_base.replace("{{content}}", tmpl);
        tmpl = templating.mustache(tmpl, utils.mergeDicts(G, {
            "html_title": "Login"
        }));
        return G.req.return(200, tmpl);
    }

    if(!G.auth) {
        return utils.redirect(r, '/admin/login');
    }

    if(r.uri === "/admin/new") {
        tmpl = utils.readFile(`${G.cwd}templates/_admin/post.html`);
        tmpl = tmpl_base.replace("{{content}}", tmpl);
        tmpl = templating.mustache(tmpl, utils.mergeDicts(G, {
            "html_title": "New article",
            "date": G.now,
            "title": "New article"
        }));
        return G.req.return(200, tmpl);
    }

    let item = G.db.by_uri(r.uri.substring(6));
    if(!item)
        return G.req.return(200, "nope");

    tmpl = utils.readFile(`${G.cwd}templates/_admin/post.html`);
    tmpl = tmpl_base.replace("{{content}}", tmpl);

    const data = utils.mergeDicts(G, {
        "html_title": "Edit",
        "date": item.date_str,
        "item": item
    });

    G.req.warn('now: ' + data.now);
    const html = templating.mustache(tmpl, data);
    return G.req.return(200, html);
}

function is_logged_in(r) {
    let sha256sum = utils.getAuthCookie(r);
    if(!sha256sum)
        return false;
    if(sha256sum !== utils.sha256Hash(G.admin_secret))
        return false;
    return true;
}

function setCtx(r) {
    let _get = (p) => { return r.variables.hasOwnProperty(p) ? r.variables[p] : ''; }
    let required = ['CWD', 'BLOG_TITLE', 'ADMIN_SECRET'];

    // test some required config variables
    for(let req in required) {
        req = required[req];
        if(!r.variables.hasOwnProperty(req))
            throw `js_var '${req}' missing from the nginx config, please add it`;
    }

    // set global request ctx
    G['req'] = r;
    G['cwd'] = r.variables.CWD;
    G['admin_secret'] = r.variables.ADMIN_SECRET;
    if(!G.cwd.endsWith('/'))
        G.cwd += '/';
    G['theme'] = _get('THEME');
    if(G.theme === '')
        G.theme = 'default';
    G['blog_title'] = r.variables.BLOG_TITLE;
    G['blog_meta'] = _get('BLOG_META');
    G['now'] = utils.dateStr(new Date());
    G['auth'] = is_logged_in(r);
}

export default { router }
