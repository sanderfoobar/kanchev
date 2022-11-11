
var fs = require("fs");
var crypto = require("crypto");

var default_themes = {
 "_admin": {
  "base.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Kanchev - {{html_title}}</title>\n\n  <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC\" crossorigin=\"anonymous\">\n  <link href=\"https://unpkg.com/easymde@2.18.0/dist/easymde.min.css\" rel=\"stylesheet\" crossorigin=\"anonymous\">\n  <style>\n      pre {\n          background: #f0f0f0;\n          padding: 10px;\n      }\n\n      .container-fluid {\n          max-width: 2400px;\n      }\n  </style>\n\n  <script src=\"https://unpkg.com/easymde@2.18.0/dist/easymde.min.js\"></script>\n  <script>\n      var api_edit = \"/admin/api/edit\";\n      var api_login = \"/admin/api/login\";\n      var api_md2html = \"/admin/api/md2html\";\n\n      function setCookie(name, value, days) {\n          var expires = \"\";\n          if (days) {\n              var date = new Date();\n              date.setTime(date.getTime() + (days*24*60*60*1000));\n              expires = \"; expires=\" + date.toUTCString();\n          }\n          document.cookie = name + \"=\" + (value || \"\")  + expires + \"; path=/\";\n      }\n\n      function api_call(url, data, method) {\n          const body = JSON.stringify(data);\n          return fetch(url, {\n              credentials: \"same-origin\",\n              mode: \"same-origin\",\n              method: method,\n              headers: {\"Content-Type\": \"application/json\"},\n              body: body\n          });\n      }\n\n      let debounceTimer;\n      const debounce = (callback, time) => {\n          window.clearTimeout(debounceTimer);\n          debounceTimer = window.setTimeout(callback, time);\n      };\n  </script>\n\n</head>\n<body>\n\n{{content}}\n\n</body>\n</html>",
  "login.html": "<div class=\"body\" style=\"margin-top: 20px;\">\n  <div class=\"container\">\n    <div class=\"row\">\n      <form id=\"formLogin\" onsubmit=\"return formSubmit(event)\" role=\"form\" method=\"POST\">\n\n          <div class=\"col-md-6\">\n            <div class=\"form-group mb-3\">\n              <label for=\"title\">Enter admin secret</label>\n              <input id=\"login\" type=\"password\" name=\"login\" class=\"form-control\" placeholder=\"Login\" value=\"\">\n            </div>\n\n            <div class=\"form-group mb-4\">\n              <button type=\"submit\" class=\"btn btn-primary\">Login</button>\n            </div>\n          </div>\n\n      </form>\n    </div>\n  </div>\n</div>\n\n<script>\n    function formSubmit(ev) {\n        let sel_form = document.getElementById('formLogin');\n        let formData = new FormData(sel_form);\n        let data = {\n            \"login\": formData.get('login')\n        }\n\n        api_call(api_login, data, \"POST\").then((resp) => {\n            resp.json().then((resp) => {\n                if (resp.hasOwnProperty('result'))\n                    if (resp.result === false)\n                        alert(\"Wrong password\");\n                    else\n                        window.location.href = `/admin/new`;\n            });\n        }).catch(err => {\n            alert(err);\n        });\n\n        return false;\n    }\n</script>\n",
  "post.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>Kanchev - Edit</title>\n\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC\" crossorigin=\"anonymous\">\n    <link href=\"https://unpkg.com/easymde@2.18.0/dist/easymde.min.css\" rel=\"stylesheet\" crossorigin=\"anonymous\">\n    <style>\n        pre {\n            background: #f0f0f0;\n            padding: 10px;\n        }\n\n        .container-fluid {\n            max-width: 2400px;\n        }\n    </style>\n</head>\n<body>\n\n<div class=\"body\" style=\"margin: 20px;\">\n    <div class=\"container-fluid\">\n        <div class=\"row\">\n            <nav class=\"navbar navbar-expand-lg navbar-light bg-light\">\n                <div class=\"container-fluid\">\n                    <span class=\"navbar-brand\" href=\"/\">\n                        {{^item.slug}}\n                        Add post\n                        {{/item.slug}}\n                        {{#item.slug}}\n                        Edit post\n                        {{/item.slug}}\n                    </span>\n                    <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#navbarSupportedContent\" aria-controls=\"navbarSupportedContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n                        <span class=\"navbar-toggler-icon\"></span>\n                    </button>\n                    <div class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\">\n                        <ul class=\"navbar-nav me-auto mb-2 mb-lg-0\">\n                            <li class=\"nav-item\">\n                                <a class=\"nav-link active\" aria-current=\"page\" href=\"/\">Back to website</a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n            </nav>\n        </div>\n        <br>\n        <div class=\"row\">\n\n            <div class=\"col-md-6\">\n                <form id=\"formProposal\" onsubmit=\"return formSubmit(event)\" role=\"form\" method=\"POST\">\n                    <div class=\"row\">\n                        <div class=\"col-md-6\">\n                            <div class=\"form-group mb-3\">\n                                <label for=\"title\">Title</label>\n                                <input id=\"title\" type=\"text\" name=\"title\" class=\"form-control\" placeholder=\"Title\" value=\"{{item.title}}\">\n                            </div>\n                        </div>\n\n                        <div class=\"col-md-6\">\n                            <div class=\"form-group mb-3\">\n                                <label for=\"title\">Author</label>\n                                <input id=\"author\" type=\"text\" name=\"author\" class=\"form-control\" placeholder=\"Author\" value=\"{{item.author}}\">\n                            </div>\n                        </div>\n                    </div>\n\n                    <div class=\"row\">\n                        <div class=\"col-md-6\">\n                            <div class=\"form-group mb-3\">\n                                <label for=\"title\">Date</label>\n                                <input id=\"date\" type=\"text\" name=\"date\" class=\"form-control\" placeholder=\"Date\" value=\"{{date}}\">\n                            </div>\n                        </div>\n                    </div>\n\n                    <input hidden id=\"slug\" type=\"text\" name=\"slug\" class=\"form-control\" placeholder=\"\" value=\"{{item.slug}}\">\n\n                    <div class=\"form-group\">\n                        <label>Content</label>\n                        <textarea id=\"content\" class=\"textarea\" name=\"markdown\" placeholder=\"Place some text here\" style=\"width: 100%; height: 600px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;\">{{item.markdown}}</textarea>\n                    </div>\n\n                    <div class=\"form-group mb-4\">\n                        <button type=\"submit\" class=\"btn btn-primary\">Submit</button>\n                    </div>\n                </form>\n            </div>\n\n            <div class=\"col-md-6\">\n                <div class=\"card mb-4\" style=\"margin-top: 182px;\">\n                    <div class=\"card-header\">\n                        Preview\n                    </div>\n                    <div class=\"card-body\">\n                        <p id=\"preview\" class=\"card-text\">-</p>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n<script src=\"https://unpkg.com/easymde@2.18.0/dist/easymde.min.js\"></script>\n<script>\n    var sel_form = document.getElementById('formProposal');\n    var sel_preview = document.getElementById('preview');\n\n    const easyMDE = new EasyMDE({\n        element: document.getElementById('content'),\n        autofocus: true,\n        forceSync: true});\n\n    function formSubmit(ev) {\n        let formData = new FormData(sel_form);\n        let data = {\n            \"title\": formData.get('title'),\n            \"markdown\": formData.get(\"markdown\"),\n            \"date\": formData.get('date'),\n            \"slug\": formData.get('slug'),\n            \"author\": formData.get('author')\n        }\n\n        api_call(api_edit, data, \"POST\").then((resp) => {\n            resp.json().then((resp) => {\n                if (resp.hasOwnProperty('result'))\n                    if (resp.result === 'ok')\n                        window.location.href = resp.url;\n                    else\n                        alert(resp.error);\n            });\n        }).catch(err => {\n            alert(err);\n            debugger;\n        });\n\n        return false;\n    }\n\n    const previewMarkdown = () => {\n        var val = easyMDE.value();\n        if(val === \"\" || val === undefined) return;\n\n        api_call(api_md2html, {\"markdown\": val}, \"POST\").then(resp => {\n            resp.json().then((resp) => {\n                sel_preview.innerHTML = resp.html;\n            });\n        })\n        .catch(err => {\n            console.log(err);\n        });\n    }\n\n    easyMDE.codemirror.on(\"change\", () => {\n        debounce(previewMarkdown, 200);\n    });\n\n    previewMarkdown();\n</script>\n\n</body>\n</html>"
 },
 "default": {
  "article.html": "<div id=\"wrapper\" class=\"article\">\n    <h1>{{item.title}}</h1>\n    <h4>\n        By {{item.author}}\n        <small> - {{item.date_str}}\n        {{#auth}}\n        <a href=\"/admin{{item.slug}}\">edit</a>\n        {{/auth}}\n        </small>\n    </h4>\n    <hr>\n    {{item.data}}\n</div>\n",
  "base.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>{{title}}</title>\n    <style>\n        html, body, div, span, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote,\n        pre, abbr, address, cite, code, del, dfn, rem, img, ins, kbd, q, samp, small,\n        strong, var, b, i, dl, dt, dd, ol, ul, li, fieldset, form, label,\n        legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas,\n        details, figcaption, figure, footer, header, hgroup, menu, nav, section,\n        summary, time, mark, audio, video {\n            background: transparent;\n            border: 0;\n            font-variant: normal;\n            font-size: 1.2rem;\n            font-familiy: monospace;\n            margin: 0;\n            outline: 0;\n            padding: 0;\n            vertical-align: baseline;\n        }\n\n        code[class*=\"language\"] span {\n            font-size: 1.4rem !important;\n        }\n\n        html {\n            font-size: 1.0rem;\n        }\n\n        /*\n          Turn off font boosting. It seems to only boost the prose, but not\n          the code or the KaTeX.\n        */\n        html * {\n            max-height:1000000px;\n        }\n\n        /*\n          Instead, make fonts on high-DPI small screens bigger. This is kinda imperfect\n          but seems to work OK. I test it with chrome responsive simulator in the dev\n          tools.\n\n          I also keep the landscape mode unzoomed so that people can use it to check\n          out the code.\n        */\n        @media (-webkit-min-device-pixel-ratio: 1.95) and (max-width: 1000px) and (orientation: portrait) {\n            html {\n                font-size: 1.6rem;\n            }\n        }\n\n        html, body {\n            height: 100%;\n        }\n\n        body {\n            color: #00000f;\n            font-family: \"IBM Plex Serif\", Garamond, Georgia, serif;\n            margin: 0;\n            padding: 0;\n            text-align: justify;\n        }\n\n        code, samp {\n            font-family: \"IBM Plex Mono\", monospace;\n            font-style: normal;\n        }\n\n        pre {\n            font-size: 0.9rem;\n        }\n\n        sup {\n            font-size: 0.8rem;\n        }\n\n        #title {\n            color: #00000f;\n            text-align: left;\n            margin: 0 2rem;\n            font-weight: bold;\n            font-size: 3.5rem;\n            font-family: \"IBM Plex Sans\", Helvetica, Arial, sans-serif;\n        }\n\n        #title a {\n            text-decoration: none;\n            color: #00000f;\n        }\n\n        #wrapper {\n            margin: 0 2rem 0rem 2rem;\n            width: calc(100% - 4rem);\n        }\n\n        #wrapper, #comments {\n            display: block;\n            max-width: 1000px;\n        }\n\n        #wrapper > *, #comments > * {\n            grid-column-start: 1;\n            grid-column-end: 2;\n        }\n\n        h1, h2, h3 {\n            font-family: \"IBM Plex Sans\", Helvetica, Arial, sans-serif;\n        }\n\n        h1 a, h2 a, h3 a {\n            text-decoration: none;\n        }\n\n        /* Stuff for the index */\n\n        #articles {\n            max-width: 100%;\n            font-family: \"IBM Plex Sans\", Helvetica, Arial, sans-serif;\n            font-size: 1rem;\n            grid-column-start: 1;\n            grid-column-end: 3;\n        }\n\n        .date {\n            font-size: 0.9rem;\n            font-style: italic;\n            line-height: 1.7rem;\n            font-weight: 300;\n            margin-right: 0.3rem;\n        }\n\n        .post-item-info {\n            float: right;\n            clear: both;\n        }\n\n        .tag {\n            font-size: 0.8rem;\n            /* border-radius: 0.25rem; */\n            background-color: #e8e8de;\n            /* color: white; */\n            padding: 0.15rem 0.2rem;\n            margin: 0 0.1rem;\n            font-weight: 300;\n        }\n\n        .date-tags {\n            color:#5b5b5b;\n            font-weight: 400;\n            text-shadow: none;\n            font-size: 0.7rem;\n            display: block;\n            float: left;\n            text-align: right;\n            line-height: 2rem;\n        }\n\n        #articles a {\n            color: black;\n            text-decoration: none;\n            font-weight: 700;\n            font-size: 1.2rem;\n            line-height: 1.4rem;\n        }\n\n        #articles h2 {\n            text-align: left;\n        }\n\n        /* Stuff for the article display */\n\n        .article .sourceCode, .article pre {\n            grid-column-start: 1 !important;\n            grid-column-end: 3 !important;\n            justify-self: stretch;\n        }\n\n        @media (-webkit-min-device-pixel-ratio: 1.95) and (max-width: 1000px) {\n            .article h1 {\n                grid-column-start: 1 !important;\n                grid-column-end: 3 !important;\n                justify-self: stretch;\n            }\n        }\n\n        h1, h2, h3, h4, h5, h5 {\n            text-align: left;\n        }\n\n        .article .footnotes-end-of-block {\n            grid-column-start: 2 !important;\n            grid-column-end: 3 !important;\n            justify-self: stretch;\n            margin-left: 2.5rem;\n            border-top: 1px solid black;\n            padding-top: 0.5rem;\n            opacity: 0.85;\n        }\n\n        .footnotes-end-of-block, .footnotes-end-of-block li, .footnotes-end-of-block p {\n            font-size: 0.8rem;\n        }\n\n        .footnotes-end-of-block ul {\n            margin: 0.2rem 0 !important;\n        }\n\n        .article h1 {\n            color: black;\n            text-align:left;\n            font-size: 1.8rem;\n            font-weight: 700;\n        }\n\n        .article h1 .date {\n            float: right;\n            padding: 0 0 0 1em;\n            font-size: 1em;\n        }\n\n        .article h1 .date span {\n            font-size: 1.2rem;\n        }\n\n        p {\n            font-family: \"IBM Plex Serif\", Garamond, Georgia, serif;\n            font-size: 1.2rem;\n            line-height: 1.3rem;\n        }\n\n        blockquote {\n            background: #f0f0f083;\n            border-left: 0.2rem solid #7F1315;\n            margin: 0 0 0.5rem 2rem;\n            padding: 0.5rem 0.7rem;\n            margin-top: 0.8rem;\n            margin-bottom: 1.2rem;\n        }\n\n        blockquote p {\n            text-indent: 0;\n        }\n\n        .article h2 {\n            font-size:1.6rem;\n            font-weight: 500;\n            line-height: 1.7rem;\n        }\n\n        .article h3 {\n            font-size:1.3rem;\n            font-weight: 500;\n        }\n\n        a {\n            color: #00000f;\n        }\n\n        .article ul, .article ol {\n            margin-left: 1.5rem;\n        }\n\n        .article li {\n            margin:0 0 0.2rem 0;\n        }\n\n        .article li p {\n            text-indent: 0;\n        }\n\n        pre {\n            margin:0.2rem 0;\n            padding:0.4rem 0.7rem;\n            font-size: 0.9rem;\n            font-family: \"IBM Plex Mono\", monospace;\n        }\n\n        table {\n            margin-left: auto;\n            margin-right: auto;\n        }\n\n        /* Pandoc and agda */\n        pre {\n            background-color:rgba(243, 243, 187, 0.7);\n            overflow-y: auto;\n        }\n\n        p code, li code {\n            background-color: rgb(240, 240, 240);\n            color: black;\n            font-weight: bold;\n        }\n\n        p code {\n            padding: 0 0.2rem;\n        }\n\n        pre {\n            overflow-y: auto;\n        }\n\n        table.sourceCode {\n            width:100%;\n        }\n\n        /*\n        ::-webkit-scrollbar {\n          width: 7px;\n          height: 7px;\n        }\n\n        ::-webkit-scrollbar-track {\n          background-color: #00000f;\n        }\n\n        ::-webkit-scrollbar-thumb {\n          background-color: #d8d8ca;\n          border-radius: 7px;\n        }\n        */\n\n        .article td {\n            padding: 0.1rem 0.2rem;\n        }\n\n        .article img {\n            max-width: 100%;\n        }\n\n        .figure {\n            text-align: center;\n        }\n\n        .center-image {\n            text-align: center;\n        }\n\n        .center-image-rounded img {\n            border-radius: 0.25rem;\n        }\n\n        .sc {\n            font-variant: small-caps;\n        }\n\n        .yt {\n            text-align: center;\n            margin: 0.3rem 0;\n        }\n\n        sup, sub {\n            vertical-align: baseline;\n            position: relative;\n            top: -0.4rem;\n        }\n\n        sub {\n            top: 0.4rem;\n        }\n\n        small {\n            font-size: 0.8rem;\n        }\n\n        .presentation-section {\n            min-height: 100vh;\n        }\n\n        .text-center {\n            text-align: center;\n        }\n\n        .article h2 {\n            margin-bottom: 0.5rem;\n        }\n\n        .todo {\n            color: rgb(231, 0, 0);\n            font-weight: 500;\n        }\n\n        .footer {\n            margin-bottom: 1.5rem;\n            margin-top: 0.5rem;\n        }\n\n        .article hr {\n            width: 100%;\n            margin-bottom: 20px;\n        }\n\n        hr {\n            border: none;\n            margin: 0;\n        }\n\n        hr::before {\n            display: block;\n            text-align: center;\n            font-size: 1.2rem;\n            color: rgb(104, 104, 104);\n        }\n\n        #comments hr, .footnotes hr, .footer hr {\n            /* border: 0.1rem inset rgb(0, 0, 15);*/\n            border-top-width: 0.1rem;\n            border-top-style: solid;\n            border-color: rgb(104, 104, 104);\n        }\n\n        #comments hr::before, .footnotes hr::before, .footer hr::before {\n            content: '';\n        }\n\n        /* section links */\n\n        :is(h2, h3, h4, h5, h6) .section-link {\n            font-style: italic;\n            text-decoration: none;\n            color: rgba(128, 128, 128, 0.678);\n        }\n\n        :is(h2, h3, h4, h5, h6):hover .section-link {\n            color: grey;\n            visibility: visible;\n        }\n\n        /* content vertical paddings. in general, we add spacing _after_ the elements */\n\n        .article h1 {\n            padding: 0 0 0.5rem 0;\n        }\n\n        p {\n            padding: 0 0 0.5rem 0;\n        }\n\n        hr, ul, ol, .article .sourceCode, .article pre, .article h1, .article h2, .article h3 {\n            margin-bottom: 1rem;\n            margin-top: 1rem;\n        }\n\n        /* for this one we make an exception and margin upwards to separate sections a bit */\n        .article h2 {\n            margin-top: 1.2rem;\n        }\n\n        .article h3 {\n            margin-top: 1.2rem;\n        }\n\n        #articles {\n            margin-top: 1.5rem;\n            margin-bottom: 0.5rem;\n        }\n\n        #articles h2 {\n            margin-bottom: 0.10rem;\n        }\n\n        .footnote-ref {\n            margin-left: 0.15rem;\n        }\n\n        .page-sizes-table td, .page-sizes-table th {\n            padding: 0.1rem 0.5rem;\n        }\n\n        .page-sizes-table td {\n            padding-left: 0.7rem !important;\n        }\n\n        .page-sizes-table th {\n            padding-bottom: 0.2rem;\n        }\n\n        .page-sizes-table thead th {\n            border-bottom: 1px solid black;\n        }\n\n        .page-sizes-table .even {\n            background-color: #00000012;\n        }\n\n        /* Lanczos */\n\n        .filters-showcase-container {\n            grid-column-end: 4 !important;\n            overflow-y: auto;\n            margin: 0.5rem 0 1rem 0;\n            padding: 0.5rem 0 0.5rem 0;\n            text-align: left;\n        }\n\n        .filter-showcase-caption {\n            text-align: center;\n            margin-bottom: 0.5rem;\n        }\n\n        .filters-showcase {\n            emtpy-cells: show;\n            font-size: 1.2rem;\n            font-weight: normal;\n            border: 0;\n            margin-left: 0;\n        }\n\n        .filters-showcase th, td {\n            text-align: center;\n            vertical-align: middle;\n        }\n\n        .filters-showcase tbody th {\n            padding: 0 0.50rem;\n            position: sticky;\n            z-index: 1;\n            left: 0;\n            background-color: #FFFFF0F0;\n        }\n\n        .filters-showcase .original {\n            background-color: #F3F3F3F0;\n        }\n\n        .filters-showcase td {\n            padding: 0;\n            margin: 0;\n        }\n\n        .filters-showcase .name {\n            font-weight: normal;\n            font-style: italic;\n        }\n\n        .filters-showcase .sample {\n            max-width: max(80px, min(calc(100vh/5 - 2rem), 140px));\n            max-height: max(80px, min(calc(100vh/5 - 2rem), 140px));\n            overflow: hidden;\n        }\n\n        /* We can't use background image because we can't apply the crisp-edges filter */\n        .filters-showcase .sample img, .sample-big img {\n            max-width: none;\n            /*\n              According to the latest standard, the right thing is crisp-edges, but chrome doesn't\n              support it yet. This is from puzzlescript.\n            */\n            image-rendering: -moz-crisp-edges;\n            image-rendering: -webkit-crisp-edges;\n            image-rendering: pixelated;\n            image-rendering: crisp-edges;\n        }\n\n        .filters-showcase .sample img {\n            margin-left: 50%;\n            transform: translateX(-50%);\n        }\n\n        .filters-showcase-container .filters-showcase .sample img {\n            margin-left: 50%;\n            margin-top: 50%;\n            transform: translateX(-50%) translateY(-50%);\n        }\n\n        .filters-showcase .sample img {\n            margin-left: 50%;\n            transform: translateX(-50%);\n        }\n\n        .full-width-image img {\n            width: 100%;\n        }\n\n        .lanczos-table table {\n            width: 100%;\n        }\n\n        .lanczos-table td {\n            font-size: smaller;\n        }\n\n        .lanczos-table img {\n            width: 100%;\n        }\n\n        .lanczos-fourier-showcase {\n            grid-column-end: 3 !important;\n        }\n\n\n        .lanczos-fourier-showcase-full {\n            grid-column-end: 3 !important;\n            overflow-y: auto;\n        }\n\n        .lanczos-fourier-showcase-full p {\n            padding: 0;\n        }\n\n        .lanczos-fourier-showcase-full img {\n            width: 70rem;\n            max-width: none;\n        }\n\n        .lanczos-maths {\n            grid-column-end: 3 !important;\n            width: 100%;\n            overflow-x: auto;\n        }\n\n        .large-image {\n            text-align: center;\n        }\n\n        @media (orientation: portrait) or (max-width: 800px) {\n            .large-image {\n                grid-column-end: 3 !important;\n            }\n\n            .large-image img {\n                width: 100%;\n            }\n        }\n\n        .extra-large-image {\n            grid-column-end: 3 !important;\n        }\n\n        @media (orientation: portrait) or (max-width: 800px) {\n            .extra-large-image img {\n                width: 100%;\n            }\n        }\n\n        .footnote-ref {\n            text-decoration: none;\n        }\n\n        .footnote-ref sup {\n            text-decoration: underline;\n        }\n\n        /* Comments */\n\n        #comments {\n            grid-column-start: 1;\n            grid-column-end: 3;\n            margin-bottom: 0.5rem;\n        }\n\n        .operator {\n            font-weight: bold;\n        }\n\n        .comment-date {\n            font-style: italic;\n        }\n\n        .comment hr {\n            border-top-width: 0.1rem;\n            width: calc(100% - 1rem);\n            border-color: rgb(104, 104, 104, 0.5) !important;\n        }\n\n        .comment blockquote {\n            margin-left: 1rem;\n        }\n    </style>\n    <link rel=\"stylesheet\" href=\"/vendored/prismjs-light.css\">\n</head>\n<body>\n<br>\n<style>\n#title a#logo span {\n  font-size: 2rem;\n  transform: rotate(-8deg);\n  display: inline-block;\n}\n</style>\n<div id=\"title\">\n    <a id=\"logo\" href=\"/\">{{blog_title}} <span>{{blog_meta}}</span></a>\n</div>\n\n{{content}}\n\n<div id=\"wrapper\">\n    <hr>\n    <div class=\"footer\">\n        <hr>\n        <a style=\"font-size:0.8rem;\" href=\"https://github.com/kroketio/kanchev\">Powered by Kanchev - The cursed nginx-njs blogging engine</a>\n        {{^auth}}\n        -\n        <a style=\"font-size:0.8rem;\" href=\"/admin\">login</a>\n        {{/auth}}\n        {{#auth}}\n        -\n        <a style=\"font-size:0.8rem;\" href=\"/admin/new\">new post</a>\n        {{/auth}}\n    </div>\n</div>\n\n<script src=\"/vendored/prismjs.js\"></script>\n</body>\n</html>",
  "index.html": "<div id=\"wrapper\">\n  <div id=\"articles\">\n    {{^articles}}\n    Oof. This blog is empty.\n    {{/articles}}\n\n    {{#articles}}\n    <h2>\n      <span class=\"date\">{{date_str}}</span>\n      <a href=\"{{slug}}\">{{title}}</a>\n      <span class=\"tags\"><span class=\"tag\">post</span><span class=\"tag\">short</span></span>\n    </h2>\n    {{/articles}}\n  </div>\n</div>",
  "page.html": "<div id=\"wrapper\" class=\"page\">\n    {{item.data}}\n</div>\n"
 }
};
var walk = function(dir, recurse) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory() && recurse === true)
            results = results.concat(walk(file, recurse));
        else
            results.push(file);
    });

    return results;
}

let redirect = (r, url) => {
    return r.return(302, url);
}

let sha256Hash = (p) => { return crypto.createHash('sha256').update(p).digest('hex'); }
let isFunc = (p) => { return p instanceof Function; }
let normalizePathSlow = (p) => { return fs.realpathSync(p.replace(/\.\./g, "")); }
let normalizePathFast = (p) => { return p.replace(/\/\//g, '/').replace(/\.\./g, ""); }
let basename = (p) => { return p.split("/").slice(-1)[0] }
let basepath = (p) => { return p.slice(0, -basename(p).length); }
let readFile = (p) => { return fs.readFileSync(p, {encoding:'utf8', flag:'r'}); }
let dateStr = (p) => {
    return `${p.getFullYear()}-${("0" + (p.getMonth()+1)).slice(-2)}-${("0" + (p.getDate())).slice(-2)}`;
}
function getAuthCookie(r) {
    if(!r.headersIn.hasOwnProperty('Cookie'))
        return;
    let cookies = r.headersIn['Cookie'];
    let auth_regexp = /auth=(\w+)/g;
    let auth_cookie = auth_regexp.exec(cookies);
    if(auth_cookie)
        return auth_cookie[1];
}
let arr_date_sort = (p) => p.sort((a, b) => { return new Date(b.date) - new Date(a.date); })
let slugify = (str) => {
    str = String(str).toString();
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const swaps = {
        '0': ['°', '₀', '۰', '０'],
        '1': ['¹', '₁', '۱', '１'],
        '2': ['²', '₂', '۲', '２'],
        '3': ['³', '₃', '۳', '３'],
        '4': ['⁴', '₄', '۴', '٤', '４'],
        '5': ['⁵', '₅', '۵', '٥', '５'],
        '6': ['⁶', '₆', '۶', '٦', '６'],
        '7': ['⁷', '₇', '۷', '７'],
        '8': ['⁸', '₈', '۸', '８'],
        '9': ['⁹', '₉', '۹', '９'],
        'a': ['à', 'á', 'ả', 'ã', 'ạ', 'ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ', 'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ', 'ā', 'ą', 'å', 'α', 'ά', 'ἀ', 'ἁ', 'ἂ', 'ἃ', 'ἄ', 'ἅ', 'ἆ', 'ἇ', 'ᾀ', 'ᾁ', 'ᾂ', 'ᾃ', 'ᾄ', 'ᾅ', 'ᾆ', 'ᾇ', 'ὰ', 'ά', 'ᾰ', 'ᾱ', 'ᾲ', 'ᾳ', 'ᾴ', 'ᾶ', 'ᾷ', 'а', 'أ', 'အ', 'ာ', 'ါ', 'ǻ', 'ǎ', 'ª', 'ა', 'अ', 'ا', 'ａ', 'ä'],
        'b': ['б', 'β', 'ب', 'ဗ', 'ბ', 'ｂ'],
        'c': ['ç', 'ć', 'č', 'ĉ', 'ċ', 'ｃ'],
        'd': ['ď', 'ð', 'đ', 'ƌ', 'ȡ', 'ɖ', 'ɗ', 'ᵭ', 'ᶁ', 'ᶑ', 'д', 'δ', 'د', 'ض', 'ဍ', 'ဒ', 'დ', 'ｄ'],
        'e': ['é', 'è', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ế', 'ề', 'ể', 'ễ', 'ệ', 'ë', 'ē', 'ę', 'ě', 'ĕ', 'ė', 'ε', 'έ', 'ἐ', 'ἑ', 'ἒ', 'ἓ', 'ἔ', 'ἕ', 'ὲ', 'έ', 'е', 'ё', 'э', 'є', 'ə', 'ဧ', 'ေ', 'ဲ', 'ე', 'ए', 'إ', 'ئ', 'ｅ'],
        'f': ['ф', 'φ', 'ف', 'ƒ', 'ფ', 'ｆ'],
        'g': ['ĝ', 'ğ', 'ġ', 'ģ', 'г', 'ґ', 'γ', 'ဂ', 'გ', 'گ', 'ｇ'],
        'h': ['ĥ', 'ħ', 'η', 'ή', 'ح', 'ه', 'ဟ', 'ှ', 'ჰ', 'ｈ'],
        'i': ['í', 'ì', 'ỉ', 'ĩ', 'ị', 'î', 'ï', 'ī', 'ĭ', 'į', 'ı', 'ι', 'ί', 'ϊ', 'ΐ', 'ἰ', 'ἱ', 'ἲ', 'ἳ', 'ἴ', 'ἵ', 'ἶ', 'ἷ', 'ὶ', 'ί', 'ῐ', 'ῑ', 'ῒ', 'ΐ', 'ῖ', 'ῗ', 'і', 'ї', 'и', 'ဣ', 'ိ', 'ီ', 'ည်', 'ǐ', 'ი', 'इ', 'ی', 'ｉ'],
        'j': ['ĵ', 'ј', 'Ј', 'ჯ', 'ج', 'ｊ'],
        'k': ['ķ', 'ĸ', 'к', 'κ', 'Ķ', 'ق', 'ك', 'က', 'კ', 'ქ', 'ک', 'ｋ'],
        'l': ['ł', 'ľ', 'ĺ', 'ļ', 'ŀ', 'л', 'λ', 'ل', 'လ', 'ლ', 'ｌ'],
        'm': ['м', 'μ', 'م', 'မ', 'მ', 'ｍ'],
        'n': ['ñ', 'ń', 'ň', 'ņ', 'ŉ', 'ŋ', 'ν', 'н', 'ن', 'န', 'ნ', 'ｎ'],
        'o': ['ó', 'ò', 'ỏ', 'õ', 'ọ', 'ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ', 'ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ', 'ø', 'ō', 'ő', 'ŏ', 'ο', 'ὀ', 'ὁ', 'ὂ', 'ὃ', 'ὄ', 'ὅ', 'ὸ', 'ό', 'о', 'و', 'θ', 'ို', 'ǒ', 'ǿ', 'º', 'ო', 'ओ', 'ｏ', 'ö'],
        'p': ['п', 'π', 'ပ', 'პ', 'پ', 'ｐ'],
        'q': ['ყ', 'ｑ'],
        'r': ['ŕ', 'ř', 'ŗ', 'р', 'ρ', 'ر', 'რ', 'ｒ'],
        's': ['ś', 'š', 'ş', 'с', 'σ', 'ș', 'ς', 'س', 'ص', 'စ', 'ſ', 'ს', 'ｓ'],
        't': ['ť', 'ţ', 'т', 'τ', 'ț', 'ت', 'ط', 'ဋ', 'တ', 'ŧ', 'თ', 'ტ', 'ｔ'],
        'u': ['ú', 'ù', 'ủ', 'ũ', 'ụ', 'ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự', 'û', 'ū', 'ů', 'ű', 'ŭ', 'ų', 'µ', 'у', 'ဉ', 'ု', 'ူ', 'ǔ', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'უ', 'उ', 'ｕ', 'ў', 'ü'],
        'v': ['в', 'ვ', 'ϐ', 'ｖ'],
        'w': ['ŵ', 'ω', 'ώ', 'ဝ', 'ွ', 'ｗ'],
        'x': ['χ', 'ξ', 'ｘ'],
        'y': ['ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ', 'ÿ', 'ŷ', 'й', 'ы', 'υ', 'ϋ', 'ύ', 'ΰ', 'ي', 'ယ', 'ｙ'],
        'z': ['ź', 'ž', 'ż', 'з', 'ζ', 'ز', 'ဇ', 'ზ', 'ｚ'],
        'aa': ['ع', 'आ', 'آ'],
        'ae': ['æ', 'ǽ'],
        'ai': ['ऐ'],
        'ch': ['ч', 'ჩ', 'ჭ', 'چ'],
        'dj': ['ђ', 'đ'],
        'dz': ['џ', 'ძ'],
        'ei': ['ऍ'],
        'gh': ['غ', 'ღ'],
        'ii': ['ई'],
        'ij': ['ĳ'],
        'kh': ['х', 'خ', 'ხ'],
        'lj': ['љ'],
        'nj': ['њ'],
        'oe': ['ö', 'œ', 'ؤ'],
        'oi': ['ऑ'],
        'oii': ['ऒ'],
        'ps': ['ψ'],
        'sh': ['ш', 'შ', 'ش'],
        'shch': ['щ'],
        'ss': ['ß'],
        'sx': ['ŝ'],
        'th': ['þ', 'ϑ', 'ث', 'ذ', 'ظ'],
        'ts': ['ц', 'ც', 'წ'],
        'ue': ['ü'],
        'uu': ['ऊ'],
        'ya': ['я'],
        'yu': ['ю'],
        'zh': ['ж', 'ჟ', 'ژ'],
        '(c)': ['©'],
        'A': ['Á', 'À', 'Ả', 'Ã', 'Ạ', 'Ă', 'Ắ', 'Ằ', 'Ẳ', 'Ẵ', 'Ặ', 'Â', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ', 'Å', 'Ā', 'Ą', 'Α', 'Ά', 'Ἀ', 'Ἁ', 'Ἂ', 'Ἃ', 'Ἄ', 'Ἅ', 'Ἆ', 'Ἇ', 'ᾈ', 'ᾉ', 'ᾊ', 'ᾋ', 'ᾌ', 'ᾍ', 'ᾎ', 'ᾏ', 'Ᾰ', 'Ᾱ', 'Ὰ', 'Ά', 'ᾼ', 'А', 'Ǻ', 'Ǎ', 'Ａ', 'Ä'],
        'B': ['Б', 'Β', 'ब', 'Ｂ'],
        'C': ['Ç', 'Ć', 'Č', 'Ĉ', 'Ċ', 'Ｃ'],
        'D': ['Ď', 'Ð', 'Đ', 'Ɖ', 'Ɗ', 'Ƌ', 'ᴅ', 'ᴆ', 'Д', 'Δ', 'Ｄ'],
        'E': ['É', 'È', 'Ẻ', 'Ẽ', 'Ẹ', 'Ê', 'Ế', 'Ề', 'Ể', 'Ễ', 'Ệ', 'Ë', 'Ē', 'Ę', 'Ě', 'Ĕ', 'Ė', 'Ε', 'Έ', 'Ἐ', 'Ἑ', 'Ἒ', 'Ἓ', 'Ἔ', 'Ἕ', 'Έ', 'Ὲ', 'Е', 'Ё', 'Э', 'Є', 'Ə', 'Ｅ'],
        'F': ['Ф', 'Φ', 'Ｆ'],
        'G': ['Ğ', 'Ġ', 'Ģ', 'Г', 'Ґ', 'Γ', 'Ｇ'],
        'H': ['Η', 'Ή', 'Ħ', 'Ｈ'],
        'I': ['Í', 'Ì', 'Ỉ', 'Ĩ', 'Ị', 'Î', 'Ï', 'Ī', 'Ĭ', 'Į', 'İ', 'Ι', 'Ί', 'Ϊ', 'Ἰ', 'Ἱ', 'Ἳ', 'Ἴ', 'Ἵ', 'Ἶ', 'Ἷ', 'Ῐ', 'Ῑ', 'Ὶ', 'Ί', 'И', 'І', 'Ї', 'Ǐ', 'ϒ', 'Ｉ'],
        'J': ['Ｊ'],
        'K': ['К', 'Κ', 'Ｋ'],
        'L': ['Ĺ', 'Ł', 'Л', 'Λ', 'Ļ', 'Ľ', 'Ŀ', 'ल', 'Ｌ'],
        'M': ['М', 'Μ', 'Ｍ'],
        'N': ['Ń', 'Ñ', 'Ň', 'Ņ', 'Ŋ', 'Н', 'Ν', 'Ｎ'],
        'O': ['Ó', 'Ò', 'Ỏ', 'Õ', 'Ọ', 'Ô', 'Ố', 'Ồ', 'Ổ', 'Ỗ', 'Ộ', 'Ơ', 'Ớ', 'Ờ', 'Ở', 'Ỡ', 'Ợ', 'Ø', 'Ō', 'Ő', 'Ŏ', 'Ο', 'Ό', 'Ὀ', 'Ὁ', 'Ὂ', 'Ὃ', 'Ὄ', 'Ὅ', 'Ὸ', 'Ό', 'О', 'Θ', 'Ө', 'Ǒ', 'Ǿ', 'Ｏ', 'Ö'],
        'P': ['П', 'Π', 'Ｐ'],
        'Q': ['Ｑ'],
        'R': ['Ř', 'Ŕ', 'Р', 'Ρ', 'Ŗ', 'Ｒ'],
        'S': ['Ş', 'Ŝ', 'Ș', 'Š', 'Ś', 'С', 'Σ', 'Ｓ'],
        'T': ['Ť', 'Ţ', 'Ŧ', 'Ț', 'Т', 'Τ', 'Ｔ'],
        'U': ['Ú', 'Ù', 'Ủ', 'Ũ', 'Ụ', 'Ư', 'Ứ', 'Ừ', 'Ử', 'Ữ', 'Ự', 'Û', 'Ū', 'Ů', 'Ű', 'Ŭ', 'Ų', 'У', 'Ǔ', 'Ǖ', 'Ǘ', 'Ǚ', 'Ǜ', 'Ｕ', 'Ў', 'Ü'],
        'V': ['В', 'Ｖ'],
        'W': ['Ω', 'Ώ', 'Ŵ', 'Ｗ'],
        'X': ['Χ', 'Ξ', 'Ｘ'],
        'Y': ['Ý', 'Ỳ', 'Ỷ', 'Ỹ', 'Ỵ', 'Ÿ', 'Ῠ', 'Ῡ', 'Ὺ', 'Ύ', 'Ы', 'Й', 'Υ', 'Ϋ', 'Ŷ', 'Ｙ'],
        'Z': ['Ź', 'Ž', 'Ż', 'З', 'Ζ', 'Ｚ'],
        'AE': ['Æ', 'Ǽ'],
        'Ch': ['Ч'],
        'Dj': ['Ђ'],
        'Dz': ['Џ'],
        'Gx': ['Ĝ'],
        'Hx': ['Ĥ'],
        'Ij': ['Ĳ'],
        'Jx': ['Ĵ'],
        'Kh': ['Х'],
        'Lj': ['Љ'],
        'Nj': ['Њ'],
        'Oe': ['Œ'],
        'Ps': ['Ψ'],
        'Sh': ['Ш'],
        'Shch': ['Щ'],
        'Ss': ['ẞ'],
        'Th': ['Þ'],
        'Ts': ['Ц'],
        'Ya': ['Я'],
        'Yu': ['Ю'],
        'Zh': ['Ж'],
    };

    Object.keys(swaps).forEach((swap) => {
        swaps[swap].forEach(s => {
            str = str.replace(new RegExp(s, "g"), swap);
        })
    });
    return str
        .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
        .replace(/\s+/g, "-") // collapse whitespace and replace by -
        .replace(/-+/g, "-") // collapse dashes
        .replace(/^-+/, "") // trim - from start of text
        .replace(/-+$/, "");
};
let mergeDicts = (a, b) => { return Object.assign({}, a, b); }
let fileMayRead = (p) => {
    try {
        fs.accessSync(p, fs.constants.R_OK);
        return true;
    } catch (e) {
        return false;
    }
}

let mimeMap = {
    "7z": "application/x-7z-compressed",
    "a": "application/octet-stream",
    "asc": "application/pgp-signature",
    "atom": "application/atom+xml",
    "avi": "application/x-troff-msvideo",
    "bas": "text/plain",
    "c": "text/plain",
    "c++": "text/plain",
    "cc": "text/plain",
    "com": "application/octet-stream",
    "conf": "text/plain",
    "cpp": "text/x-c",
    "cxx": "text/plain",
    "def": "text/plain",
    "dic": "text/x-c",
    "dif": "video/x-dv",
    "diff": "text/plain",
    "doc": "application/msword",
    "docx": "application/vndopenxmlformats-officedocumentwordprocessingmldocument",
    "dp": "application/commonground",
    "el": "text/plain",
    "epub": "application/epub+zip",
    "ext": "application/vndnovadigmEXT",
    "f": "text/plain",
    "f90": "text/plain",
    "flv": "video/x-flv",
    "for": "text/plain",
    "g": "text/plain",
    "gv": "text/vndgraphviz",
    "gz": "application/octet-stream",
    "h": "text/plain",
    "h++": "text/x-c++hdr",
    "hh": "text/plain",
    "hpp": "text/x-c++hdr",
    "hxx": "text/x-c++hdr",
    "idc": "text/plain",
    "in": "text/plain",
    "ip": "application/x-ip2",
    "jar": "application/java-archive",
    "jav": "text/plain",
    "java": "text/plain",
    "js": "application/javascript",
    "css": "text/css",
    "key": "application/pgp-keys",
    "ksh": "application/x-ksh",
    "la": "audio/nspaudio",
    "list": "text/plain",
    "log": "text/plain",
    "lst": "text/plain",
    "m": "text/plain",
    "ma": "application/mathematica",
    "mar": "application/octet-stream",
    "mkv": "video/x-matroska",
    "moov": "video/quicktime",
    "mov": "video/quicktime",
    "mp4": "application/mp4",
    "mp4v": "video/mp4",
    "mpg": "audio/mpeg",
    "mpg4": "video/mp4",
    "o": "application/octet-stream",
    "odp": "application/vndoasisopendocumentpresentation",
    "odt": "application/vndoasisopendocumenttext",
    "ogg": "application/ogg",
    "ogv": "video/ogg",
    "ogx": "application/ogg",
    "otp": "application/vndoasisopendocumentpresentation-template",
    "p": "text/x-pascal",
    "pdf": "application/pdf",
    "pgp": "application/pgp-encrypted",
    "pl": "text/plain",
    "pot": "application/mspowerpoint",
    "pub": "application/x-mspublisher",
    "py": "text/x-python",
    "pyc": "application/x-bytecodepython",
    "qt": "video/quicktime",
    "rt": "text/richtext",
    "rtf": "application/rtf",
    "s": "text/x-asm",
    "sc": "application/vndibmsecure-container",
    "sdml": "text/plain",
    "sh": "application/x-bsh",
    "si": "text/vndwapsi",
    "sig": "application/pgp-signature",
    "sql": "text/plain",
    "st": "application/vndsailingtrackertrack",
    "t": "application/x-troff",
    "tar": "application/x-tar",
    "tex": "application/x-tex",
    "text": "application/plain",
    "tgz": "application/gnutar",
    "txt": "text/plain",
    "wav": "audio/wav",
    "xl": "application/excel",
    "xla": "application/excel",
    "xlb": "application/excel",
    "xlc": "application/excel",
    "xll": "application/excel",
    "xlm": "application/excel",
    "xls": "application/excel",
    "xlt": "application/excel",
    "xlw": "application/excel",
    "xm": "audio/xm",
    "xml": "application/atom+xml",
    "z": "application/x-compress",
    "zip": "application/octet-stream",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "gif": "image/gif",
    "png": "image/png",
    "svg": "image/svg+xml"
}
var mimeGuess = (p) => {
    const ext = p.split('.').slice(-1)[0];
    if(mimeMap.hasOwnProperty(ext))
        return mimeMap[ext];
    return 'text/plain';
}


const cleanLinesRe = /^\s*/gm;
const headersRe = /(#+)(.*)/gmi;
const imagesRe = /!\[([^[]+)\]\(([^)]+)\)/gmi;
const linksRe = /\[([^[]+)\]\(([^)]+)\)/gmi;
const boldRe = /(\*\*|__)(.*?)\1/gmi;
const emphasisRe = /(\*|_)(.*?)\1/gmi;
const delRe = /~~(.*?)~~/gmi;
const quoteRe = /:"(.*?)":/gmi;
const blockCodeRe = /```([^```]+)```/gmi;
const inlineCodeRe = /`([^`]+)`/gmi;
const ulListsRe = /\*+(.*)?/gmi;
const olListsRe = /[0-9]+\.(.*)/gmi;
const hrRe = /\n-{5,}/gmi;
const blockQuoteRe = /\n(&gt;|>)(.*)/gmi;
const paragraphsRe = /\n([^\n]+)\n/gmi;
const paragraphsIgnoreRe = /^<\/?(ul|ol|li|h|p|bl|code|table|tr|td)/i;
const fixUlRe = /<\/ul>\s?<ul>/gmi;
const fixOlRe = /<\/ol>\s<ol>/gmi;
const fixBlockQuoteRe = /<\/blockquote>\s?<blockquote>/gmi;

const rules = {
    cleanLines: {
        regex: cleanLinesRe,
        replacer: function(){
            return '';
        }
    },
    headers: {
        regex: headersRe,
        replacer: function(match, $1, $2){
            const h = $1.trim().length;
            return `<h${h}>${$2.trim()}</h${h}>`;
        }
    },
    images: {
        regex: imagesRe,
        replacer: function(match, $1, $2){
            return `<img src="${$2}" alt="${$1}">`;
        }
    },
    links: {
        regex: linksRe,
        replacer: function(match, $1, $2){
            return `<a href="${$2}">${$1}</a>`;
        }
    },
    bold: {
        regex: boldRe,
        replacer: function(match, $1, $2){
            return `<strong>${$2}</strong>`;
        }
    },
    emphasis: {
        regex: emphasisRe,
        replacer: function(match, $1, $2){
            return `<em>${$2}</em>`;
        }
    },
    del: {
        regex: delRe,
        replacer: function(match, $1, $2){
            return `<del>${$1}</del>`;
        }
    },
    quote: {
        regex: quoteRe,
        replacer: function(match, $1, $2){
            return `<q>${$1}</q>`;
        }
    },
    blockCode: {
        regex: blockCodeRe,
        replacer: function(match, $1, $2){
            return `<pre><code>${$1}</code></pre>`;
        }
    },
    inlineCode: {
        regex: inlineCodeRe,
        replacer: function(match, $1, $2){
            return `<code>${$1}</code>`;
        }
    },
    ulLists: {
        regex: ulListsRe,
        replacer: function(match, $1, $2){
            return `<ul><li>${$1.trim()}</li></ul>`;
        }
    },
    olLists: {
        regex: olListsRe,
        replacer: function(match, $1, $2){
            return `<ol><li>${$1.trim()}</li></ol>`;
        }
    },
    hr: {
        regex: hrRe,
        replacer: function(){
            return '<hr />';
        }
    },
    blockQuote: {
        regex: blockQuoteRe,
        replacer: function($match, $1, $2){
            return `\n<blockquote>${$2}</blockquote>`;
        }
    },
    paragraphs: {
        regex: paragraphsRe,
        replacer: function($match, $1){
            let trimmed = $1.trim();
            if(paragraphsIgnoreRe.test(trimmed)){
                return `\n${trimmed}\n`;
            }
            return `\n<p>${trimmed}</p>\n`;
        }
    },
    fixUl: {
        regex: fixUlRe,
        replacer: function($match, $1){
            return '';
        }
    },
    fixOl: {
        regex: fixOlRe,
        replacer: function($match, $1){
            return '';
        }
    },
    fixBlockquote: {
        regex: fixBlockQuoteRe,
        replacer: function($match, $1){
            return '';
        }
    }
};

function to_html2(markdown){
    Object.keys(rules).forEach((key) => {
        markdown = replace(rules[key].regex, rules[key].replacer);
    });
    return trim();
};

function to_html(src) {
    var rx_lt = /</g;
    var rx_gt = />/g;
    var rx_space = /\t|\r|\uf8ff/g;
    var rx_escape = /\\([\\\|`*_{}\[\]()#+\-~])/g;
    var rx_hr = /^([*\-=_] *){3,}$/gm;
    var rx_blockquote = /\n *&gt; *([\S\s]*?)(?=(\n|$){2})/g;
    var rx_list = /\n( *)(?:[*\-+]|((\d+)|([a-z])|[A-Z])[.)]) +([\S\s]*?)(?=(\n|$){2})/g;
    var rx_listjoin = /<\/(ol|ul)>\n\n<\1>/g;
    var rx_highlight = /(^|[^A-Za-z\d\\])(([*_])|(~)|(\^)|(--)|(\+\+)|`)(\2?)([^<]*?)\2\8(?!\2)(?=\W|_|$)/g;
    var rx_code = /\n((```|~~~).*\n?([\S\s]*?)\n?\2|((    .*?\n)+))/g;
    var rx_link = /((!?)\[(.*?)\]\((.*?)( ".*")?\)|\\([\\`*_{}\[\]()#+\-.!~]))/g;
    var rx_table = /\n(( *\|.*?\| *\n)+)/g;
    var rx_thead = /^.*\n( *\|( *\:?-+\:?-+\:? *\|)* *\n|)/;
    var rx_row = /.*\n/g;
    var rx_cell = /\||(.*?[^\\])\|/g;
    var rx_heading = /(?=^|>|\n)([>\s]*?)(#{1,6}) (.*?)( #*)? *(?=\n|$)/g;
    var rx_para = /(?=^|>|\n)\s*\n+([^<]+?)\n+\s*(?=\n|<|$)/g;
    var rx_stash = /-\d+\uf8ff/g;

    function replace(rex, fn) {
//        src = src.replace(rex, fn);
        try {
            src = src.replace(rex, fn);
        } catch(err) {
            return '';
        }
    }

    function element(tag, content, attrs) {
        let val = '<' + tag;
        if(attrs !== undefined) {
            for (var key in attrs) {
                if (attrs.hasOwnProperty(key)) {
                    val += ` ${key}="${attrs[key]}"`;
                }
            }
        }

        val += '>' + content + '</' + tag + '>';
        return val;
    }

    function blockquote(src) {
        return src.replace(rx_blockquote, function(all, content) {
            return element('blockquote', blockquote(highlight(content.replace(/^ *&gt; */gm, ''))));
        });
    }

    function list(src) {
        return src.replace(rx_list, function(all, ind, ol, num, low, content) {
            var entry = element('li', highlight(content.split(
                RegExp('\n ?' + ind + '(?:(?:\\d+|[a-zA-Z])[.)]|[*\\-+]) +', 'g')).map(list).join('</li><li>')));

            return '\n' + (ol
                ? '<ol start="' + (num
                    ? ol + '">'
                    : parseInt(ol,36) - 9 + '" style="list-style-type:' + (low ? 'low' : 'upp') + 'er-alpha">') + entry + '</ol>'
                : element('ul', entry));
        });
    }

    function highlight(src) {
        return src.replace(rx_highlight, function(all, _, p1, emp, sub, sup, small, big, p2, content) {
            return _ + element(
                  emp ? (p2 ? 'strong' : 'em')
                : sub ? (p2 ? 's' : 'sub')
                : sup ? 'sup'
                : small ? 'small'
                : big ? 'big'
                : 'code',
                highlight(content));
        });
    }

    function unesc(str) {
        return str.replace(rx_escape, '$1');
    }

    var stash = [];
    var si = 0;

    src = '\n' + src + '\n';

    replace(rx_lt, '&lt;');
    replace(rx_gt, '&gt;');
    replace(rx_space, '  ');

    // blockquote
    src = blockquote(src);

    // horizontal rule
    replace(rx_hr, '<hr/>');

    // list
    src = list(src);
    replace(rx_listjoin, '');

    // code
    replace(rx_code, function(all, p1, p2, p3, p4) {
        let line = all.trim();
        let cls = "";

        let v_regexp = /^\`\`\`(\w+)$/gm
        let match = v_regexp.exec(line);
        if(match)
            cls = `language-${match[1].trim()}`;

        stash[--si] = element('pre', element('code', p3||p4.replace(/^    /gm, ''), {'class': cls}));
        return si + '\uf8ff';  // ???
    });

    // link or image
    replace(rx_link, function(all, p1, p2, p3, p4, p5, p6) {
        stash[--si] = p4
            ? p2
                ? '<img src="' + p4 + '" alt="' + p3 + '"/>'
                : '<a href="' + p4 + '">' + unesc(highlight(p3)) + '</a>'
            : p6;
        return si + '\uf8ff';
    });

    // table
    replace(rx_table, function(all, table) {
        var sep = table.match(rx_thead)[1];
        return '\n' + element('table',
            table.replace(rx_row, function(row, ri) {
                return row == sep ? '' : element('tr', row.replace(rx_cell, function(all, cell, ci) {
                    return ci ? element(sep && !ri ? 'th' : 'td', unesc(highlight(cell || ''))) : ''
                }))
            })
        )
    });

    // heading
    replace(rx_heading, function(all, _, p1, p2) { return _ + element('h' + p1.length, unesc(highlight(p2))) });

    // paragraph
    replace(rx_para, function(all, content) { return element('p', unesc(highlight(content))) });

    // stash
    replace(rx_stash, function(all) { return stash[parseInt(all)] });

    return src.trim();
}

/**
 * @version 0.4.2
 * https://github.com/aishikaty/tiny-mustache
 * */
function mustache(template, self, parent, invert) {
  let render = mustache
  var output = ""
  var i

  function get (ctx, path) {
    path = path.pop ? path : path.split(".")
    ctx = ctx[path.shift()]
    ctx = ctx != null ? ctx : ""
    return (0 in path) ? get(ctx, path) : ctx
  }

  self = Array.isArray(self) ? self : (self ? [self] : [])
  self = invert ? (0 in self) ? [] : [1] : self

  for (i = 0; i < self.length; i++) {
    var childCode = ''
    var depth = 0
    var inverted
    var ctx = (typeof self[i] == "object") ? self[i] : {}
    ctx = Object.assign({}, parent, ctx)
    ctx[""] = {"": self[i]}

    template.replace(/([\s\S]*?)({{((\/)|(\^)|#)(.*?)}}|$)/g,
        function(match, code, y, z, close, invert, name) {
          if (!depth) {
            output += code.replace(/{{{(.*?)}}}|{{(!?)(&?)(>?)(.*?)}}/g,
                function(match, raw, comment, isRaw, partial, name) {
                  return raw ? get(ctx, raw)
                      : isRaw ? get(ctx, name)
                          : partial ? render(get(ctx, name), ctx)
                              : !comment ? get(ctx, name)
                                  : ""
                }
            )
            inverted = invert
          } else {
            childCode += depth && !close || depth > 1 ? match : code
          }
          if (close) {
            if (!--depth) {
              name = get(ctx, name)
              if (/^f/.test(typeof name)) {
                output += name.call(ctx, childCode, function (template) {
                  return render(template, ctx)
                })
              } else {
                output += render(childCode, name, ctx, inverted)
              }
              childCode = ""
            }
          } else {
            ++depth
          }
        }
    )
  }
  return output
}

// This file contains the PrismJS client-side highlighter,
// b64 encoded so that it is easier to bundle.

// replace built-in atob()/btoa() for the unicode awareness via Buffer();
atob = (b64) => { return Buffer.from(b64, 'base64').toString('utf8'); };
btoa = (p) => { return Buffer.from(p, 'binary').toString('base64'); };


// prismjs 1.13.0 - syntax highlight
let js_prism = `
Ly8gcHJpc21qcyAxLjEzLjAKCnZhciBfc2VsZj0idW5kZWZpbmVkIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6InVuZGVmaW5lZCIhPXR5cGVvZiBXb3JrZXJHbG9iYWxTY29wZSYmc2VsZiBpbnN0YW5jZW9mIFdvcmtlckdsb2JhbFNjb3BlP3NlbGY6e30sUHJpc209ZnVuY3Rpb24oKXt2YXIgbz0vXGJsYW5nKD86dWFnZSk/LShcdyspXGIvaSx0PTAsTz1fc2VsZi5QcmlzbT17bWFudWFsOl9zZWxmLlByaXNtJiZfc2VsZi5QcmlzbS5tYW51YWwsZGlzYWJsZVdvcmtlck1lc3NhZ2VIYW5kbGVyOl9zZWxmLlByaXNtJiZfc2VsZi5QcmlzbS5kaXNhYmxlV29ya2VyTWVzc2FnZUhhbmRsZXIsdXRpbDp7ZW5jb2RlOmZ1bmN0aW9uKGUpe3JldHVybiBlIGluc3RhbmNlb2Ygcz9uZXcgcyhlLnR5cGUsTy51dGlsLmVuY29kZShlLmNvbnRlbnQpLGUuYWxpYXMpOiJBcnJheSI9PT1PLnV0aWwudHlwZShlKT9lLm1hcChPLnV0aWwuZW5jb2RlKTplLnJlcGxhY2UoLyYvZywiJmFtcDsiKS5yZXBsYWNlKC88L2csIiZsdDsiKS5yZXBsYWNlKC9cdTAwYTAvZywiICIpfSx0eXBlOmZ1bmN0aW9uKGUpe3JldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSkubWF0Y2goL1xbb2JqZWN0IChcdyspXF0vKVsxXX0sb2JqSWQ6ZnVuY3Rpb24oZSl7cmV0dXJuIGUuX19pZHx8T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsIl9faWQiLHt2YWx1ZTorK3R9KSxlLl9faWR9LGNsb25lOmZ1bmN0aW9uKGUsYSl7dmFyIHQ9Ty51dGlsLnR5cGUoZSk7c3dpdGNoKGE9YXx8e30sdCl7Y2FzZSJPYmplY3QiOmlmKGFbTy51dGlsLm9iaklkKGUpXSlyZXR1cm4gYVtPLnV0aWwub2JqSWQoZSldO3ZhciBuPXt9O2Zvcih2YXIgciBpbiBhW08udXRpbC5vYmpJZChlKV09bixlKWUuaGFzT3duUHJvcGVydHkocikmJihuW3JdPU8udXRpbC5jbG9uZShlW3JdLGEpKTtyZXR1cm4gbjtjYXNlIkFycmF5IjppZihhW08udXRpbC5vYmpJZChlKV0pcmV0dXJuIGFbTy51dGlsLm9iaklkKGUpXTtuPVtdO3JldHVybiBhW08udXRpbC5vYmpJZChlKV09bixlLmZvckVhY2goZnVuY3Rpb24oZSx0KXtuW3RdPU8udXRpbC5jbG9uZShlLGEpfSksbn1yZXR1cm4gZX19LGxhbmd1YWdlczp7ZXh0ZW5kOmZ1bmN0aW9uKGUsdCl7dmFyIGE9Ty51dGlsLmNsb25lKE8ubGFuZ3VhZ2VzW2VdKTtmb3IodmFyIG4gaW4gdClhW25dPXRbbl07cmV0dXJuIGF9LGluc2VydEJlZm9yZTpmdW5jdGlvbihhLGUsdCxuKXt2YXIgcj0obj1ufHxPLmxhbmd1YWdlcylbYV07aWYoMj09YXJndW1lbnRzLmxlbmd0aCl7Zm9yKHZhciBpIGluIHQ9ZSl0Lmhhc093blByb3BlcnR5KGkpJiYocltpXT10W2ldKTtyZXR1cm4gcn12YXIgcz17fTtmb3IodmFyIGwgaW4gcilpZihyLmhhc093blByb3BlcnR5KGwpKXtpZihsPT1lKWZvcih2YXIgaSBpbiB0KXQuaGFzT3duUHJvcGVydHkoaSkmJihzW2ldPXRbaV0pO3NbbF09cltsXX1yZXR1cm4gTy5sYW5ndWFnZXMuREZTKE8ubGFuZ3VhZ2VzLGZ1bmN0aW9uKGUsdCl7dD09PW5bYV0mJmUhPWEmJih0aGlzW2VdPXMpfSksblthXT1zfSxERlM6ZnVuY3Rpb24oZSx0LGEsbil7Zm9yKHZhciByIGluIG49bnx8e30sZSllLmhhc093blByb3BlcnR5KHIpJiYodC5jYWxsKGUscixlW3JdLGF8fHIpLCJPYmplY3QiIT09Ty51dGlsLnR5cGUoZVtyXSl8fG5bTy51dGlsLm9iaklkKGVbcl0pXT8iQXJyYXkiIT09Ty51dGlsLnR5cGUoZVtyXSl8fG5bTy51dGlsLm9iaklkKGVbcl0pXXx8KG5bTy51dGlsLm9iaklkKGVbcl0pXT0hMCxPLmxhbmd1YWdlcy5ERlMoZVtyXSx0LHIsbikpOihuW08udXRpbC5vYmpJZChlW3JdKV09ITAsTy5sYW5ndWFnZXMuREZTKGVbcl0sdCxudWxsLG4pKSl9fSxwbHVnaW5zOnt9LGhpZ2hsaWdodEFsbDpmdW5jdGlvbihlLHQpe08uaGlnaGxpZ2h0QWxsVW5kZXIoZG9jdW1lbnQsZSx0KX0saGlnaGxpZ2h0QWxsVW5kZXI6ZnVuY3Rpb24oZSx0LGEpe3ZhciBuPXtjYWxsYmFjazphLHNlbGVjdG9yOidjb2RlW2NsYXNzKj0ibGFuZ3VhZ2UtIl0sIFtjbGFzcyo9Imxhbmd1YWdlLSJdIGNvZGUsIGNvZGVbY2xhc3MqPSJsYW5nLSJdLCBbY2xhc3MqPSJsYW5nLSJdIGNvZGUnfTtPLmhvb2tzLnJ1bigiYmVmb3JlLWhpZ2hsaWdodGFsbCIsbik7Zm9yKHZhciByLGk9bi5lbGVtZW50c3x8ZS5xdWVyeVNlbGVjdG9yQWxsKG4uc2VsZWN0b3IpLHM9MDtyPWlbcysrXTspTy5oaWdobGlnaHRFbGVtZW50KHIsITA9PT10LG4uY2FsbGJhY2spfSxoaWdobGlnaHRFbGVtZW50OmZ1bmN0aW9uKGUsdCxhKXtmb3IodmFyIG4scixpPWU7aSYmIW8udGVzdChpLmNsYXNzTmFtZSk7KWk9aS5wYXJlbnROb2RlO2kmJihuPShpLmNsYXNzTmFtZS5tYXRjaChvKXx8WywiIl0pWzFdLnRvTG93ZXJDYXNlKCkscj1PLmxhbmd1YWdlc1tuXSksZS5jbGFzc05hbWU9ZS5jbGFzc05hbWUucmVwbGFjZShvLCIiKS5yZXBsYWNlKC9ccysvZywiICIpKyIgbGFuZ3VhZ2UtIituLGUucGFyZW50Tm9kZSYmKGk9ZS5wYXJlbnROb2RlLC9wcmUvaS50ZXN0KGkubm9kZU5hbWUpJiYoaS5jbGFzc05hbWU9aS5jbGFzc05hbWUucmVwbGFjZShvLCIiKS5yZXBsYWNlKC9ccysvZywiICIpKyIgbGFuZ3VhZ2UtIituKSk7dmFyIHM9e2VsZW1lbnQ6ZSxsYW5ndWFnZTpuLGdyYW1tYXI6cixjb2RlOmUudGV4dENvbnRlbnR9O2lmKE8uaG9va3MucnVuKCJiZWZvcmUtc2FuaXR5LWNoZWNrIixzKSwhcy5jb2RlfHwhcy5ncmFtbWFyKXJldHVybiBzLmNvZGUmJihPLmhvb2tzLnJ1bigiYmVmb3JlLWhpZ2hsaWdodCIscykscy5lbGVtZW50LnRleHRDb250ZW50PXMuY29kZSxPLmhvb2tzLnJ1bigiYWZ0ZXItaGlnaGxpZ2h0IixzKSksdm9pZCBPLmhvb2tzLnJ1bigiY29tcGxldGUiLHMpO2lmKE8uaG9va3MucnVuKCJiZWZvcmUtaGlnaGxpZ2h0IixzKSx0JiZfc2VsZi5Xb3JrZXIpe3ZhciBsPW5ldyBXb3JrZXIoTy5maWxlbmFtZSk7bC5vbm1lc3NhZ2U9ZnVuY3Rpb24oZSl7cy5oaWdobGlnaHRlZENvZGU9ZS5kYXRhLE8uaG9va3MucnVuKCJiZWZvcmUtaW5zZXJ0IixzKSxzLmVsZW1lbnQuaW5uZXJIVE1MPXMuaGlnaGxpZ2h0ZWRDb2RlLGEmJmEuY2FsbChzLmVsZW1lbnQpLE8uaG9va3MucnVuKCJhZnRlci1oaWdobGlnaHQiLHMpLE8uaG9va3MucnVuKCJjb21wbGV0ZSIscyl9LGwucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoe2xhbmd1YWdlOnMubGFuZ3VhZ2UsY29kZTpzLmNvZGUsaW1tZWRpYXRlQ2xvc2U6ITB9KSl9ZWxzZSBzLmhpZ2hsaWdodGVkQ29kZT1PLmhpZ2hsaWdodChzLmNvZGUscy5ncmFtbWFyLHMubGFuZ3VhZ2UpLE8uaG9va3MucnVuKCJiZWZvcmUtaW5zZXJ0IixzKSxzLmVsZW1lbnQuaW5uZXJIVE1MPXMuaGlnaGxpZ2h0ZWRDb2RlLGEmJmEuY2FsbChlKSxPLmhvb2tzLnJ1bigiYWZ0ZXItaGlnaGxpZ2h0IixzKSxPLmhvb2tzLnJ1bigiY29tcGxldGUiLHMpfSxoaWdobGlnaHQ6ZnVuY3Rpb24oZSx0LGEpe3ZhciBuPXt0ZXh0OmUsZ3JhbW1hcjp0LGxhbmd1YWdlOmF9O3JldHVybiBuLnRva2Vucz1PLnRva2VuaXplKGUsdCksTy5ob29rcy5ydW4oImFmdGVyLXRva2VuaXplIixuKSxzLnN0cmluZ2lmeShPLnV0aWwuZW5jb2RlKG4udG9rZW5zKSxhKX0sbWF0Y2hHcmFtbWFyOmZ1bmN0aW9uKGUsdCxhLG4scixpLHMpe3ZhciBsPU8uVG9rZW47Zm9yKHZhciBvIGluIGEpaWYoYS5oYXNPd25Qcm9wZXJ0eShvKSYmYVtvXSl7aWYobz09cylyZXR1cm47dmFyIHU9YVtvXTt1PSJBcnJheSI9PT1PLnV0aWwudHlwZSh1KT91Olt1XTtmb3IodmFyIGc9MDtnPHUubGVuZ3RoOysrZyl7dmFyIGM9dVtnXSxkPWMuaW5zaWRlLHA9ISFjLmxvb2tiZWhpbmQsbT0hIWMuZ3JlZWR5LGg9MCxmPWMuYWxpYXM7aWYobSYmIWMucGF0dGVybi5nbG9iYWwpe3ZhciB5PWMucGF0dGVybi50b1N0cmluZygpLm1hdGNoKC9baW11eV0qJC8pWzBdO2MucGF0dGVybj1SZWdFeHAoYy5wYXR0ZXJuLnNvdXJjZSx5KyJnIil9Yz1jLnBhdHRlcm58fGM7Zm9yKHZhciBiPW4saz1yO2I8dC5sZW5ndGg7ays9dFtiXS5sZW5ndGgsKytiKXt2YXIgdj10W2JdO2lmKHQubGVuZ3RoPmUubGVuZ3RoKXJldHVybjtpZighKHYgaW5zdGFuY2VvZiBsKSl7Yy5sYXN0SW5kZXg9MDt2YXIgUD0xO2lmKCEoaj1jLmV4ZWModikpJiZtJiZiIT10Lmxlbmd0aC0xKXtpZihjLmxhc3RJbmRleD1rLCEoaj1jLmV4ZWMoZSkpKWJyZWFrO2Zvcih2YXIgdz1qLmluZGV4KyhwP2pbMV0ubGVuZ3RoOjApLHg9ai5pbmRleCtqWzBdLmxlbmd0aCxGPWIsUz1rLEE9dC5sZW5ndGg7RjxBJiYoUzx4fHwhdFtGXS50eXBlJiYhdFtGLTFdLmdyZWVkeSk7KytGKShTKz10W0ZdLmxlbmd0aCk8PXcmJigrK2Isaz1TKTtpZih0W2JdaW5zdGFuY2VvZiBsfHx0W0YtMV0uZ3JlZWR5KWNvbnRpbnVlO1A9Ri1iLHY9ZS5zbGljZShrLFMpLGouaW5kZXgtPWt9aWYoail7cCYmKGg9alsxXT9qWzFdLmxlbmd0aDowKTt4PSh3PWouaW5kZXgraCkrKGo9alswXS5zbGljZShoKSkubGVuZ3RoO3ZhciBqLF89di5zbGljZSgwLHcpLEM9di5zbGljZSh4KSxOPVtiLFBdO18mJigrK2Isays9Xy5sZW5ndGgsTi5wdXNoKF8pKTt2YXIgRT1uZXcgbChvLGQ/Ty50b2tlbml6ZShqLGQpOmosZixqLG0pO2lmKE4ucHVzaChFKSxDJiZOLnB1c2goQyksQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseSh0LE4pLDEhPVAmJk8ubWF0Y2hHcmFtbWFyKGUsdCxhLGIsaywhMCxvKSxpKWJyZWFrfWVsc2UgaWYoaSlicmVha319fX19LHRva2VuaXplOmZ1bmN0aW9uKGUsdCxhKXt2YXIgbj1bZV0scj10LnJlc3Q7aWYocil7Zm9yKHZhciBpIGluIHIpdFtpXT1yW2ldO2RlbGV0ZSB0LnJlc3R9cmV0dXJuIE8ubWF0Y2hHcmFtbWFyKGUsbix0LDAsMCwhMSksbn0saG9va3M6e2FsbDp7fSxhZGQ6ZnVuY3Rpb24oZSx0KXt2YXIgYT1PLmhvb2tzLmFsbDthW2VdPWFbZV18fFtdLGFbZV0ucHVzaCh0KX0scnVuOmZ1bmN0aW9uKGUsdCl7dmFyIGE9Ty5ob29rcy5hbGxbZV07aWYoYSYmYS5sZW5ndGgpZm9yKHZhciBuLHI9MDtuPWFbcisrXTspbih0KX19fSxzPU8uVG9rZW49ZnVuY3Rpb24oZSx0LGEsbixyKXt0aGlzLnR5cGU9ZSx0aGlzLmNvbnRlbnQ9dCx0aGlzLmFsaWFzPWEsdGhpcy5sZW5ndGg9MHwobnx8IiIpLmxlbmd0aCx0aGlzLmdyZWVkeT0hIXJ9O2lmKHMuc3RyaW5naWZ5PWZ1bmN0aW9uKHQsYSxlKXtpZigic3RyaW5nIj09dHlwZW9mIHQpcmV0dXJuIHQ7aWYoIkFycmF5Ij09PU8udXRpbC50eXBlKHQpKXJldHVybiB0Lm1hcChmdW5jdGlvbihlKXtyZXR1cm4gcy5zdHJpbmdpZnkoZSxhLHQpfSkuam9pbigiIik7dmFyIG49e3R5cGU6dC50eXBlLGNvbnRlbnQ6cy5zdHJpbmdpZnkodC5jb250ZW50LGEsZSksdGFnOiJzcGFuIixjbGFzc2VzOlsidG9rZW4iLHQudHlwZV0sYXR0cmlidXRlczp7fSxsYW5ndWFnZTphLHBhcmVudDplfTtpZih0LmFsaWFzKXt2YXIgcj0iQXJyYXkiPT09Ty51dGlsLnR5cGUodC5hbGlhcyk/dC5hbGlhczpbdC5hbGlhc107QXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkobi5jbGFzc2VzLHIpfU8uaG9va3MucnVuKCJ3cmFwIixuKTt2YXIgaT1PYmplY3Qua2V5cyhuLmF0dHJpYnV0ZXMpLm1hcChmdW5jdGlvbihlKXtyZXR1cm4gZSsnPSInKyhuLmF0dHJpYnV0ZXNbZV18fCIiKS5yZXBsYWNlKC8iL2csIiZxdW90OyIpKyciJ30pLmpvaW4oIiAiKTtyZXR1cm4iPCIrbi50YWcrJyBjbGFzcz0iJytuLmNsYXNzZXMuam9pbigiICIpKyciJysoaT8iICIraToiIikrIj4iK24uY29udGVudCsiPC8iK24udGFnKyI+In0sIV9zZWxmLmRvY3VtZW50KXJldHVybiBfc2VsZi5hZGRFdmVudExpc3RlbmVyJiYoTy5kaXNhYmxlV29ya2VyTWVzc2FnZUhhbmRsZXJ8fF9zZWxmLmFkZEV2ZW50TGlzdGVuZXIoIm1lc3NhZ2UiLGZ1bmN0aW9uKGUpe3ZhciB0PUpTT04ucGFyc2UoZS5kYXRhKSxhPXQubGFuZ3VhZ2Usbj10LmNvZGUscj10LmltbWVkaWF0ZUNsb3NlO19zZWxmLnBvc3RNZXNzYWdlKE8uaGlnaGxpZ2h0KG4sTy5sYW5ndWFnZXNbYV0sYSkpLHImJl9zZWxmLmNsb3NlKCl9LCExKSksX3NlbGYuUHJpc207dmFyIGU9ZG9jdW1lbnQuY3VycmVudFNjcmlwdHx8W10uc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgic2NyaXB0IikpLnBvcCgpO3JldHVybiBlJiYoTy5maWxlbmFtZT1lLnNyYyxPLm1hbnVhbHx8ZS5oYXNBdHRyaWJ1dGUoImRhdGEtbWFudWFsIil8fCgibG9hZGluZyIhPT1kb2N1bWVudC5yZWFkeVN0YXRlP3dpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU/d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShPLmhpZ2hsaWdodEFsbCk6d2luZG93LnNldFRpbWVvdXQoTy5oaWdobGlnaHRBbGwsMTYpOmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIkRPTUNvbnRlbnRMb2FkZWQiLE8uaGlnaGxpZ2h0QWxsKSkpLF9zZWxmLlByaXNtfSgpOyJ1bmRlZmluZWQiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmKG1vZHVsZS5leHBvcnRzPVByaXNtKSwidW5kZWZpbmVkIiE9dHlwZW9mIGdsb2JhbCYmKGdsb2JhbC5QcmlzbT1QcmlzbSksUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cD17Y29tbWVudDovPCEtLVtcc1xTXSo/LS0+Lyxwcm9sb2c6LzxcP1tcc1xTXSs/XD8+Lyxkb2N0eXBlOi88IURPQ1RZUEVbXHNcU10rPz4vaSxjZGF0YTovPCFcW0NEQVRBXFtbXHNcU10qP11dPi9pLHRhZzp7cGF0dGVybjovPFwvPyg/IVxkKVteXHM+XC89JDwlXSsoPzpccytbXlxzPlwvPV0rKD86PSg/OigifCcpKD86XFxbXHNcU118KD8hXDEpW15cXF0pKlwxfFteXHMnIj49XSspKT8pKlxzKlwvPz4vaSxncmVlZHk6ITAsaW5zaWRlOnt0YWc6e3BhdHRlcm46L148XC8/W15ccz5cL10rL2ksaW5zaWRlOntwdW5jdHVhdGlvbjovXjxcLz8vLG5hbWVzcGFjZTovXlteXHM+XC86XSs6L319LCJhdHRyLXZhbHVlIjp7cGF0dGVybjovPSg/OigifCcpKD86XFxbXHNcU118KD8hXDEpW15cXF0pKlwxfFteXHMnIj49XSspL2ksaW5zaWRlOntwdW5jdHVhdGlvbjpbL149Lyx7cGF0dGVybjovKF58W15cXF0pWyInXS8sbG9va2JlaGluZDohMH1dfX0scHVuY3R1YXRpb246L1wvPz4vLCJhdHRyLW5hbWUiOntwYXR0ZXJuOi9bXlxzPlwvXSsvLGluc2lkZTp7bmFtZXNwYWNlOi9eW15ccz5cLzpdKzovfX19fSxlbnRpdHk6LyYjP1tcZGEtel17MSw4fTsvaX0sUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC50YWcuaW5zaWRlWyJhdHRyLXZhbHVlIl0uaW5zaWRlLmVudGl0eT1QcmlzbS5sYW5ndWFnZXMubWFya3VwLmVudGl0eSxQcmlzbS5ob29rcy5hZGQoIndyYXAiLGZ1bmN0aW9uKGUpeyJlbnRpdHkiPT09ZS50eXBlJiYoZS5hdHRyaWJ1dGVzLnRpdGxlPWUuY29udGVudC5yZXBsYWNlKC8mYW1wOy8sIiYiKSl9KSxQcmlzbS5sYW5ndWFnZXMueG1sPVByaXNtLmxhbmd1YWdlcy5tYXJrdXAsUHJpc20ubGFuZ3VhZ2VzLmh0bWw9UHJpc20ubGFuZ3VhZ2VzLm1hcmt1cCxQcmlzbS5sYW5ndWFnZXMubWF0aG1sPVByaXNtLmxhbmd1YWdlcy5tYXJrdXAsUHJpc20ubGFuZ3VhZ2VzLnN2Zz1QcmlzbS5sYW5ndWFnZXMubWFya3VwLFByaXNtLmxhbmd1YWdlcy5jc3M9e2NvbW1lbnQ6L1wvXCpbXHNcU10qP1wqXC8vLGF0cnVsZTp7cGF0dGVybjovQFtcdy1dKz8uKj8oPzo7fCg/PVxzKlx7KSkvaSxpbnNpZGU6e3J1bGU6L0BbXHctXSsvfX0sdXJsOi91cmxcKCg/OihbIiddKSg/OlxcKD86XHJcbnxbXHNcU10pfCg/IVwxKVteXFxcclxuXSkqXDF8Lio/KVwpL2ksc2VsZWN0b3I6L1tee31cc11bXnt9O10qPyg/PVxzKlx7KS8sc3RyaW5nOntwYXR0ZXJuOi8oInwnKSg/OlxcKD86XHJcbnxbXHNcU10pfCg/IVwxKVteXFxcclxuXSkqXDEvLGdyZWVkeTohMH0scHJvcGVydHk6L1stX2Etelx4QTAtXHVGRkZGXVstXHdceEEwLVx1RkZGRl0qKD89XHMqOikvaSxpbXBvcnRhbnQ6L1xCIWltcG9ydGFudFxiL2ksZnVuY3Rpb246L1stYS16MC05XSsoPz1cKCkvaSxwdW5jdHVhdGlvbjovWygpe307Ol0vfSxQcmlzbS5sYW5ndWFnZXMuY3NzLmF0cnVsZS5pbnNpZGUucmVzdD1QcmlzbS5sYW5ndWFnZXMuY3NzLFByaXNtLmxhbmd1YWdlcy5tYXJrdXAmJihQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCJtYXJrdXAiLCJ0YWciLHtzdHlsZTp7cGF0dGVybjovKDxzdHlsZVtcc1xTXSo/PilbXHNcU10qPyg/PTxcL3N0eWxlPikvaSxsb29rYmVoaW5kOiEwLGluc2lkZTpQcmlzbS5sYW5ndWFnZXMuY3NzLGFsaWFzOiJsYW5ndWFnZS1jc3MiLGdyZWVkeTohMH19KSxQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCJpbnNpZGUiLCJhdHRyLXZhbHVlIix7InN0eWxlLWF0dHIiOntwYXR0ZXJuOi9ccypzdHlsZT0oInwnKSg/OlxcW1xzXFNdfCg/IVwxKVteXFxdKSpcMS9pLGluc2lkZTp7ImF0dHItbmFtZSI6e3BhdHRlcm46L15ccypzdHlsZS9pLGluc2lkZTpQcmlzbS5sYW5ndWFnZXMubWFya3VwLnRhZy5pbnNpZGV9LHB1bmN0dWF0aW9uOi9eXHMqPVxzKlsnIl18WyciXVxzKiQvLCJhdHRyLXZhbHVlIjp7cGF0dGVybjovLisvaSxpbnNpZGU6UHJpc20ubGFuZ3VhZ2VzLmNzc319LGFsaWFzOiJsYW5ndWFnZS1jc3MifX0sUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC50YWcpKSxQcmlzbS5sYW5ndWFnZXMuY2xpa2U9e2NvbW1lbnQ6W3twYXR0ZXJuOi8oXnxbXlxcXSlcL1wqW1xzXFNdKj8oPzpcKlwvfCQpLyxsb29rYmVoaW5kOiEwfSx7cGF0dGVybjovKF58W15cXDpdKVwvXC8uKi8sbG9va2JlaGluZDohMH1dLHN0cmluZzp7cGF0dGVybjovKFsiJ10pKD86XFwoPzpcclxufFtcc1xTXSl8KD8hXDEpW15cXFxyXG5dKSpcMS8sZ3JlZWR5OiEwfSwiY2xhc3MtbmFtZSI6e3BhdHRlcm46LygoPzpcYig/OmNsYXNzfGludGVyZmFjZXxleHRlbmRzfGltcGxlbWVudHN8dHJhaXR8aW5zdGFuY2VvZnxuZXcpXHMrKXwoPzpjYXRjaFxzK1woKSlbXHcuXFxdKy9pLGxvb2tiZWhpbmQ6ITAsaW5zaWRlOntwdW5jdHVhdGlvbjovWy5cXF0vfX0sa2V5d29yZDovXGIoPzppZnxlbHNlfHdoaWxlfGRvfGZvcnxyZXR1cm58aW58aW5zdGFuY2VvZnxmdW5jdGlvbnxuZXd8dHJ5fHRocm93fGNhdGNofGZpbmFsbHl8bnVsbHxicmVha3xjb250aW51ZSlcYi8sYm9vbGVhbjovXGIoPzp0cnVlfGZhbHNlKVxiLyxmdW5jdGlvbjovW2EtejAtOV9dKyg/PVwoKS9pLG51bWJlcjovXGIweFtcZGEtZl0rXGJ8KD86XGJcZCtcLj9cZCp8XEJcLlxkKykoPzplWystXT9cZCspPy9pLG9wZXJhdG9yOi8tLT98XCtcKz98IT0/PT98PD0/fD49P3w9PT89P3wmJj98XHxcfD98XD98XCp8XC98fnxcXnwlLyxwdW5jdHVhdGlvbjovW3t9W1xdOygpLC46XS99LFByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0PVByaXNtLmxhbmd1YWdlcy5leHRlbmQoImNsaWtlIix7a2V5d29yZDovXGIoPzphc3xhc3luY3xhd2FpdHxicmVha3xjYXNlfGNhdGNofGNsYXNzfGNvbnN0fGNvbnRpbnVlfGRlYnVnZ2VyfGRlZmF1bHR8ZGVsZXRlfGRvfGVsc2V8ZW51bXxleHBvcnR8ZXh0ZW5kc3xmaW5hbGx5fGZvcnxmcm9tfGZ1bmN0aW9ufGdldHxpZnxpbXBsZW1lbnRzfGltcG9ydHxpbnxpbnN0YW5jZW9mfGludGVyZmFjZXxsZXR8bmV3fG51bGx8b2Z8cGFja2FnZXxwcml2YXRlfHByb3RlY3RlZHxwdWJsaWN8cmV0dXJufHNldHxzdGF0aWN8c3VwZXJ8c3dpdGNofHRoaXN8dGhyb3d8dHJ5fHR5cGVvZnx2YXJ8dm9pZHx3aGlsZXx3aXRofHlpZWxkKVxiLyxudW1iZXI6L1xiKD86MFt4WF1bXGRBLUZhLWZdK3wwW2JCXVswMV0rfDBbb09dWzAtN10rfE5hTnxJbmZpbml0eSlcYnwoPzpcYlxkK1wuP1xkKnxcQlwuXGQrKSg/OltFZV1bKy1dP1xkKyk/LyxmdW5jdGlvbjovW18kYS16XHhBMC1cdUZGRkZdWyRcd1x4QTAtXHVGRkZGXSooPz1ccypcKCkvaSxvcGVyYXRvcjovLVstPV0/fFwrWys9XT98IT0/PT98PDw/PT98Pj4/Pj89P3w9KD86PT0/fD4pP3wmWyY9XT98XHxbfD1dP3xcKlwqPz0/fFwvPT98fnxcXj0/fCU9P3xcP3xcLnszfS99KSxQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCJqYXZhc2NyaXB0Iiwia2V5d29yZCIse3JlZ2V4OntwYXR0ZXJuOi8oXnxbXi9dKVwvKD8hXC8pKFxbW15cXVxyXG5dK118XFwufFteL1xcXFtcclxuXSkrXC9bZ2lteXVdezAsNX0oPz1ccyooJHxbXHJcbiwuO30pXSkpLyxsb29rYmVoaW5kOiEwLGdyZWVkeTohMH0sImZ1bmN0aW9uLXZhcmlhYmxlIjp7cGF0dGVybjovW18kYS16XHhBMC1cdUZGRkZdWyRcd1x4QTAtXHVGRkZGXSooPz1ccyo9XHMqKD86ZnVuY3Rpb25cYnwoPzpcKFteKCldKlwpfFtfJGEtelx4QTAtXHVGRkZGXVskXHdceEEwLVx1RkZGRl0qKVxzKj0+KSkvaSxhbGlhczoiZnVuY3Rpb24ifX0pLFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoImphdmFzY3JpcHQiLCJzdHJpbmciLHsidGVtcGxhdGUtc3RyaW5nIjp7cGF0dGVybjovYCg/OlxcW1xzXFNdfFteXFxgXSkqYC8sZ3JlZWR5OiEwLGluc2lkZTp7aW50ZXJwb2xhdGlvbjp7cGF0dGVybjovXCRce1tefV0rXH0vLGluc2lkZTp7ImludGVycG9sYXRpb24tcHVuY3R1YXRpb24iOntwYXR0ZXJuOi9eXCRce3xcfSQvLGFsaWFzOiJwdW5jdHVhdGlvbiJ9LHJlc3Q6UHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHR9fSxzdHJpbmc6L1tcc1xTXSsvfX19KSxQcmlzbS5sYW5ndWFnZXMubWFya3VwJiZQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCJtYXJrdXAiLCJ0YWciLHtzY3JpcHQ6e3BhdHRlcm46Lyg8c2NyaXB0W1xzXFNdKj8+KVtcc1xTXSo/KD89PFwvc2NyaXB0PikvaSxsb29rYmVoaW5kOiEwLGluc2lkZTpQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdCxhbGlhczoibGFuZ3VhZ2UtamF2YXNjcmlwdCIsZ3JlZWR5OiEwfX0pLFByaXNtLmxhbmd1YWdlcy5qcz1QcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdCwidW5kZWZpbmVkIiE9dHlwZW9mIHNlbGYmJnNlbGYuUHJpc20mJnNlbGYuZG9jdW1lbnQmJmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3ImJihzZWxmLlByaXNtLmZpbGVIaWdobGlnaHQ9ZnVuY3Rpb24oKXt2YXIgbz17anM6ImphdmFzY3JpcHQiLHB5OiJweXRob24iLHJiOiJydWJ5IixwczE6InBvd2Vyc2hlbGwiLHBzbTE6InBvd2Vyc2hlbGwiLHNoOiJiYXNoIixiYXQ6ImJhdGNoIixoOiJjIix0ZXg6ImxhdGV4In07QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgicHJlW2RhdGEtc3JjXSIpKS5mb3JFYWNoKGZ1bmN0aW9uKGUpe2Zvcih2YXIgdCxhPWUuZ2V0QXR0cmlidXRlKCJkYXRhLXNyYyIpLG49ZSxyPS9cYmxhbmcoPzp1YWdlKT8tKD8hXCopKFx3KylcYi9pO24mJiFyLnRlc3Qobi5jbGFzc05hbWUpOyluPW4ucGFyZW50Tm9kZTtpZihuJiYodD0oZS5jbGFzc05hbWUubWF0Y2gocil8fFssIiJdKVsxXSksIXQpe3ZhciBpPShhLm1hdGNoKC9cLihcdyspJC8pfHxbLCIiXSlbMV07dD1vW2ldfHxpfXZhciBzPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoImNvZGUiKTtzLmNsYXNzTmFtZT0ibGFuZ3VhZ2UtIit0LGUudGV4dENvbnRlbnQ9IiIscy50ZXh0Q29udGVudD0iTG9hZGluZ+KApiIsZS5hcHBlbmRDaGlsZChzKTt2YXIgbD1uZXcgWE1MSHR0cFJlcXVlc3Q7bC5vcGVuKCJHRVQiLGEsITApLGwub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7ND09bC5yZWFkeVN0YXRlJiYobC5zdGF0dXM8NDAwJiZsLnJlc3BvbnNlVGV4dD8ocy50ZXh0Q29udGVudD1sLnJlc3BvbnNlVGV4dCxQcmlzbS5oaWdobGlnaHRFbGVtZW50KHMpKTo0MDA8PWwuc3RhdHVzP3MudGV4dENvbnRlbnQ9IuKcliBFcnJvciAiK2wuc3RhdHVzKyIgd2hpbGUgZmV0Y2hpbmcgZmlsZTogIitsLnN0YXR1c1RleHQ6cy50ZXh0Q29udGVudD0i4pyWIEVycm9yOiBGaWxlIGRvZXMgbm90IGV4aXN0IG9yIGlzIGVtcHR5Iil9LGwuc2VuZChudWxsKX0pfSxkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCJET01Db250ZW50TG9hZGVkIixzZWxmLlByaXNtLmZpbGVIaWdobGlnaHQpKTsKCgovLyBiYXNoCiFmdW5jdGlvbihlKXt2YXIgdD17dmFyaWFibGU6W3twYXR0ZXJuOi9cJD9cKFwoW1xzXFNdKz9cKVwpLyxpbnNpZGU6e3ZhcmlhYmxlOlt7cGF0dGVybjovKF5cJFwoXChbXHNcU10rKVwpXCkvLGxvb2tiZWhpbmQ6ITB9LC9eXCRcKFwoL10sbnVtYmVyOi9cYjB4W1xkQS1GYS1mXStcYnwoPzpcYlxkK1wuP1xkKnxcQlwuXGQrKSg/OltFZV0tP1xkKyk/LyxvcGVyYXRvcjovLS0/fC09fFwrXCs/fFwrPXwhPT98fnxcKlwqP3xcKj18XC89P3wlPT98PDw9P3w+Pj0/fDw9P3w+PT98PT0/fCYmP3wmPXxcXj0/fFx8XHw/fFx8PXxcP3w6LyxwdW5jdHVhdGlvbjovXChcKD98XClcKT98LHw7L319LHtwYXR0ZXJuOi9cJFwoW14pXStcKXxgW15gXStgLyxncmVlZHk6ITAsaW5zaWRlOnt2YXJpYWJsZTovXlwkXCh8XmB8XCkkfGAkL319LC9cJCg/OltcdyM/KiFAXSt8XHtbXn1dK1x9KS9pXX07ZS5sYW5ndWFnZXMuYmFzaD17c2hlYmFuZzp7cGF0dGVybjovXiMhXHMqXC9iaW5cL2Jhc2h8XiMhXHMqXC9iaW5cL3NoLyxhbGlhczoiaW1wb3J0YW50In0sY29tbWVudDp7cGF0dGVybjovKF58W14ie1xcXSkjLiovLGxvb2tiZWhpbmQ6ITB9LHN0cmluZzpbe3BhdHRlcm46LygoPzpefFtePF0pPDxccyopWyInXT8oXHcrPylbIiddP1xzKlxyP1xuKD86W1xzXFNdKSo/XHI/XG5cMi8sbG9va2JlaGluZDohMCxncmVlZHk6ITAsaW5zaWRlOnR9LHtwYXR0ZXJuOi8oWyInXSkoPzpcXFtcc1xTXXxcJFwoW14pXStcKXxgW15gXStgfCg/IVwxKVteXFxdKSpcMS8sZ3JlZWR5OiEwLGluc2lkZTp0fV0sdmFyaWFibGU6dC52YXJpYWJsZSwiZnVuY3Rpb24iOntwYXR0ZXJuOi8oXnxbXHM7fCZdKSg/OmFsaWFzfGFwcm9wb3N8YXB0LWdldHxhcHRpdHVkZXxhc3BlbGx8YXdrfGJhc2VuYW1lfGJhc2h8YmN8Ymd8YnVpbHRpbnxiemlwMnxjYWx8Y2F0fGNkfGNmZGlza3xjaGdycHxjaG1vZHxjaG93bnxjaHJvb3R8Y2hrY29uZmlnfGNrc3VtfGNsZWFyfGNtcHxjb21tfGNvbW1hbmR8Y3B8Y3Jvbnxjcm9udGFifGNzcGxpdHxjdXR8ZGF0ZXxkY3xkZHxkZHJlc2N1ZXxkZnxkaWZmfGRpZmYzfGRpZ3xkaXJ8ZGlyY29sb3JzfGRpcm5hbWV8ZGlyc3xkbWVzZ3xkdXxlZ3JlcHxlamVjdHxlbmFibGV8ZW52fGV0aHRvb2x8ZXZhbHxleGVjfGV4cGFuZHxleHBlY3R8ZXhwb3J0fGV4cHJ8ZmRmb3JtYXR8ZmRpc2t8Zmd8ZmdyZXB8ZmlsZXxmaW5kfGZtdHxmb2xkfGZvcm1hdHxmcmVlfGZzY2t8ZnRwfGZ1c2VyfGdhd2t8Z2V0b3B0c3xnaXR8Z3JlcHxncm91cGFkZHxncm91cGRlbHxncm91cG1vZHxncm91cHN8Z3ppcHxoYXNofGhlYWR8aGVscHxoZ3xoaXN0b3J5fGhvc3RuYW1lfGh0b3B8aWNvbnZ8aWR8aWZjb25maWd8aWZkb3dufGlmdXB8aW1wb3J0fGluc3RhbGx8am9ic3xqb2lufGtpbGx8a2lsbGFsbHxsZXNzfGxpbmt8bG58bG9jYXRlfGxvZ25hbWV8bG9nb3V0fGxvb2t8bHBjfGxwcnxscHJpbnR8bHByaW50ZHxscHJpbnRxfGxwcm18bHN8bHNvZnxtYWtlfG1hbnxta2Rpcnxta2ZpZm98bWtpc29mc3xta25vZHxtb3JlfG1vc3R8bW91bnR8bXRvb2xzfG10cnxtdnxtbXZ8bmFub3xuZXRzdGF0fG5pY2V8bmx8bm9odXB8bm90aWZ5LXNlbmR8bnBtfG5zbG9va3VwfG9wZW58b3B8cGFzc3dkfHBhc3RlfHBhdGhjaGt8cGluZ3xwa2lsbHxwb3BkfHByfHByaW50Y2FwfHByaW50ZW52fHByaW50Znxwc3xwdXNoZHxwdnxwd2R8cXVvdGF8cXVvdGFjaGVja3xxdW90YWN0bHxyYW18cmFyfHJjcHxyZWFkfHJlYWRhcnJheXxyZWFkb25seXxyZWJvb3R8cmVuYW1lfHJlbmljZXxyZW1zeW5jfHJldnxybXxybWRpcnxyc3luY3xzY3JlZW58c2NwfHNkaWZmfHNlZHxzZXF8c2VydmljZXxzZnRwfHNoaWZ0fHNob3B0fHNodXRkb3dufHNsZWVwfHNsb2NhdGV8c29ydHxzb3VyY2V8c3BsaXR8c3NofHN0YXR8c3RyYWNlfHN1fHN1ZG98c3VtfHN1c3BlbmR8c3luY3x0YWlsfHRhcnx0ZWV8dGVzdHx0aW1lfHRpbWVvdXR8dGltZXN8dG91Y2h8dG9wfHRyYWNlcm91dGV8dHJhcHx0cnx0c29ydHx0dHl8dHlwZXx1bGltaXR8dW1hc2t8dW1vdW50fHVuYWxpYXN8dW5hbWV8dW5leHBhbmR8dW5pcXx1bml0c3x1bnJhcnx1bnNoYXJ8dXB0aW1lfHVzZXJhZGR8dXNlcmRlbHx1c2VybW9kfHVzZXJzfHV1ZW5jb2RlfHV1ZGVjb2RlfHZ8dmRpcnx2aXx2bXN0YXR8d2FpdHx3YXRjaHx3Y3x3Z2V0fHdoZXJlaXN8d2hpY2h8d2hvfHdob2FtaXx3cml0ZXx4YXJnc3x4ZGctb3Blbnx5ZXN8emlwKSg/PSR8W1xzO3wmXSkvLGxvb2tiZWhpbmQ6ITB9LGtleXdvcmQ6e3BhdHRlcm46LyhefFtcczt8Jl0pKD86bGV0fDp8XC58aWZ8dGhlbnxlbHNlfGVsaWZ8Zml8Zm9yfGJyZWFrfGNvbnRpbnVlfHdoaWxlfGlufGNhc2V8ZnVuY3Rpb258c2VsZWN0fGRvfGRvbmV8dW50aWx8ZWNob3xleGl0fHJldHVybnxzZXR8ZGVjbGFyZSkoPz0kfFtcczt8Jl0pLyxsb29rYmVoaW5kOiEwfSwiYm9vbGVhbiI6e3BhdHRlcm46LyhefFtcczt8Jl0pKD86dHJ1ZXxmYWxzZSkoPz0kfFtcczt8Jl0pLyxsb29rYmVoaW5kOiEwfSxvcGVyYXRvcjovJiY/fFx8XHw/fD09P3whPT98PDw8P3w+Pnw8PT98Pj0/fD1+LyxwdW5jdHVhdGlvbjovXCQ/XChcKD98XClcKT98XC5cLnxbe31bXF07XS99O3ZhciBhPXQudmFyaWFibGVbMV0uaW5zaWRlO2Euc3RyaW5nPWUubGFuZ3VhZ2VzLmJhc2guc3RyaW5nLGFbImZ1bmN0aW9uIl09ZS5sYW5ndWFnZXMuYmFzaFsiZnVuY3Rpb24iXSxhLmtleXdvcmQ9ZS5sYW5ndWFnZXMuYmFzaC5rZXl3b3JkLGEuYm9vbGVhbj1lLmxhbmd1YWdlcy5iYXNoLmJvb2xlYW4sYS5vcGVyYXRvcj1lLmxhbmd1YWdlcy5iYXNoLm9wZXJhdG9yLGEucHVuY3R1YXRpb249ZS5sYW5ndWFnZXMuYmFzaC5wdW5jdHVhdGlvbixlLmxhbmd1YWdlcy5zaGVsbD1lLmxhbmd1YWdlcy5iYXNofShQcmlzbSk7Ci8vIHBocAohZnVuY3Rpb24oZSl7ZS5sYW5ndWFnZXMucGhwPWUubGFuZ3VhZ2VzLmV4dGVuZCgiY2xpa2UiLHtrZXl3b3JkOi9cYig/OmFuZHxvcnx4b3J8YXJyYXl8YXN8YnJlYWt8Y2FzZXxjZnVuY3Rpb258Y2xhc3N8Y29uc3R8Y29udGludWV8ZGVjbGFyZXxkZWZhdWx0fGRpZXxkb3xlbHNlfGVsc2VpZnxlbmRkZWNsYXJlfGVuZGZvcnxlbmRmb3JlYWNofGVuZGlmfGVuZHN3aXRjaHxlbmR3aGlsZXxleHRlbmRzfGZvcnxmb3JlYWNofGZ1bmN0aW9ufGluY2x1ZGV8aW5jbHVkZV9vbmNlfGdsb2JhbHxpZnxuZXd8cmV0dXJufHN0YXRpY3xzd2l0Y2h8dXNlfHJlcXVpcmV8cmVxdWlyZV9vbmNlfHZhcnx3aGlsZXxhYnN0cmFjdHxpbnRlcmZhY2V8cHVibGljfGltcGxlbWVudHN8cHJpdmF0ZXxwcm90ZWN0ZWR8cGFyZW50fHRocm93fG51bGx8ZWNob3xwcmludHx0cmFpdHxuYW1lc3BhY2V8ZmluYWx8eWllbGR8Z290b3xpbnN0YW5jZW9mfGZpbmFsbHl8dHJ5fGNhdGNoKVxiL2ksY29uc3RhbnQ6L1xiW0EtWjAtOV9dezIsfVxiLyxjb21tZW50OntwYXR0ZXJuOi8oXnxbXlxcXSkoPzpcL1wqW1xzXFNdKj9cKlwvfFwvXC8uKikvLGxvb2tiZWhpbmQ6ITB9fSksZS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCJwaHAiLCJzdHJpbmciLHsic2hlbGwtY29tbWVudCI6e3BhdHRlcm46LyhefFteXFxdKSMuKi8sbG9va2JlaGluZDohMCxhbGlhczoiY29tbWVudCJ9fSksZS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCJwaHAiLCJrZXl3b3JkIix7ZGVsaW1pdGVyOntwYXR0ZXJuOi9cPz58PFw/KD86cGhwfD0pPy9pLGFsaWFzOiJpbXBvcnRhbnQifSx2YXJpYWJsZTovXCQrKD86XHcrXGJ8KD89eykpL2ksInBhY2thZ2UiOntwYXR0ZXJuOi8oXFx8bmFtZXNwYWNlXHMrfHVzZVxzKylbXHdcXF0rLyxsb29rYmVoaW5kOiEwLGluc2lkZTp7cHVuY3R1YXRpb246L1xcL319fSksZS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCJwaHAiLCJvcGVyYXRvciIse3Byb3BlcnR5OntwYXR0ZXJuOi8oLT4pW1x3XSsvLGxvb2tiZWhpbmQ6ITB9fSksZS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCJwaHAiLCJzdHJpbmciLHsibm93ZG9jLXN0cmluZyI6e3BhdHRlcm46Lzw8PCcoW14nXSspJyg/OlxyXG4/fFxuKSg/Oi4qKD86XHJcbj98XG4pKSo/XDE7LyxncmVlZHk6ITAsYWxpYXM6InN0cmluZyIsaW5zaWRlOntkZWxpbWl0ZXI6e3BhdHRlcm46L148PDwnW14nXSsnfFthLXpfXVx3KjskL2ksYWxpYXM6InN5bWJvbCIsaW5zaWRlOntwdW5jdHVhdGlvbjovXjw8PCc/fFsnO10kL319fX0sImhlcmVkb2Mtc3RyaW5nIjp7cGF0dGVybjovPDw8KD86IihbXiJdKykiKD86XHJcbj98XG4pKD86LiooPzpcclxuP3xcbikpKj9cMTt8KFthLXpfXVx3KikoPzpcclxuP3xcbikoPzouKig/OlxyXG4/fFxuKSkqP1wyOykvaSxncmVlZHk6ITAsYWxpYXM6InN0cmluZyIsaW5zaWRlOntkZWxpbWl0ZXI6e3BhdHRlcm46L148PDwoPzoiW14iXSsifFthLXpfXVx3Kil8W2Etel9dXHcqOyQvaSxhbGlhczoic3ltYm9sIixpbnNpZGU6e3B1bmN0dWF0aW9uOi9ePDw8Ij98WyI7XSQvfX0saW50ZXJwb2xhdGlvbjpudWxsfX0sInNpbmdsZS1xdW90ZWQtc3RyaW5nIjp7cGF0dGVybjovJyg/OlxcW1xzXFNdfFteXFwnXSkqJy8sZ3JlZWR5OiEwLGFsaWFzOiJzdHJpbmcifSwiZG91YmxlLXF1b3RlZC1zdHJpbmciOntwYXR0ZXJuOi8iKD86XFxbXHNcU118W15cXCJdKSoiLyxncmVlZHk6ITAsYWxpYXM6InN0cmluZyIsaW5zaWRlOntpbnRlcnBvbGF0aW9uOm51bGx9fX0pLGRlbGV0ZSBlLmxhbmd1YWdlcy5waHAuc3RyaW5nO3ZhciBuPXtwYXR0ZXJuOi97XCQoPzp7KD86e1tee31dK318W157fV0rKX18W157fV0pK318KF58W15cXHtdKVwkKyg/Olx3Kyg/OlxbLis/XXwtPlx3KykqKS8sbG9va2JlaGluZDohMCxpbnNpZGU6e3Jlc3Q6ZS5sYW5ndWFnZXMucGhwfX07ZS5sYW5ndWFnZXMucGhwWyJoZXJlZG9jLXN0cmluZyJdLmluc2lkZS5pbnRlcnBvbGF0aW9uPW4sZS5sYW5ndWFnZXMucGhwWyJkb3VibGUtcXVvdGVkLXN0cmluZyJdLmluc2lkZS5pbnRlcnBvbGF0aW9uPW4sZS5sYW5ndWFnZXMubWFya3VwJiYoZS5ob29rcy5hZGQoImJlZm9yZS1oaWdobGlnaHQiLGZ1bmN0aW9uKG4peyJwaHAiPT09bi5sYW5ndWFnZSYmLyg/OjxcP3BocHw8XD8pL2dpLnRlc3Qobi5jb2RlKSYmKG4udG9rZW5TdGFjaz1bXSxuLmJhY2t1cENvZGU9bi5jb2RlLG4uY29kZT1uLmNvZGUucmVwbGFjZSgvKD86PFw/cGhwfDxcPylbXHNcU10qPyg/Olw/PnwkKS9naSxmdW5jdGlvbihlKXtmb3IodmFyIGE9bi50b2tlblN0YWNrLmxlbmd0aDstMSE9PW4uYmFja3VwQ29kZS5pbmRleE9mKCJfX19QSFAiK2ErIl9fXyIpOykrK2E7cmV0dXJuIG4udG9rZW5TdGFja1thXT1lLCJfX19QSFAiK2ErIl9fXyJ9KSxuLmdyYW1tYXI9ZS5sYW5ndWFnZXMubWFya3VwKX0pLGUuaG9va3MuYWRkKCJiZWZvcmUtaW5zZXJ0IixmdW5jdGlvbihlKXsicGhwIj09PWUubGFuZ3VhZ2UmJmUuYmFja3VwQ29kZSYmKGUuY29kZT1lLmJhY2t1cENvZGUsZGVsZXRlIGUuYmFja3VwQ29kZSl9KSxlLmhvb2tzLmFkZCgiYWZ0ZXItaGlnaGxpZ2h0IixmdW5jdGlvbihuKXtpZigicGhwIj09PW4ubGFuZ3VhZ2UmJm4udG9rZW5TdGFjayl7bi5ncmFtbWFyPWUubGFuZ3VhZ2VzLnBocDtmb3IodmFyIGE9MCx0PU9iamVjdC5rZXlzKG4udG9rZW5TdGFjayk7YTx0Lmxlbmd0aDsrK2Epe3ZhciBpPXRbYV0scj1uLnRva2VuU3RhY2tbaV07bi5oaWdobGlnaHRlZENvZGU9bi5oaWdobGlnaHRlZENvZGUucmVwbGFjZSgiX19fUEhQIitpKyJfX18iLCc8c3BhbiBjbGFzcz0idG9rZW4gcGhwIGxhbmd1YWdlLXBocCI+JytlLmhpZ2hsaWdodChyLG4uZ3JhbW1hciwicGhwIikucmVwbGFjZSgvXCQvZywiJCQkJCIpKyI8L3NwYW4+Iil9bi5lbGVtZW50LmlubmVySFRNTD1uLmhpZ2hsaWdodGVkQ29kZX19KSl9KFByaXNtKTsKLy8gcHl0aG9uClByaXNtLmxhbmd1YWdlcy5weXRob249e2NvbW1lbnQ6e3BhdHRlcm46LyhefFteXFxdKSMuKi8sbG9va2JlaGluZDohMH0sInRyaXBsZS1xdW90ZWQtc3RyaW5nIjp7cGF0dGVybjovKCIiInwnJycpW1xzXFNdKz9cMS8sZ3JlZWR5OiEwLGFsaWFzOiJzdHJpbmcifSxzdHJpbmc6e3BhdHRlcm46LygifCcpKD86XFwufCg/IVwxKVteXFxcclxuXSkqXDEvLGdyZWVkeTohMH0sImZ1bmN0aW9uIjp7cGF0dGVybjovKCg/Ol58XHMpZGVmWyBcdF0rKVthLXpBLVpfXVx3Kig/PVxzKlwoKS9nLGxvb2tiZWhpbmQ6ITB9LCJjbGFzcy1uYW1lIjp7cGF0dGVybjovKFxiY2xhc3NccyspXHcrL2ksbG9va2JlaGluZDohMH0sa2V5d29yZDovXGIoPzphc3xhc3NlcnR8YXN5bmN8YXdhaXR8YnJlYWt8Y2xhc3N8Y29udGludWV8ZGVmfGRlbHxlbGlmfGVsc2V8ZXhjZXB0fGV4ZWN8ZmluYWxseXxmb3J8ZnJvbXxnbG9iYWx8aWZ8aW1wb3J0fGlufGlzfGxhbWJkYXxub25sb2NhbHxwYXNzfHByaW50fHJhaXNlfHJldHVybnx0cnl8d2hpbGV8d2l0aHx5aWVsZClcYi8sYnVpbHRpbjovXGIoPzpfX2ltcG9ydF9ffGFic3xhbGx8YW55fGFwcGx5fGFzY2lpfGJhc2VzdHJpbmd8YmlufGJvb2x8YnVmZmVyfGJ5dGVhcnJheXxieXRlc3xjYWxsYWJsZXxjaHJ8Y2xhc3NtZXRob2R8Y21wfGNvZXJjZXxjb21waWxlfGNvbXBsZXh8ZGVsYXR0cnxkaWN0fGRpcnxkaXZtb2R8ZW51bWVyYXRlfGV2YWx8ZXhlY2ZpbGV8ZmlsZXxmaWx0ZXJ8ZmxvYXR8Zm9ybWF0fGZyb3plbnNldHxnZXRhdHRyfGdsb2JhbHN8aGFzYXR0cnxoYXNofGhlbHB8aGV4fGlkfGlucHV0fGludHxpbnRlcm58aXNpbnN0YW5jZXxpc3N1YmNsYXNzfGl0ZXJ8bGVufGxpc3R8bG9jYWxzfGxvbmd8bWFwfG1heHxtZW1vcnl2aWV3fG1pbnxuZXh0fG9iamVjdHxvY3R8b3BlbnxvcmR8cG93fHByb3BlcnR5fHJhbmdlfHJhd19pbnB1dHxyZWR1Y2V8cmVsb2FkfHJlcHJ8cmV2ZXJzZWR8cm91bmR8c2V0fHNldGF0dHJ8c2xpY2V8c29ydGVkfHN0YXRpY21ldGhvZHxzdHJ8c3VtfHN1cGVyfHR1cGxlfHR5cGV8dW5pY2hyfHVuaWNvZGV8dmFyc3x4cmFuZ2V8emlwKVxiLywiYm9vbGVhbiI6L1xiKD86VHJ1ZXxGYWxzZXxOb25lKVxiLyxudW1iZXI6Lyg/OlxiKD89XGQpfFxCKD89XC4pKSg/OjBbYm9dKT8oPzooPzpcZHwweFtcZGEtZl0pW1xkYS1mXSpcLj9cZCp8XC5cZCspKD86ZVsrLV0/XGQrKT9qP1xiL2ksb3BlcmF0b3I6L1stKyU9XT0/fCE9fFwqXCo/PT98XC9cLz89P3w8Wzw9Pl0/fD5bPT5dP3xbJnxefl18XGIoPzpvcnxhbmR8bm90KVxiLyxwdW5jdHVhdGlvbjovW3t9W1xdOygpLC46XS99OwovLyBydWJ5CiFmdW5jdGlvbihlKXtlLmxhbmd1YWdlcy5ydWJ5PWUubGFuZ3VhZ2VzLmV4dGVuZCgiY2xpa2UiLHtjb21tZW50OlsvIyg/IVx7W15cclxuXSo/XH0pLiovLC9ePWJlZ2luKD86XHI/XG58XHIpKD86LiooPzpccj9cbnxccikpKj89ZW5kL21dLGtleXdvcmQ6L1xiKD86YWxpYXN8YW5kfEJFR0lOfGJlZ2lufGJyZWFrfGNhc2V8Y2xhc3N8ZGVmfGRlZmluZV9tZXRob2R8ZGVmaW5lZHxkb3xlYWNofGVsc2V8ZWxzaWZ8RU5EfGVuZHxlbnN1cmV8ZmFsc2V8Zm9yfGlmfGlufG1vZHVsZXxuZXd8bmV4dHxuaWx8bm90fG9yfHByb3RlY3RlZHxwcml2YXRlfHB1YmxpY3xyYWlzZXxyZWRvfHJlcXVpcmV8cmVzY3VlfHJldHJ5fHJldHVybnxzZWxmfHN1cGVyfHRoZW58dGhyb3d8dHJ1ZXx1bmRlZnx1bmxlc3N8dW50aWx8d2hlbnx3aGlsZXx5aWVsZClcYi99KTt2YXIgbj17cGF0dGVybjovI1x7W159XStcfS8saW5zaWRlOntkZWxpbWl0ZXI6e3BhdHRlcm46L14jXHt8XH0kLyxhbGlhczoidGFnIn0scmVzdDplLmxhbmd1YWdlcy5ydWJ5fX07ZS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCJydWJ5Iiwia2V5d29yZCIse3JlZ2V4Olt7cGF0dGVybjovJXIoW15hLXpBLVowLTlcc3soXFs8XSkoPzooPyFcMSlbXlxcXXxcXFtcc1xTXSkqXDFbZ2ltXXswLDN9LyxncmVlZHk6ITAsaW5zaWRlOntpbnRlcnBvbGF0aW9uOm59fSx7cGF0dGVybjovJXJcKCg/OlteKClcXF18XFxbXHNcU10pKlwpW2dpbV17MCwzfS8sZ3JlZWR5OiEwLGluc2lkZTp7aW50ZXJwb2xhdGlvbjpufX0se3BhdHRlcm46LyVyXHsoPzpbXiN7fVxcXXwjKD86XHtbXn1dK1x9KT98XFxbXHNcU10pKlx9W2dpbV17MCwzfS8sZ3JlZWR5OiEwLGluc2lkZTp7aW50ZXJwb2xhdGlvbjpufX0se3BhdHRlcm46LyVyXFsoPzpbXlxbXF1cXF18XFxbXHNcU10pKlxdW2dpbV17MCwzfS8sZ3JlZWR5OiEwLGluc2lkZTp7aW50ZXJwb2xhdGlvbjpufX0se3BhdHRlcm46LyVyPCg/OltePD5cXF18XFxbXHNcU10pKj5bZ2ltXXswLDN9LyxncmVlZHk6ITAsaW5zaWRlOntpbnRlcnBvbGF0aW9uOm59fSx7cGF0dGVybjovKF58W15cL10pXC8oPyFcLykoXFsuKz9dfFxcLnxbXlwvXFxcclxuXSkrXC9bZ2ltXXswLDN9KD89XHMqKCR8W1xyXG4sLjt9KV0pKS8sbG9va2JlaGluZDohMCxncmVlZHk6ITB9XSx2YXJpYWJsZTovW0AkXStbYS16QS1aX11cdyooPzpbPyFdfFxiKS8sc3ltYm9sOntwYXR0ZXJuOi8oXnxbXjpdKTpbYS16QS1aX11cdyooPzpbPyFdfFxiKS8sbG9va2JlaGluZDohMH19KSxlLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoInJ1YnkiLCJudW1iZXIiLHtidWlsdGluOi9cYig/OkFycmF5fEJpZ251bXxCaW5kaW5nfENsYXNzfENvbnRpbnVhdGlvbnxEaXJ8RXhjZXB0aW9ufEZhbHNlQ2xhc3N8RmlsZXxTdGF0fEZpeG51bXxGbG9hdHxIYXNofEludGVnZXJ8SU98TWF0Y2hEYXRhfE1ldGhvZHxNb2R1bGV8TmlsQ2xhc3N8TnVtZXJpY3xPYmplY3R8UHJvY3xSYW5nZXxSZWdleHB8U3RyaW5nfFN0cnVjdHxUTVN8U3ltYm9sfFRocmVhZEdyb3VwfFRocmVhZHxUaW1lfFRydWVDbGFzcylcYi8sY29uc3RhbnQ6L1xiW0EtWl1cdyooPzpbPyFdfFxiKS99KSxlLmxhbmd1YWdlcy5ydWJ5LnN0cmluZz1be3BhdHRlcm46LyVbcVFpSXdXeHNdPyhbXmEtekEtWjAtOVxzeyhcWzxdKSg/Oig/IVwxKVteXFxdfFxcW1xzXFNdKSpcMS8sZ3JlZWR5OiEwLGluc2lkZTp7aW50ZXJwb2xhdGlvbjpufX0se3BhdHRlcm46LyVbcVFpSXdXeHNdP1woKD86W14oKVxcXXxcXFtcc1xTXSkqXCkvLGdyZWVkeTohMCxpbnNpZGU6e2ludGVycG9sYXRpb246bn19LHtwYXR0ZXJuOi8lW3FRaUl3V3hzXT9ceyg/OlteI3t9XFxdfCMoPzpce1tefV0rXH0pP3xcXFtcc1xTXSkqXH0vLGdyZWVkeTohMCxpbnNpZGU6e2ludGVycG9sYXRpb246bn19LHtwYXR0ZXJuOi8lW3FRaUl3V3hzXT9cWyg/OlteXFtcXVxcXXxcXFtcc1xTXSkqXF0vLGdyZWVkeTohMCxpbnNpZGU6e2ludGVycG9sYXRpb246bn19LHtwYXR0ZXJuOi8lW3FRaUl3V3hzXT88KD86W148PlxcXXxcXFtcc1xTXSkqPi8sZ3JlZWR5OiEwLGluc2lkZTp7aW50ZXJwb2xhdGlvbjpufX0se3BhdHRlcm46LygifCcpKD86I1x7W159XStcfXxcXCg/OlxyXG58W1xzXFNdKXwoPyFcMSlbXlxcXHJcbl0pKlwxLyxncmVlZHk6ITAsaW5zaWRlOntpbnRlcnBvbGF0aW9uOm59fV19KFByaXNtKTsKLy8gcGVybApQcmlzbS5sYW5ndWFnZXMucGVybD17Y29tbWVudDpbe3BhdHRlcm46LyheXHMqKT1cdytbXHNcU10qPz1jdXQuKi9tLGxvb2tiZWhpbmQ6ITB9LHtwYXR0ZXJuOi8oXnxbXlxcJF0pIy4qLyxsb29rYmVoaW5kOiEwfV0sc3RyaW5nOlt7cGF0dGVybjovXGIoPzpxfHFxfHF4fHF3KVxzKihbXmEtekEtWjAtOVxzeyhcWzxdKSg/Oig/IVwxKVteXFxdfFxcW1xzXFNdKSpcMS8sZ3JlZWR5OiEwfSx7cGF0dGVybjovXGIoPzpxfHFxfHF4fHF3KVxzKyhbYS16QS1aMC05XSkoPzooPyFcMSlbXlxcXXxcXFtcc1xTXSkqXDEvLGdyZWVkeTohMH0se3BhdHRlcm46L1xiKD86cXxxcXxxeHxxdylccypcKCg/OlteKClcXF18XFxbXHNcU10pKlwpLyxncmVlZHk6ITB9LHtwYXR0ZXJuOi9cYig/OnF8cXF8cXh8cXcpXHMqXHsoPzpbXnt9XFxdfFxcW1xzXFNdKSpcfS8sZ3JlZWR5OiEwfSx7cGF0dGVybjovXGIoPzpxfHFxfHF4fHF3KVxzKlxbKD86W15bXF1cXF18XFxbXHNcU10pKlxdLyxncmVlZHk6ITB9LHtwYXR0ZXJuOi9cYig/OnF8cXF8cXh8cXcpXHMqPCg/OltePD5cXF18XFxbXHNcU10pKj4vLGdyZWVkeTohMH0se3BhdHRlcm46LygifGApKD86KD8hXDEpW15cXF18XFxbXHNcU10pKlwxLyxncmVlZHk6ITB9LHtwYXR0ZXJuOi8nKD86W14nXFxcclxuXXxcXC4pKicvLGdyZWVkeTohMH1dLHJlZ2V4Olt7cGF0dGVybjovXGIoPzptfHFyKVxzKihbXmEtekEtWjAtOVxzeyhcWzxdKSg/Oig/IVwxKVteXFxdfFxcW1xzXFNdKSpcMVttc2l4cG9kdWFsbmdjXSovLGdyZWVkeTohMH0se3BhdHRlcm46L1xiKD86bXxxcilccysoW2EtekEtWjAtOV0pKD86KD8hXDEpW15cXF18XFxbXHNcU10pKlwxW21zaXhwb2R1YWxuZ2NdKi8sZ3JlZWR5OiEwfSx7cGF0dGVybjovXGIoPzptfHFyKVxzKlwoKD86W14oKVxcXXxcXFtcc1xTXSkqXClbbXNpeHBvZHVhbG5nY10qLyxncmVlZHk6ITB9LHtwYXR0ZXJuOi9cYig/Om18cXIpXHMqXHsoPzpbXnt9XFxdfFxcW1xzXFNdKSpcfVttc2l4cG9kdWFsbmdjXSovLGdyZWVkeTohMH0se3BhdHRlcm46L1xiKD86bXxxcilccypcWyg/OlteW1xdXFxdfFxcW1xzXFNdKSpcXVttc2l4cG9kdWFsbmdjXSovLGdyZWVkeTohMH0se3BhdHRlcm46L1xiKD86bXxxcilccyo8KD86W148PlxcXXxcXFtcc1xTXSkqPlttc2l4cG9kdWFsbmdjXSovLGdyZWVkeTohMH0se3BhdHRlcm46LyhefFteLV1cYikoPzpzfHRyfHkpXHMqKFteYS16QS1aMC05XHN7KFxbPF0pKD86KD8hXDIpW15cXF18XFxbXHNcU10pKlwyKD86KD8hXDIpW15cXF18XFxbXHNcU10pKlwyW21zaXhwb2R1YWxuZ2Nlcl0qLyxsb29rYmVoaW5kOiEwLGdyZWVkeTohMH0se3BhdHRlcm46LyhefFteLV1cYikoPzpzfHRyfHkpXHMrKFthLXpBLVowLTldKSg/Oig/IVwyKVteXFxdfFxcW1xzXFNdKSpcMig/Oig/IVwyKVteXFxdfFxcW1xzXFNdKSpcMlttc2l4cG9kdWFsbmdjZXJdKi8sbG9va2JlaGluZDohMCxncmVlZHk6ITB9LHtwYXR0ZXJuOi8oXnxbXi1dXGIpKD86c3x0cnx5KVxzKlwoKD86W14oKVxcXXxcXFtcc1xTXSkqXClccypcKCg/OlteKClcXF18XFxbXHNcU10pKlwpW21zaXhwb2R1YWxuZ2Nlcl0qLyxsb29rYmVoaW5kOiEwLGdyZWVkeTohMH0se3BhdHRlcm46LyhefFteLV1cYikoPzpzfHRyfHkpXHMqXHsoPzpbXnt9XFxdfFxcW1xzXFNdKSpcfVxzKlx7KD86W157fVxcXXxcXFtcc1xTXSkqXH1bbXNpeHBvZHVhbG5nY2VyXSovLGxvb2tiZWhpbmQ6ITAsZ3JlZWR5OiEwfSx7cGF0dGVybjovKF58W14tXVxiKSg/OnN8dHJ8eSlccypcWyg/OlteW1xdXFxdfFxcW1xzXFNdKSpcXVxzKlxbKD86W15bXF1cXF18XFxbXHNcU10pKlxdW21zaXhwb2R1YWxuZ2Nlcl0qLyxsb29rYmVoaW5kOiEwLGdyZWVkeTohMH0se3BhdHRlcm46LyhefFteLV1cYikoPzpzfHRyfHkpXHMqPCg/OltePD5cXF18XFxbXHNcU10pKj5ccyo8KD86W148PlxcXXxcXFtcc1xTXSkqPlttc2l4cG9kdWFsbmdjZXJdKi8sbG9va2JlaGluZDohMCxncmVlZHk6ITB9LHtwYXR0ZXJuOi9cLyg/OlteXC9cXFxyXG5dfFxcLikqXC9bbXNpeHBvZHVhbG5nY10qKD89XHMqKD86JHxbXHJcbiwuO30pJnxcLSsqfjw+IT9eXXwobHR8Z3R8bGV8Z2V8ZXF8bmV8Y21wfG5vdHxhbmR8b3J8eG9yfHgpXGIpKS8sZ3JlZWR5OiEwfV0sdmFyaWFibGU6Wy9bJiokQCVdXHtcXltBLVpdK1x9LywvWyYqJEAlXVxeW0EtWl9dLywvWyYqJEAlXSM/KD89XHspLywvWyYqJEAlXSM/KD86KD86OjopKic/KD8hXGQpW1x3JF0rKSsoPzo6OikqL2ksL1smKiRAJV1cZCsvLC8oPyElPSlbJEAlXVshIiMkJSYnKCkqKyxcLS5cLzo7PD0+P0BbXFxcXV5fYHt8fX5dL10sZmlsZWhhbmRsZTp7cGF0dGVybjovPCg/IVs8PV0pXFMqPnxcYl9cYi8sYWxpYXM6InN5bWJvbCJ9LHZzdHJpbmc6e3BhdHRlcm46L3ZcZCsoPzpcLlxkKykqfFxkKyg/OlwuXGQrKXsyLH0vLGFsaWFzOiJzdHJpbmcifSwiZnVuY3Rpb24iOntwYXR0ZXJuOi9zdWIgW2EtejAtOV9dKy9pLGluc2lkZTp7a2V5d29yZDovc3ViL319LGtleXdvcmQ6L1xiKD86YW55fGJyZWFrfGNvbnRpbnVlfGRlZmF1bHR8ZGVsZXRlfGRpZXxkb3xlbHNlfGVsc2lmfGV2YWx8Zm9yfGZvcmVhY2h8Z2l2ZW58Z290b3xpZnxsYXN0fGxvY2FsfG15fG5leHR8b3VyfHBhY2thZ2V8cHJpbnR8cmVkb3xyZXF1aXJlfHNheXxzdGF0ZXxzdWJ8c3dpdGNofHVuZGVmfHVubGVzc3x1bnRpbHx1c2V8d2hlbnx3aGlsZSlcYi8sbnVtYmVyOi9cYig/OjB4W1xkQS1GYS1mXSg/Ol8/W1xkQS1GYS1mXSkqfDBiWzAxXSg/Ol8/WzAxXSkqfCg/OlxkKD86Xz9cZCkqKT9cLj9cZCg/Ol8/XGQpKig/OltFZV1bKy1dP1xkKyk/KVxiLyxvcGVyYXRvcjovLVtyd3hvUldYT2V6c2ZkbHBTYmN0dWdrVEJNQUNdXGJ8XCtbKz1dP3wtWy09Pl0/fFwqXCo/PT98XC9cLz89P3w9Wz1+Pl0/fH5bfj1dP3xcfFx8Pz0/fCYmPz0/fDwoPzo9Pj98PD0/KT98Pj4/PT98IVt+PV0/fFslXl09P3xcLig/Oj18XC5cLj8pP3xbXFw/XXxcYngoPzo9fFxiKXxcYig/Omx0fGd0fGxlfGdlfGVxfG5lfGNtcHxub3R8YW5kfG9yfHhvcilcYi8scHVuY3R1YXRpb246L1t7fVtcXTsoKSw6XS99OwovLyBnbwpQcmlzbS5sYW5ndWFnZXMuZ289UHJpc20ubGFuZ3VhZ2VzLmV4dGVuZCgiY2xpa2UiLHtrZXl3b3JkOi9cYig/OmJyZWFrfGNhc2V8Y2hhbnxjb25zdHxjb250aW51ZXxkZWZhdWx0fGRlZmVyfGVsc2V8ZmFsbHRocm91Z2h8Zm9yfGZ1bmN8Z28oPzp0byk/fGlmfGltcG9ydHxpbnRlcmZhY2V8bWFwfHBhY2thZ2V8cmFuZ2V8cmV0dXJufHNlbGVjdHxzdHJ1Y3R8c3dpdGNofHR5cGV8dmFyKVxiLyxidWlsdGluOi9cYig/OmJvb2x8Ynl0ZXxjb21wbGV4KD86NjR8MTI4KXxlcnJvcnxmbG9hdCg/OjMyfDY0KXxydW5lfHN0cmluZ3x1P2ludCg/Ojh8MTZ8MzJ8NjQpP3x1aW50cHRyfGFwcGVuZHxjYXB8Y2xvc2V8Y29tcGxleHxjb3B5fGRlbGV0ZXxpbWFnfGxlbnxtYWtlfG5ld3xwYW5pY3xwcmludCg/OmxuKT98cmVhbHxyZWNvdmVyKVxiLywiYm9vbGVhbiI6L1xiKD86X3xpb3RhfG5pbHx0cnVlfGZhbHNlKVxiLyxvcGVyYXRvcjovWypcLyVeIT1dPT98XCtbPStdP3wtWz0tXT98XHxbPXxdP3wmKD86PXwmfFxePT8pP3w+KD86Pj0/fD0pP3w8KD86PD0/fD18LSk/fDo9fFwuXC5cLi8sbnVtYmVyOi8oPzpcYjB4W2EtZlxkXSt8KD86XGJcZCtcLj9cZCp8XEJcLlxkKykoPzplWy0rXT9cZCspPylpPy9pLHN0cmluZzp7cGF0dGVybjovKFsiJ2BdKShcXFtcc1xTXXwoPyFcMSlbXlxcXSkqXDEvLGdyZWVkeTohMH19KSxkZWxldGUgUHJpc20ubGFuZ3VhZ2VzLmdvWyJjbGFzcy1uYW1lIl07Ci8vIGphdmFzY3JpcHQKUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHQ9UHJpc20ubGFuZ3VhZ2VzLmV4dGVuZCgiY2xpa2UiLHtrZXl3b3JkOi9cYig/OmFzfGFzeW5jfGF3YWl0fGJyZWFrfGNhc2V8Y2F0Y2h8Y2xhc3N8Y29uc3R8Y29udGludWV8ZGVidWdnZXJ8ZGVmYXVsdHxkZWxldGV8ZG98ZWxzZXxlbnVtfGV4cG9ydHxleHRlbmRzfGZpbmFsbHl8Zm9yfGZyb218ZnVuY3Rpb258Z2V0fGlmfGltcGxlbWVudHN8aW1wb3J0fGlufGluc3RhbmNlb2Z8aW50ZXJmYWNlfGxldHxuZXd8bnVsbHxvZnxwYWNrYWdlfHByaXZhdGV8cHJvdGVjdGVkfHB1YmxpY3xyZXR1cm58c2V0fHN0YXRpY3xzdXBlcnxzd2l0Y2h8dGhpc3x0aHJvd3x0cnl8dHlwZW9mfHZhcnx2b2lkfHdoaWxlfHdpdGh8eWllbGQpXGIvLG51bWJlcjovXGIoPzowW3hYXVtcZEEtRmEtZl0rfDBbYkJdWzAxXSt8MFtvT11bMC03XSt8TmFOfEluZmluaXR5KVxifCg/OlxiXGQrXC4/XGQqfFxCXC5cZCspKD86W0VlXVsrLV0/XGQrKT8vLCJmdW5jdGlvbiI6L1tfJGEtelx4QTAtXHVGRkZGXVskXHdceEEwLVx1RkZGRl0qKD89XHMqXCgpL2ksb3BlcmF0b3I6Ly1bLT1dP3xcK1srPV0/fCE9Pz0/fDw8Pz0/fD4+Pz4/PT98PSg/Oj09P3w+KT98JlsmPV0/fFx8W3w9XT98XCpcKj89P3xcLz0/fH58XF49P3wlPT98XD98XC57M30vfSksUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZSgiamF2YXNjcmlwdCIsImtleXdvcmQiLHtyZWdleDp7cGF0dGVybjovKF58W15cL10pXC8oPyFcLykoXFtbXlxdXHJcbl0rXXxcXC58W15cL1xcXFtcclxuXSkrXC9bZ2lteXVdezAsNX0oPz1ccyooJHxbXHJcbiwuO30pXSkpLyxsb29rYmVoaW5kOiEwLGdyZWVkeTohMH0sImZ1bmN0aW9uLXZhcmlhYmxlIjp7cGF0dGVybjovW18kYS16XHhBMC1cdUZGRkZdWyRcd1x4QTAtXHVGRkZGXSooPz1ccyo9XHMqKD86ZnVuY3Rpb25cYnwoPzpcKFteKCldKlwpfFtfJGEtelx4QTAtXHVGRkZGXVskXHdceEEwLVx1RkZGRl0qKVxzKj0+KSkvaSxhbGlhczoiZnVuY3Rpb24ifX0pLFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoImphdmFzY3JpcHQiLCJzdHJpbmciLHsidGVtcGxhdGUtc3RyaW5nIjp7cGF0dGVybjovYCg/OlxcW1xzXFNdfFteXFxgXSkqYC8sZ3JlZWR5OiEwLGluc2lkZTp7aW50ZXJwb2xhdGlvbjp7cGF0dGVybjovXCRce1tefV0rXH0vLGluc2lkZTp7ImludGVycG9sYXRpb24tcHVuY3R1YXRpb24iOntwYXR0ZXJuOi9eXCRce3xcfSQvLGFsaWFzOiJwdW5jdHVhdGlvbiJ9LHJlc3Q6UHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHR9fSxzdHJpbmc6L1tcc1xTXSsvfX19KSxQcmlzbS5sYW5ndWFnZXMubWFya3VwJiZQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCJtYXJrdXAiLCJ0YWciLHtzY3JpcHQ6e3BhdHRlcm46Lyg8c2NyaXB0W1xzXFNdKj8+KVtcc1xTXSo/KD89PFwvc2NyaXB0PikvaSxsb29rYmVoaW5kOiEwLGluc2lkZTpQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdCxhbGlhczoibGFuZ3VhZ2UtamF2YXNjcmlwdCIsZ3JlZWR5OiEwfX0pLFByaXNtLmxhbmd1YWdlcy5qcz1QcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdDsKLy8gYwpQcmlzbS5sYW5ndWFnZXMuYz1QcmlzbS5sYW5ndWFnZXMuZXh0ZW5kKCJjbGlrZSIse2tleXdvcmQ6L1xiKD86X0FsaWduYXN8X0FsaWdub2Z8X0F0b21pY3xfQm9vbHxfQ29tcGxleHxfR2VuZXJpY3xfSW1hZ2luYXJ5fF9Ob3JldHVybnxfU3RhdGljX2Fzc2VydHxfVGhyZWFkX2xvY2FsfGFzbXx0eXBlb2Z8aW5saW5lfGF1dG98YnJlYWt8Y2FzZXxjaGFyfGNvbnN0fGNvbnRpbnVlfGRlZmF1bHR8ZG98ZG91YmxlfGVsc2V8ZW51bXxleHRlcm58ZmxvYXR8Zm9yfGdvdG98aWZ8aW50fGxvbmd8cmVnaXN0ZXJ8cmV0dXJufHNob3J0fHNpZ25lZHxzaXplb2Z8c3RhdGljfHN0cnVjdHxzd2l0Y2h8dHlwZWRlZnx1bmlvbnx1bnNpZ25lZHx2b2lkfHZvbGF0aWxlfHdoaWxlKVxiLyxvcGVyYXRvcjovLVs+LV0/fFwrXCs/fCE9P3w8PD89P3w+Pj89P3w9PT98JiY/fFx8XHw/fFt+XiU/KlwvXS8sbnVtYmVyOi8oPzpcYjB4W1xkYS1mXSt8KD86XGJcZCtcLj9cZCp8XEJcLlxkKykoPzplWystXT9cZCspPylbZnVsXSovaX0pLFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoImMiLCJzdHJpbmciLHttYWNybzp7cGF0dGVybjovKF5ccyopI1xzKlthLXpdKyg/OlteXHJcblxcXXxcXCg/OlxyXG58W1xzXFNdKSkqL2ltLGxvb2tiZWhpbmQ6ITAsYWxpYXM6InByb3BlcnR5IixpbnNpZGU6e3N0cmluZzp7cGF0dGVybjovKCNccyppbmNsdWRlXHMqKSg/OjwuKz8+fCgifCcpKD86XFw/LikrP1wyKS8sbG9va2JlaGluZDohMH0sZGlyZWN0aXZlOntwYXR0ZXJuOi8oI1xzKilcYig/OmRlZmluZXxkZWZpbmVkfGVsaWZ8ZWxzZXxlbmRpZnxlcnJvcnxpZmRlZnxpZm5kZWZ8aWZ8aW1wb3J0fGluY2x1ZGV8bGluZXxwcmFnbWF8dW5kZWZ8dXNpbmcpXGIvLGxvb2tiZWhpbmQ6ITAsYWxpYXM6ImtleXdvcmQifX19LGNvbnN0YW50Oi9cYig/Ol9fRklMRV9ffF9fTElORV9ffF9fREFURV9ffF9fVElNRV9ffF9fVElNRVNUQU1QX198X19mdW5jX198RU9GfE5VTEx8U0VFS19DVVJ8U0VFS19FTkR8U0VFS19TRVR8c3RkaW58c3Rkb3V0fHN0ZGVycilcYi99KSxkZWxldGUgUHJpc20ubGFuZ3VhZ2VzLmNbImNsYXNzLW5hbWUiXSxkZWxldGUgUHJpc20ubGFuZ3VhZ2VzLmNbImJvb2xlYW4iXTsKLy8ganNvbgpQcmlzbS5sYW5ndWFnZXMuanNvbj17cHJvcGVydHk6LyIoPzpcXC58W15cXCJcclxuXSkqIig/PVxzKjopL2ksc3RyaW5nOntwYXR0ZXJuOi8iKD86XFwufFteXFwiXHJcbl0pKiIoPyFccyo6KS8sZ3JlZWR5OiEwfSxudW1iZXI6L1xiMHhbXGRBLUZhLWZdK1xifCg/OlxiXGQrXC4/XGQqfFxCXC5cZCspKD86W0VlXVsrLV0/XGQrKT8vLHB1bmN0dWF0aW9uOi9be31bXF0pOyxdLyxvcGVyYXRvcjovOi9nLCJib29sZWFuIjovXGIoPzp0cnVlfGZhbHNlKVxiL2ksIm51bGwiOi9cYm51bGxcYi9pfSxQcmlzbS5sYW5ndWFnZXMuanNvbnA9UHJpc20ubGFuZ3VhZ2VzLmpzb247Ci8vIHNxbApQcmlzbS5sYW5ndWFnZXMuc3FsPXtjb21tZW50OntwYXR0ZXJuOi8oXnxbXlxcXSkoPzpcL1wqW1xzXFNdKj9cKlwvfCg/Oi0tfFwvXC98IykuKikvLGxvb2tiZWhpbmQ6ITB9LHN0cmluZzp7cGF0dGVybjovKF58W15AXFxdKSgifCcpKD86XFxbXHNcU118KD8hXDIpW15cXF0pKlwyLyxncmVlZHk6ITAsbG9va2JlaGluZDohMH0sdmFyaWFibGU6L0BbXHcuJF0rfEAoWyInYF0pKD86XFxbXHNcU118KD8hXDEpW15cXF0pK1wxLywiZnVuY3Rpb24iOi9cYig/OkFWR3xDT1VOVHxGSVJTVHxGT1JNQVR8TEFTVHxMQ0FTRXxMRU58TUFYfE1JRHxNSU58TU9EfE5PV3xST1VORHxTVU18VUNBU0UpKD89XHMqXCgpL2ksa2V5d29yZDovXGIoPzpBQ1RJT058QUREfEFGVEVSfEFMR09SSVRITXxBTEx8QUxURVJ8QU5BTFlaRXxBTll8QVBQTFl8QVN8QVNDfEFVVEhPUklaQVRJT058QVVUT19JTkNSRU1FTlR8QkFDS1VQfEJEQnxCRUdJTnxCRVJLRUxFWURCfEJJR0lOVHxCSU5BUll8QklUfEJMT0J8Qk9PTHxCT09MRUFOfEJSRUFLfEJST1dTRXxCVFJFRXxCVUxLfEJZfENBTEx8Q0FTQ0FERUQ/fENBU0V8Q0hBSU58Q0hBUig/OkFDVEVSfFNFVCk/fENIRUNLKD86UE9JTlQpP3xDTE9TRXxDTFVTVEVSRUR8Q09BTEVTQ0V8Q09MTEFURXxDT0xVTU5TP3xDT01NRU5UfENPTU1JVCg/OlRFRCk/fENPTVBVVEV8Q09OTkVDVHxDT05TSVNURU5UfENPTlNUUkFJTlR8Q09OVEFJTlMoPzpUQUJMRSk/fENPTlRJTlVFfENPTlZFUlR8Q1JFQVRFfENST1NTfENVUlJFTlQoPzpfREFURXxfVElNRXxfVElNRVNUQU1QfF9VU0VSKT98Q1VSU09SfENZQ0xFfERBVEEoPzpCQVNFUz8pP3xEQVRFKD86VElNRSk/fERBWXxEQkNDfERFQUxMT0NBVEV8REVDfERFQ0lNQUx8REVDTEFSRXxERUZBVUxUfERFRklORVJ8REVMQVlFRHxERUxFVEV8REVMSU1JVEVSUz98REVOWXxERVNDfERFU0NSSUJFfERFVEVSTUlOSVNUSUN8RElTQUJMRXxESVNDQVJEfERJU0t8RElTVElOQ1R8RElTVElOQ1RST1d8RElTVFJJQlVURUR8RE98RE9VQkxFfERST1B8RFVNTVl8RFVNUCg/OkZJTEUpP3xEVVBMSUNBVEV8RUxTRSg/OklGKT98RU5BQkxFfEVOQ0xPU0VEfEVORHxFTkdJTkV8RU5VTXxFUlJMVkx8RVJST1JTfEVTQ0FQRUQ/fEVYQ0VQVHxFWEVDKD86VVRFKT98RVhJU1RTfEVYSVR8RVhQTEFJTnxFWFRFTkRFRHxGRVRDSHxGSUVMRFN8RklMRXxGSUxMRkFDVE9SfEZJUlNUfEZJWEVEfEZMT0FUfEZPTExPV0lOR3xGT1IoPzogRUFDSCBST1cpP3xGT1JDRXxGT1JFSUdOfEZSRUVURVhUKD86VEFCTEUpP3xGUk9NfEZVTEx8RlVOQ1RJT058R0VPTUVUUlkoPzpDT0xMRUNUSU9OKT98R0xPQkFMfEdPVE98R1JBTlR8R1JPVVB8SEFORExFUnxIQVNIfEhBVklOR3xIT0xETE9DS3xIT1VSfElERU5USVRZKD86X0lOU0VSVHxDT0wpP3xJRnxJR05PUkV8SU1QT1JUfElOREVYfElORklMRXxJTk5FUnxJTk5PREJ8SU5PVVR8SU5TRVJUfElOVHxJTlRFR0VSfElOVEVSU0VDVHxJTlRFUlZBTHxJTlRPfElOVk9LRVJ8SVNPTEFUSU9OfEpPSU58S0VZUz98S0lMTHxMQU5HVUFHRXxMQVNUfExFRlR8TEVWRUx8TElNSVR8TElORU5PfExJTkVTfExJTkVTVFJJTkd8TE9BRHxMT0NBTHxMT0NLfExPTkcoPzpCTE9CfFRFWFQpfE1BVENIKD86RUQpP3xNRURJVU0oPzpCTE9CfElOVHxURVhUKXxNRVJHRXxNSURETEVJTlR8TUlOVVRFfE1PREV8TU9ESUZJRVN8TU9ESUZZfE1PTlRIfE1VTFRJKD86TElORVNUUklOR3xQT0lOVHxQT0xZR09OKXxOQVRJT05BTHxOQVRVUkFMfE5DSEFSfE5FWFR8Tk98Tk9OQ0xVU1RFUkVEfE5VTExJRnxOVU1FUklDfE9GRj98T0ZGU0VUUz98T058T1BFTig/OkRBVEFTT1VSQ0V8UVVFUll8Uk9XU0VUKT98T1BUSU1JWkV8T1BUSU9OKD86QUxMWSk/fE9SREVSfE9VVCg/OkVSfEZJTEUpP3xPVkVSfFBBUlRJQUx8UEFSVElUSU9OfFBFUkNFTlR8UElWT1R8UExBTnxQT0lOVHxQT0xZR09OfFBSRUNFRElOR3xQUkVDSVNJT058UFJFVnxQUklNQVJZfFBSSU5UfFBSSVZJTEVHRVN8UFJPQyg/OkVEVVJFKT98UFVCTElDfFBVUkdFfFFVSUNLfFJBSVNFUlJPUnxSRUFEUz98UkVBTHxSRUNPTkZJR1VSRXxSRUZFUkVOQ0VTfFJFTEVBU0V8UkVOQU1FfFJFUEVBVEFCTEV8UkVQTEFDRXxSRVBMSUNBVElPTnxSRVFVSVJFfFJFU1RPUkV8UkVTVFJJQ1R8UkVUVVJOUz98UkVWT0tFfFJJR0hUfFJPTExCQUNLfFJPVVRJTkV8Uk9XKD86Q09VTlR8R1VJRENPTHxTKT98UlRSRUV8UlVMRXxTQVZFKD86UE9JTlQpP3xTQ0hFTUF8U0VDT05EfFNFTEVDVHxTRVJJQUwoPzpJWkFCTEUpP3xTRVNTSU9OKD86X1VTRVIpP3xTRVQoPzpVU0VSKT98U0hBUkV8U0hPV3xTSFVURE9XTnxTSU1QTEV8U01BTExJTlR8U05BUFNIT1R8U09NRXxTT05BTUV8U1FMfFNUQVJUKD86SU5HKT98U1RBVElTVElDU3xTVEFUVVN8U1RSSVBFRHxTWVNURU1fVVNFUnxUQUJMRVM/fFRBQkxFU1BBQ0V8VEVNUCg/Ok9SQVJZfFRBQkxFKT98VEVSTUlOQVRFRHxURVhUKD86U0laRSk/fFRIRU58VElNRSg/OlNUQU1QKT98VElOWSg/OkJMT0J8SU5UfFRFWFQpfFRPUD98VFJBTig/OlNBQ1RJT05TPyk/fFRSSUdHRVJ8VFJVTkNBVEV8VFNFUVVBTHxUWVBFUz98VU5CT1VOREVEfFVOQ09NTUlUVEVEfFVOREVGSU5FRHxVTklPTnxVTklRVUV8VU5QSVZPVHxVTlNJR05FRHxVUERBVEUoPzpURVhUKT98VVNBR0V8VVNFfFVTRVJ8VVNJTkd8VkFMVUVTP3xWQVIoPzpCSU5BUll8Q0hBUnxDSEFSQUNURVJ8WUlORyl8VklFV3xXQUlURk9SfFdBUk5JTkdTfFdIRU58V0hFUkV8V0hJTEV8V0lUSCg/OiBST0xMVVB8SU4pP3xXT1JLfFdSSVRFKD86VEVYVCk/fFlFQVIpXGIvaSwiYm9vbGVhbiI6L1xiKD86VFJVRXxGQUxTRXxOVUxMKVxiL2ksbnVtYmVyOi9cYjB4W1xkYS1mXStcYnxcYlxkK1wuP1xkKnxcQlwuXGQrXGIvaSxvcGVyYXRvcjovWy0rKlwvPSVefl18JiY/fFx8XHw/fCE9P3w8KD86PT4/fDx8Pik/fD5bPj1dP3xcYig/OkFORHxCRVRXRUVOfElOfExJS0V8Tk9UfE9SfElTfERJVnxSRUdFWFB8UkxJS0V8U09VTkRTIExJS0V8WE9SKVxiL2kscHVuY3R1YXRpb246L1s7W1xdKClgLC5dL307Ci8vIGx1YQpQcmlzbS5sYW5ndWFnZXMubHVhPXtjb21tZW50Oi9eIyEuK3wtLSg/OlxbKD0qKVxbW1xzXFNdKj9cXVwxXF18LiopL20sc3RyaW5nOntwYXR0ZXJuOi8oWyInXSkoPzooPyFcMSlbXlxcXHJcbl18XFx6KD86XHJcbnxccyl8XFwoPzpcclxufFtcc1xTXSkpKlwxfFxbKD0qKVxbW1xzXFNdKj9cXVwyXF0vLGdyZWVkeTohMH0sbnVtYmVyOi9cYjB4W2EtZlxkXStcLj9bYS1mXGRdKig/OnBbKy1dP1xkKyk/XGJ8XGJcZCsoPzpcLlxCfFwuP1xkKig/OmVbKy1dP1xkKyk/XGIpfFxCXC5cZCsoPzplWystXT9cZCspP1xiL2ksa2V5d29yZDovXGIoPzphbmR8YnJlYWt8ZG98ZWxzZXxlbHNlaWZ8ZW5kfGZhbHNlfGZvcnxmdW5jdGlvbnxnb3RvfGlmfGlufGxvY2FsfG5pbHxub3R8b3J8cmVwZWF0fHJldHVybnx0aGVufHRydWV8dW50aWx8d2hpbGUpXGIvLCJmdW5jdGlvbiI6Lyg/IVxkKVx3Kyg/PVxzKig/Olsoe10pKS8sb3BlcmF0b3I6Wy9bLSsqJV4mfCNdfFwvXC8/fDxbPD1dP3w+Wz49XT98Wz1+XT0/Lyx7cGF0dGVybjovKF58W14uXSlcLlwuKD8hXC4pLyxsb29rYmVoaW5kOiEwfV0scHVuY3R1YXRpb246L1tcW1xdKCl7fSw7XXxcLit8OisvfTsKLy8ga290bGluCiFmdW5jdGlvbihuKXtuLmxhbmd1YWdlcy5rb3RsaW49bi5sYW5ndWFnZXMuZXh0ZW5kKCJjbGlrZSIse2tleXdvcmQ6e3BhdHRlcm46LyhefFteLl0pXGIoPzphYnN0cmFjdHxhbm5vdGF0aW9ufGFzfGJyZWFrfGJ5fGNhdGNofGNsYXNzfGNvbXBhbmlvbnxjb25zdHxjb25zdHJ1Y3Rvcnxjb250aW51ZXxjcm9zc2lubGluZXxkYXRhfGRvfGVsc2V8ZW51bXxmaW5hbHxmaW5hbGx5fGZvcnxmdW58Z2V0fGlmfGltcG9ydHxpbnxpbml0fGlubGluZXxpbm5lcnxpbnRlcmZhY2V8aW50ZXJuYWx8aXN8bGF0ZWluaXR8bm9pbmxpbmV8bnVsbHxvYmplY3R8b3BlbnxvdXR8b3ZlcnJpZGV8cGFja2FnZXxwcml2YXRlfHByb3RlY3RlZHxwdWJsaWN8cmVpZmllZHxyZXR1cm58c2VhbGVkfHNldHxzdXBlcnx0YWlscmVjfHRoaXN8dGhyb3d8dG98dHJ5fHZhbHx2YXJ8d2hlbnx3aGVyZXx3aGlsZSlcYi8sbG9va2JlaGluZDohMH0sImZ1bmN0aW9uIjpbL1x3Kyg/PVxzKlwoKS8se3BhdHRlcm46LyhcLilcdysoPz1ccypceykvLGxvb2tiZWhpbmQ6ITB9XSxudW1iZXI6L1xiKD86MFtieF1bXGRhLWZBLUZdK3xcZCsoPzpcLlxkKyk/KD86ZVsrLV0/XGQrKT9bZkZMXT8pXGIvLG9wZXJhdG9yOi9cK1srPV0/fC1bLT0+XT98PT0/PT98ISg/OiF8PT0/KT98W1wvKiU8Pl09P3xbPzpdOj98XC5cLnwmJnxcfFx8fFxiKD86YW5kfGludnxvcnxzaGx8c2hyfHVzaHJ8eG9yKVxiL30pLGRlbGV0ZSBuLmxhbmd1YWdlcy5rb3RsaW5bImNsYXNzLW5hbWUiXSxuLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoImtvdGxpbiIsInN0cmluZyIseyJyYXctc3RyaW5nIjp7cGF0dGVybjovKCIiInwnJycpW1xzXFNdKj9cMS8sYWxpYXM6InN0cmluZyJ9fSksbi5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKCJrb3RsaW4iLCJrZXl3b3JkIix7YW5ub3RhdGlvbjp7cGF0dGVybjovXEJAKD86XHcrOik/KD86W0EtWl1cdyp8XFtbXlxdXStcXSkvLGFsaWFzOiJidWlsdGluIn19KSxuLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoImtvdGxpbiIsImZ1bmN0aW9uIix7bGFiZWw6e3BhdHRlcm46L1x3K0B8QFx3Ky8sYWxpYXM6InN5bWJvbCJ9fSk7dmFyIGU9W3twYXR0ZXJuOi9cJFx7W159XStcfS8saW5zaWRlOntkZWxpbWl0ZXI6e3BhdHRlcm46L15cJFx7fFx9JC8sYWxpYXM6InZhcmlhYmxlIn0scmVzdDpuLmxhbmd1YWdlcy5rb3RsaW59fSx7cGF0dGVybjovXCRcdysvLGFsaWFzOiJ2YXJpYWJsZSJ9XTtuLmxhbmd1YWdlcy5rb3RsaW4uc3RyaW5nLmluc2lkZT1uLmxhbmd1YWdlcy5rb3RsaW5bInJhdy1zdHJpbmciXS5pbnNpZGU9e2ludGVycG9sYXRpb246ZX19KFByaXNtKTsKLy8geWFtbApQcmlzbS5sYW5ndWFnZXMueWFtbD17c2NhbGFyOntwYXR0ZXJuOi8oW1wtOl1ccyooPzohW15cc10rKT9bIFx0XSpbfD5dKVsgXHRdKig/OigoPzpccj9cbnxccilbIFx0XSspW15cclxuXSsoPzpcMlteXHJcbl0rKSopLyxsb29rYmVoaW5kOiEwLGFsaWFzOiJzdHJpbmcifSxjb21tZW50Oi8jLiovLGtleTp7cGF0dGVybjovKFxzKig/Ol58WzpcLSxbe1xyXG4/XSlbIFx0XSooPzohW15cc10rKT9bIFx0XSopW15cclxue1tcXX0sI1xzXSs/KD89XHMqOlxzKS8sbG9va2JlaGluZDohMCxhbGlhczoiYXRydWxlIn0sZGlyZWN0aXZlOntwYXR0ZXJuOi8oXlsgXHRdKiklLisvbSxsb29rYmVoaW5kOiEwLGFsaWFzOiJpbXBvcnRhbnQifSxkYXRldGltZTp7cGF0dGVybjovKFs6XC0sW3tdXHMqKD86IVteXHNdKyk/WyBcdF0qKSg/OlxkezR9LVxkXGQ/LVxkXGQ/KD86W3RUXXxbIFx0XSspXGRcZD86XGR7Mn06XGR7Mn0oPzpcLlxkKik/WyBcdF0qKD86WnxbLStdXGRcZD8oPzo6XGR7Mn0pPyk/fFxkezR9LVxkezJ9LVxkezJ9fFxkXGQ/OlxkezJ9KD86OlxkezJ9KD86XC5cZCopPyk/KSg/PVsgXHRdKig/OiR8LHxdfH0pKS9tLGxvb2tiZWhpbmQ6ITAsYWxpYXM6Im51bWJlciJ9LCJib29sZWFuIjp7cGF0dGVybjovKFs6XC0sW3tdXHMqKD86IVteXHNdKyk/WyBcdF0qKSg/OnRydWV8ZmFsc2UpWyBcdF0qKD89JHwsfF18fSkvaW0sbG9va2JlaGluZDohMCxhbGlhczoiaW1wb3J0YW50In0sIm51bGwiOntwYXR0ZXJuOi8oWzpcLSxbe11ccyooPzohW15cc10rKT9bIFx0XSopKD86bnVsbHx+KVsgXHRdKig/PSR8LHxdfH0pL2ltLGxvb2tiZWhpbmQ6ITAsYWxpYXM6ImltcG9ydGFudCJ9LHN0cmluZzp7cGF0dGVybjovKFs6XC0sW3tdXHMqKD86IVteXHNdKyk/WyBcdF0qKSgifCcpKD86KD8hXDIpW15cXFxyXG5dfFxcLikqXDIoPz1bIFx0XSooPzokfCx8XXx9KSkvbSxsb29rYmVoaW5kOiEwLGdyZWVkeTohMH0sbnVtYmVyOntwYXR0ZXJuOi8oWzpcLSxbe11ccyooPzohW15cc10rKT9bIFx0XSopWystXT8oPzoweFtcZGEtZl0rfDBvWzAtN10rfCg/OlxkK1wuP1xkKnxcLj9cZCspKD86ZVsrLV0/XGQrKT98XC5pbmZ8XC5uYW4pWyBcdF0qKD89JHwsfF18fSkvaW0sbG9va2JlaGluZDohMH0sdGFnOi8hW15cc10rLyxpbXBvcnRhbnQ6L1smKl1bXHddKy8scHVuY3R1YXRpb246Ly0tLXxbOltcXXt9XC0sfD4/XXxcLlwuXC4vfTsKLy8gZG9ja2VyClByaXNtLmxhbmd1YWdlcy5kb2NrZXI9e2tleXdvcmQ6e3BhdHRlcm46LyheXHMqKSg/OkFERHxBUkd8Q01EfENPUFl8RU5UUllQT0lOVHxFTlZ8RVhQT1NFfEZST018SEVBTFRIQ0hFQ0t8TEFCRUx8TUFJTlRBSU5FUnxPTkJVSUxEfFJVTnxTSEVMTHxTVE9QU0lHTkFMfFVTRVJ8Vk9MVU1FfFdPUktESVIpKD89XHMpL2ltLGxvb2tiZWhpbmQ6ITB9LHN0cmluZzovKCJ8JykoPzooPyFcMSlbXlxcXHJcbl18XFwoPzpcclxufFtcc1xTXSkpKlwxLyxjb21tZW50Oi8jLiovLHB1bmN0dWF0aW9uOi8tLS18XC5cLlwufFs6W1xde31cLSx8Pj9dL30sUHJpc20ubGFuZ3VhZ2VzLmRvY2tlcmZpbGU9UHJpc20ubGFuZ3VhZ2VzLmRvY2tlcjsKLy8gZGlmZgpQcmlzbS5sYW5ndWFnZXMuZGlmZj17Y29vcmQ6Wy9eKD86XCp7M318LXszfXxcK3szfSkuKiQvbSwvXkBALipAQCQvbSwvXlxkKy4qJC9tXSxkZWxldGVkOi9eWy08XS4qJC9tLGluc2VydGVkOi9eWys+XS4qJC9tLGRpZmY6e3BhdHRlcm46L14hKD8hISkuKyQvbSxhbGlhczoiaW1wb3J0YW50In19OwovLyB0eXBlc2NyaXB0ClByaXNtLmxhbmd1YWdlcy50eXBlc2NyaXB0PVByaXNtLmxhbmd1YWdlcy5leHRlbmQoImphdmFzY3JpcHQiLHtrZXl3b3JkOi9cYig/OmFzfGFzeW5jfGF3YWl0fGJyZWFrfGNhc2V8Y2F0Y2h8Y2xhc3N8Y29uc3R8Y29udGludWV8ZGVidWdnZXJ8ZGVmYXVsdHxkZWxldGV8ZG98ZWxzZXxlbnVtfGV4cG9ydHxleHRlbmRzfGZpbmFsbHl8Zm9yfGZyb218ZnVuY3Rpb258Z2V0fGlmfGltcGxlbWVudHN8aW1wb3J0fGlufGluc3RhbmNlb2Z8aW50ZXJmYWNlfGxldHxuZXd8bnVsbHxvZnxwYWNrYWdlfHByaXZhdGV8cHJvdGVjdGVkfHB1YmxpY3xyZXR1cm58c2V0fHN0YXRpY3xzdXBlcnxzd2l0Y2h8dGhpc3x0aHJvd3x0cnl8dHlwZW9mfHZhcnx2b2lkfHdoaWxlfHdpdGh8eWllbGR8bW9kdWxlfGRlY2xhcmV8Y29uc3RydWN0b3J8bmFtZXNwYWNlfGFic3RyYWN0fHJlcXVpcmV8dHlwZSlcYi8sYnVpbHRpbjovXGIoPzpzdHJpbmd8RnVuY3Rpb258YW55fG51bWJlcnxib29sZWFufEFycmF5fHN5bWJvbHxjb25zb2xlKVxiL30pLFByaXNtLmxhbmd1YWdlcy50cz1QcmlzbS5sYW5ndWFnZXMudHlwZXNjcmlwdDsKLy8gcnVzdApQcmlzbS5sYW5ndWFnZXMucnVzdD17Y29tbWVudDpbe3BhdHRlcm46LyhefFteXFxdKVwvXCpbXHNcU10qP1wqXC8vLGxvb2tiZWhpbmQ6ITB9LHtwYXR0ZXJuOi8oXnxbXlxcOl0pXC9cLy4qLyxsb29rYmVoaW5kOiEwfV0sc3RyaW5nOlt7cGF0dGVybjovYj9yKCMqKSIoPzpcXC58KD8hIlwxKVteXFxcclxuXSkqIlwxLyxncmVlZHk6ITB9LHtwYXR0ZXJuOi9iPyIoPzpcXC58W15cXFxyXG4iXSkqIi8sZ3JlZWR5OiEwfV0sImNoYXIiOntwYXR0ZXJuOi9iPycoPzpcXCg/OnhbMC03XVtcZGEtZkEtRl18dXsoPzpbXGRhLWZBLUZdXyopezEsNn18Lil8W15cXFxyXG5cdCddKScvLGFsaWFzOiJzdHJpbmcifSwibGlmZXRpbWUtYW5ub3RhdGlvbiI6e3BhdHRlcm46LydbXlxzPiddKy8sYWxpYXM6InN5bWJvbCJ9LGtleXdvcmQ6L1xiKD86YWJzdHJhY3R8YWxpZ25vZnxhc3xiZXxib3h8YnJlYWt8Y29uc3R8Y29udGludWV8Y3JhdGV8ZG98ZWxzZXxlbnVtfGV4dGVybnxmYWxzZXxmaW5hbHxmbnxmb3J8aWZ8aW1wbHxpbnxsZXR8bG9vcHxtYXRjaHxtb2R8bW92ZXxtdXR8b2Zmc2V0b2Z8b25jZXxvdmVycmlkZXxwcml2fHB1YnxwdXJlfHJlZnxyZXR1cm58c2l6ZW9mfHN0YXRpY3xzZWxmfHN0cnVjdHxzdXBlcnx0cnVlfHRyYWl0fHR5cGV8dHlwZW9mfHVuc2FmZXx1bnNpemVkfHVzZXx2aXJ0dWFsfHdoZXJlfHdoaWxlfHlpZWxkKVxiLyxhdHRyaWJ1dGU6e3BhdHRlcm46LyMhP1xbLis/XF0vLGdyZWVkeTohMCxhbGlhczoiYXR0ci1uYW1lIn0sImZ1bmN0aW9uIjpbL1x3Kyg/PVxzKlwoKS8sL1x3KyEoPz1ccypcKHxcWykvXSwibWFjcm8tcnVsZXMiOntwYXR0ZXJuOi9cdyshLyxhbGlhczoiZnVuY3Rpb24ifSxudW1iZXI6L1xiKD86MHhbXGRBLUZhLWZdKD86Xz9bXGRBLUZhLWZdKSp8MG9bMC03XSg/Ol8/WzAtN10pKnwwYlswMV0oPzpfP1swMV0pKnwoXGQoPzpfP1xkKSopP1wuP1xkKD86Xz9cZCkqKD86W0VlXVsrLV0/XGQrKT8pKD86Xz8oPzpbaXVdKD86OHwxNnwzMnw2NCk/fGYzMnxmNjQpKT9cYi8sImNsb3N1cmUtcGFyYW1zIjp7cGF0dGVybjovXHxbXnxdKlx8KD89XHMqW3stXSkvLGluc2lkZTp7cHVuY3R1YXRpb246L1t8OixdLyxvcGVyYXRvcjovWyYqXS99fSxwdW5jdHVhdGlvbjovW3t9W1xdOygpLDpdfFwuK3wtPi8sb3BlcmF0b3I6L1stKypcLyUhXl09P3w9Wz0+XT98QHwmWyY9XT98XHxbfD1dP3w8PD89P3w+Pj89Py99OwovLyBuZ2lueApQcmlzbS5sYW5ndWFnZXMubmdpbng9UHJpc20ubGFuZ3VhZ2VzLmV4dGVuZCgiY2xpa2UiLHtjb21tZW50OntwYXR0ZXJuOi8oXnxbXiJ7XFxdKSMuKi8sbG9va2JlaGluZDohMH0sa2V5d29yZDovXGIoPzpDT05URU5UX3xET0NVTUVOVF98R0FURVdBWV98SFRUUF98SFRUUFN8aWZfbm90X2VtcHR5fFBBVEhffFFVRVJZX3xSRURJUkVDVF98UkVNT1RFX3xSRVFVRVNUX3xTQ0dJfFNDUklQVF98U0VSVkVSX3xodHRwfGV2ZW50c3xhY2NlcHRfbXV0ZXh8YWNjZXB0X211dGV4X2RlbGF5fGFjY2Vzc19sb2d8YWRkX2FmdGVyX2JvZHl8YWRkX2JlZm9yZV9ib2R5fGFkZF9oZWFkZXJ8YWRkaXRpb25fdHlwZXN8YWlvfGFsaWFzfGFsbG93fGFuY2llbnRfYnJvd3NlcnxhbmNpZW50X2Jyb3dzZXJfdmFsdWV8YXV0aHxhdXRoX2Jhc2ljfGF1dGhfYmFzaWNfdXNlcl9maWxlfGF1dGhfaHR0cHxhdXRoX2h0dHBfaGVhZGVyfGF1dGhfaHR0cF90aW1lb3V0fGF1dG9pbmRleHxhdXRvaW5kZXhfZXhhY3Rfc2l6ZXxhdXRvaW5kZXhfbG9jYWx0aW1lfGJyZWFrfGNoYXJzZXR8Y2hhcnNldF9tYXB8Y2hhcnNldF90eXBlc3xjaHVua2VkX3RyYW5zZmVyX2VuY29kaW5nfGNsaWVudF9ib2R5X2J1ZmZlcl9zaXplfGNsaWVudF9ib2R5X2luX2ZpbGVfb25seXxjbGllbnRfYm9keV9pbl9zaW5nbGVfYnVmZmVyfGNsaWVudF9ib2R5X3RlbXBfcGF0aHxjbGllbnRfYm9keV90aW1lb3V0fGNsaWVudF9oZWFkZXJfYnVmZmVyX3NpemV8Y2xpZW50X2hlYWRlcl90aW1lb3V0fGNsaWVudF9tYXhfYm9keV9zaXplfGNvbm5lY3Rpb25fcG9vbF9zaXplfGNyZWF0ZV9mdWxsX3B1dF9wYXRofGRhZW1vbnxkYXZfYWNjZXNzfGRhdl9tZXRob2RzfGRlYnVnX2Nvbm5lY3Rpb258ZGVidWdfcG9pbnRzfGRlZmF1bHRfdHlwZXxkZW55fGRldnBvbGxfY2hhbmdlc3xkZXZwb2xsX2V2ZW50c3xkaXJlY3Rpb3xkaXJlY3Rpb19hbGlnbm1lbnR8ZGlzYWJsZV9zeW1saW5rc3xlbXB0eV9naWZ8ZW52fGVwb2xsX2V2ZW50c3xlcnJvcl9sb2d8ZXJyb3JfcGFnZXxleHBpcmVzfGZhc3RjZ2lfYnVmZmVyX3NpemV8ZmFzdGNnaV9idWZmZXJzfGZhc3RjZ2lfYnVzeV9idWZmZXJzX3NpemV8ZmFzdGNnaV9jYWNoZXxmYXN0Y2dpX2NhY2hlX2J5cGFzc3xmYXN0Y2dpX2NhY2hlX2tleXxmYXN0Y2dpX2NhY2hlX2xvY2t8ZmFzdGNnaV9jYWNoZV9sb2NrX3RpbWVvdXR8ZmFzdGNnaV9jYWNoZV9tZXRob2RzfGZhc3RjZ2lfY2FjaGVfbWluX3VzZXN8ZmFzdGNnaV9jYWNoZV9wYXRofGZhc3RjZ2lfY2FjaGVfcHVyZ2V8ZmFzdGNnaV9jYWNoZV91c2Vfc3RhbGV8ZmFzdGNnaV9jYWNoZV92YWxpZHxmYXN0Y2dpX2Nvbm5lY3RfdGltZW91dHxmYXN0Y2dpX2hpZGVfaGVhZGVyfGZhc3RjZ2lfaWdub3JlX2NsaWVudF9hYm9ydHxmYXN0Y2dpX2lnbm9yZV9oZWFkZXJzfGZhc3RjZ2lfaW5kZXh8ZmFzdGNnaV9pbnRlcmNlcHRfZXJyb3JzfGZhc3RjZ2lfa2VlcF9jb25ufGZhc3RjZ2lfbWF4X3RlbXBfZmlsZV9zaXplfGZhc3RjZ2lfbmV4dF91cHN0cmVhbXxmYXN0Y2dpX25vX2NhY2hlfGZhc3RjZ2lfcGFyYW18ZmFzdGNnaV9wYXNzfGZhc3RjZ2lfcGFzc19oZWFkZXJ8ZmFzdGNnaV9yZWFkX3RpbWVvdXR8ZmFzdGNnaV9yZWRpcmVjdF9lcnJvcnN8ZmFzdGNnaV9zZW5kX3RpbWVvdXR8ZmFzdGNnaV9zcGxpdF9wYXRoX2luZm98ZmFzdGNnaV9zdG9yZXxmYXN0Y2dpX3N0b3JlX2FjY2Vzc3xmYXN0Y2dpX3RlbXBfZmlsZV93cml0ZV9zaXplfGZhc3RjZ2lfdGVtcF9wYXRofGZsdnxnZW98Z2VvaXBfY2l0eXxnZW9pcF9jb3VudHJ5fGdvb2dsZV9wZXJmdG9vbHNfcHJvZmlsZXN8Z3ppcHxnemlwX2J1ZmZlcnN8Z3ppcF9jb21wX2xldmVsfGd6aXBfZGlzYWJsZXxnemlwX2h0dHBfdmVyc2lvbnxnemlwX21pbl9sZW5ndGh8Z3ppcF9wcm94aWVkfGd6aXBfc3RhdGljfGd6aXBfdHlwZXN8Z3ppcF92YXJ5fGlmfGlmX21vZGlmaWVkX3NpbmNlfGlnbm9yZV9pbnZhbGlkX2hlYWRlcnN8aW1hZ2VfZmlsdGVyfGltYWdlX2ZpbHRlcl9idWZmZXJ8aW1hZ2VfZmlsdGVyX2pwZWdfcXVhbGl0eXxpbWFnZV9maWx0ZXJfc2hhcnBlbnxpbWFnZV9maWx0ZXJfdHJhbnNwYXJlbmN5fGltYXBfY2FwYWJpbGl0aWVzfGltYXBfY2xpZW50X2J1ZmZlcnxpbmNsdWRlfGluZGV4fGludGVybmFsfGlwX2hhc2h8a2VlcGFsaXZlfGtlZXBhbGl2ZV9kaXNhYmxlfGtlZXBhbGl2ZV9yZXF1ZXN0c3xrZWVwYWxpdmVfdGltZW91dHxrcXVldWVfY2hhbmdlc3xrcXVldWVfZXZlbnRzfGxhcmdlX2NsaWVudF9oZWFkZXJfYnVmZmVyc3xsaW1pdF9jb25ufGxpbWl0X2Nvbm5fbG9nX2xldmVsfGxpbWl0X2Nvbm5fem9uZXxsaW1pdF9leGNlcHR8bGltaXRfcmF0ZXxsaW1pdF9yYXRlX2FmdGVyfGxpbWl0X3JlcXxsaW1pdF9yZXFfbG9nX2xldmVsfGxpbWl0X3JlcV96b25lfGxpbWl0X3pvbmV8bGluZ2VyaW5nX2Nsb3NlfGxpbmdlcmluZ190aW1lfGxpbmdlcmluZ190aW1lb3V0fGxpc3Rlbnxsb2NhdGlvbnxsb2NrX2ZpbGV8bG9nX2Zvcm1hdHxsb2dfZm9ybWF0X2NvbWJpbmVkfGxvZ19ub3RfZm91bmR8bG9nX3N1YnJlcXVlc3R8bWFwfG1hcF9oYXNoX2J1Y2tldF9zaXplfG1hcF9oYXNoX21heF9zaXplfG1hc3Rlcl9wcm9jZXNzfG1heF9yYW5nZXN8bWVtY2FjaGVkX2J1ZmZlcl9zaXplfG1lbWNhY2hlZF9jb25uZWN0X3RpbWVvdXR8bWVtY2FjaGVkX25leHRfdXBzdHJlYW18bWVtY2FjaGVkX3Bhc3N8bWVtY2FjaGVkX3JlYWRfdGltZW91dHxtZW1jYWNoZWRfc2VuZF90aW1lb3V0fG1lcmdlX3NsYXNoZXN8bWluX2RlbGV0ZV9kZXB0aHxtb2Rlcm5fYnJvd3Nlcnxtb2Rlcm5fYnJvd3Nlcl92YWx1ZXxtcDR8bXA0X2J1ZmZlcl9zaXplfG1wNF9tYXhfYnVmZmVyX3NpemV8bXNpZV9wYWRkaW5nfG1zaWVfcmVmcmVzaHxtdWx0aV9hY2NlcHR8b3Blbl9maWxlX2NhY2hlfG9wZW5fZmlsZV9jYWNoZV9lcnJvcnN8b3Blbl9maWxlX2NhY2hlX21pbl91c2VzfG9wZW5fZmlsZV9jYWNoZV92YWxpZHxvcGVuX2xvZ19maWxlX2NhY2hlfG9wdGltaXplX3NlcnZlcl9uYW1lc3xvdmVycmlkZV9jaGFyc2V0fHBjcmVfaml0fHBlcmx8cGVybF9tb2R1bGVzfHBlcmxfcmVxdWlyZXxwZXJsX3NldHxwaWR8cG9wM19hdXRofHBvcDNfY2FwYWJpbGl0aWVzfHBvcnRfaW5fcmVkaXJlY3R8cG9zdF9hY3Rpb258cG9zdHBvbmVfb3V0cHV0fHByb3RvY29sfHByb3h5fHByb3h5X2J1ZmZlcnxwcm94eV9idWZmZXJfc2l6ZXxwcm94eV9idWZmZXJpbmd8cHJveHlfYnVmZmVyc3xwcm94eV9idXN5X2J1ZmZlcnNfc2l6ZXxwcm94eV9jYWNoZXxwcm94eV9jYWNoZV9ieXBhc3N8cHJveHlfY2FjaGVfa2V5fHByb3h5X2NhY2hlX2xvY2t8cHJveHlfY2FjaGVfbG9ja190aW1lb3V0fHByb3h5X2NhY2hlX21ldGhvZHN8cHJveHlfY2FjaGVfbWluX3VzZXN8cHJveHlfY2FjaGVfcGF0aHxwcm94eV9jYWNoZV91c2Vfc3RhbGV8cHJveHlfY2FjaGVfdmFsaWR8cHJveHlfY29ubmVjdF90aW1lb3V0fHByb3h5X2Nvb2tpZV9kb21haW58cHJveHlfY29va2llX3BhdGh8cHJveHlfaGVhZGVyc19oYXNoX2J1Y2tldF9zaXplfHByb3h5X2hlYWRlcnNfaGFzaF9tYXhfc2l6ZXxwcm94eV9oaWRlX2hlYWRlcnxwcm94eV9odHRwX3ZlcnNpb258cHJveHlfaWdub3JlX2NsaWVudF9hYm9ydHxwcm94eV9pZ25vcmVfaGVhZGVyc3xwcm94eV9pbnRlcmNlcHRfZXJyb3JzfHByb3h5X21heF90ZW1wX2ZpbGVfc2l6ZXxwcm94eV9tZXRob2R8cHJveHlfbmV4dF91cHN0cmVhbXxwcm94eV9ub19jYWNoZXxwcm94eV9wYXNzfHByb3h5X3Bhc3NfZXJyb3JfbWVzc2FnZXxwcm94eV9wYXNzX2hlYWRlcnxwcm94eV9wYXNzX3JlcXVlc3RfYm9keXxwcm94eV9wYXNzX3JlcXVlc3RfaGVhZGVyc3xwcm94eV9yZWFkX3RpbWVvdXR8cHJveHlfcmVkaXJlY3R8cHJveHlfcmVkaXJlY3RfZXJyb3JzfHByb3h5X3NlbmRfbG93YXR8cHJveHlfc2VuZF90aW1lb3V0fHByb3h5X3NldF9ib2R5fHByb3h5X3NldF9oZWFkZXJ8cHJveHlfc3NsX3Nlc3Npb25fcmV1c2V8cHJveHlfc3RvcmV8cHJveHlfc3RvcmVfYWNjZXNzfHByb3h5X3RlbXBfZmlsZV93cml0ZV9zaXplfHByb3h5X3RlbXBfcGF0aHxwcm94eV90aW1lb3V0fHByb3h5X3Vwc3RyZWFtX2ZhaWxfdGltZW91dHxwcm94eV91cHN0cmVhbV9tYXhfZmFpbHN8cmFuZG9tX2luZGV4fHJlYWRfYWhlYWR8cmVhbF9pcF9oZWFkZXJ8cmVjdXJzaXZlX2Vycm9yX3BhZ2VzfHJlcXVlc3RfcG9vbF9zaXplfHJlc2V0X3RpbWVkb3V0X2Nvbm5lY3Rpb258cmVzb2x2ZXJ8cmVzb2x2ZXJfdGltZW91dHxyZXR1cm58cmV3cml0ZXxyb290fHJ0c2lnX292ZXJmbG93X2V2ZW50c3xydHNpZ19vdmVyZmxvd190ZXN0fHJ0c2lnX292ZXJmbG93X3RocmVzaG9sZHxydHNpZ19zaWdub3xzYXRpc2Z5fHNhdGlzZnlfYW55fHNlY3VyZV9saW5rX3NlY3JldHxzZW5kX2xvd2F0fHNlbmRfdGltZW91dHxzZW5kZmlsZXxzZW5kZmlsZV9tYXhfY2h1bmt8c2VydmVyfHNlcnZlcl9uYW1lfHNlcnZlcl9uYW1lX2luX3JlZGlyZWN0fHNlcnZlcl9uYW1lc19oYXNoX2J1Y2tldF9zaXplfHNlcnZlcl9uYW1lc19oYXNoX21heF9zaXplfHNlcnZlcl90b2tlbnN8c2V0fHNldF9yZWFsX2lwX2Zyb218c210cF9hdXRofHNtdHBfY2FwYWJpbGl0aWVzfHNvX2tlZXBhbGl2ZXxzb3VyY2VfY2hhcnNldHxzcGxpdF9jbGllbnRzfHNzaXxzc2lfc2lsZW50X2Vycm9yc3xzc2lfdHlwZXN8c3NpX3ZhbHVlX2xlbmd0aHxzc2x8c3NsX2NlcnRpZmljYXRlfHNzbF9jZXJ0aWZpY2F0ZV9rZXl8c3NsX2NpcGhlcnN8c3NsX2NsaWVudF9jZXJ0aWZpY2F0ZXxzc2xfY3JsfHNzbF9kaHBhcmFtfHNzbF9lbmdpbmV8c3NsX3ByZWZlcl9zZXJ2ZXJfY2lwaGVyc3xzc2xfcHJvdG9jb2xzfHNzbF9zZXNzaW9uX2NhY2hlfHNzbF9zZXNzaW9uX3RpbWVvdXR8c3NsX3ZlcmlmeV9jbGllbnR8c3NsX3ZlcmlmeV9kZXB0aHxzdGFydHRsc3xzdHViX3N0YXR1c3xzdWJfZmlsdGVyfHN1Yl9maWx0ZXJfb25jZXxzdWJfZmlsdGVyX3R5cGVzfHRjcF9ub2RlbGF5fHRjcF9ub3B1c2h8dGltZW91dHx0aW1lcl9yZXNvbHV0aW9ufHRyeV9maWxlc3x0eXBlc3x0eXBlc19oYXNoX2J1Y2tldF9zaXplfHR5cGVzX2hhc2hfbWF4X3NpemV8dW5kZXJzY29yZXNfaW5faGVhZGVyc3x1bmluaXRpYWxpemVkX3ZhcmlhYmxlX3dhcm58dXBzdHJlYW18dXNlfHVzZXJ8dXNlcmlkfHVzZXJpZF9kb21haW58dXNlcmlkX2V4cGlyZXN8dXNlcmlkX25hbWV8dXNlcmlkX3AzcHx1c2VyaWRfcGF0aHx1c2VyaWRfc2VydmljZXx2YWxpZF9yZWZlcmVyc3x2YXJpYWJsZXNfaGFzaF9idWNrZXRfc2l6ZXx2YXJpYWJsZXNfaGFzaF9tYXhfc2l6ZXx3b3JrZXJfY29ubmVjdGlvbnN8d29ya2VyX2NwdV9hZmZpbml0eXx3b3JrZXJfcHJpb3JpdHl8d29ya2VyX3Byb2Nlc3Nlc3x3b3JrZXJfcmxpbWl0X2NvcmV8d29ya2VyX3JsaW1pdF9ub2ZpbGV8d29ya2VyX3JsaW1pdF9zaWdwZW5kaW5nfHdvcmtpbmdfZGlyZWN0b3J5fHhjbGllbnR8eG1sX2VudGl0aWVzfHhzbHRfZW50aXRpZXN8eHNsdF9zdHlsZXNoZWV0fHhzbHRfdHlwZXMpXGIvaX0pLFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoIm5naW54Iiwia2V5d29yZCIse3ZhcmlhYmxlOi9cJFthLXpfXSsvaX0pOwovLyBuaW0KUHJpc20ubGFuZ3VhZ2VzLm5pbT17Y29tbWVudDovIy4qLyxzdHJpbmc6e3BhdHRlcm46Lyg/Oig/OlxiKD8hXGQpKD86XHd8XFx4WzgtOWEtZkEtRl1bMC05YS1mQS1GXSkrKT8oPzoiIiJbXHNcU10qPyIiIig/ISIpfCIoPzpcXFtcc1xTXXwiInxbXiJcXF0pKiIpfCcoPzpcXCg/OlxkK3x4W1xkYS1mQS1GXXsyfXwuKXxbXiddKScpLyxncmVlZHk6ITB9LG51bWJlcjovXGIoPzowW3hYb09iQl1bXGRhLWZBLUZfXSt8XGRbXGRfXSooPzooPyFcLlwuKVwuW1xkX10qKT8oPzpbZUVdWystXT9cZFtcZF9dKik/KSg/Oic/W2l1Zl1cZCopPy8sa2V5d29yZDovXGIoPzphZGRyfGFzfGFzbXxhdG9taWN8YmluZHxibG9ja3xicmVha3xjYXNlfGNhc3R8Y29uY2VwdHxjb25zdHxjb250aW51ZXxjb252ZXJ0ZXJ8ZGVmZXJ8ZGlzY2FyZHxkaXN0aW5jdHxkb3xlbGlmfGVsc2V8ZW5kfGVudW18ZXhjZXB0fGV4cG9ydHxmaW5hbGx5fGZvcnxmcm9tfGZ1bmN8Z2VuZXJpY3xpZnxpbXBvcnR8aW5jbHVkZXxpbnRlcmZhY2V8aXRlcmF0b3J8bGV0fG1hY3JvfG1ldGhvZHxtaXhpbnxuaWx8b2JqZWN0fG91dHxwcm9jfHB0cnxyYWlzZXxyZWZ8cmV0dXJufHN0YXRpY3x0ZW1wbGF0ZXx0cnl8dHVwbGV8dHlwZXx1c2luZ3x2YXJ8d2hlbnx3aGlsZXx3aXRofHdpdGhvdXR8eWllbGQpXGIvLCJmdW5jdGlvbiI6e3BhdHRlcm46Lyg/Oig/IVxkKSg/Olx3fFxceFs4LTlhLWZBLUZdWzAtOWEtZkEtRl0pK3xgW15gXHJcbl0rYClcKj8oPzpcW1teXF1dK1xdKT8oPz1ccypcKCkvLGluc2lkZTp7b3BlcmF0b3I6L1wqJC99fSxpZ25vcmU6e3BhdHRlcm46L2BbXmBcclxuXStgLyxpbnNpZGU6e3B1bmN0dWF0aW9uOi9gL319LG9wZXJhdG9yOntwYXR0ZXJuOi8oXnxbKHtcW10oPz1cLlwuKXwoPyFbKHtcW11cLikuKSg/Oig/Ols9K1wtKlwvPD5AJH4mJXwhP146XFxdfFwuXC58XC4oPyFbKX1cXV0pKSt8XGIoPzphbmR8ZGl2fG9mfG9yfGlufGlzfGlzbm90fG1vZHxub3R8bm90aW58c2hsfHNocnx4b3IpXGIpL20sbG9va2JlaGluZDohMH0scHVuY3R1YXRpb246L1soe1xbXVwufFwuWyl9XF1dfFtgKCl7fVxbXF0sOl0vfTsKLy8gaGFza2VsbApQcmlzbS5sYW5ndWFnZXMuaGFza2VsbD17Y29tbWVudDp7cGF0dGVybjovKF58W14tISMkJSorPT8mQHx+Ljo8Pl5cXFwvXSkoPzotLVteLSEjJCUqKz0/JkB8fi46PD5eXFxcL10uKnx7LVtcc1xTXSo/LX0pL20sbG9va2JlaGluZDohMH0sImNoYXIiOi8nKD86W15cXCddfFxcKD86W2FiZm5ydHZcXCInJl18XF5bQS1aQFtcXV5fXXxOVUx8U09IfFNUWHxFVFh8RU9UfEVOUXxBQ0t8QkVMfEJTfEhUfExGfFZUfEZGfENSfFNPfFNJfERMRXxEQzF8REMyfERDM3xEQzR8TkFLfFNZTnxFVEJ8Q0FOfEVNfFNVQnxFU0N8RlN8R1N8UlN8VVN8U1B8REVMfFxkK3xvWzAtN10rfHhbMC05YS1mQS1GXSspKScvLHN0cmluZzp7cGF0dGVybjovIig/OlteXFwiXXxcXCg/OlthYmZucnR2XFwiJyZdfFxeW0EtWkBbXF1eX118TlVMfFNPSHxTVFh8RVRYfEVPVHxFTlF8QUNLfEJFTHxCU3xIVHxMRnxWVHxGRnxDUnxTT3xTSXxETEV8REMxfERDMnxEQzN8REM0fE5BS3xTWU58RVRCfENBTnxFTXxTVUJ8RVNDfEZTfEdTfFJTfFVTfFNQfERFTHxcZCt8b1swLTddK3x4WzAtOWEtZkEtRl0rKXxcXFxzK1xcKSoiLyxncmVlZHk6ITB9LGtleXdvcmQ6L1xiKD86Y2FzZXxjbGFzc3xkYXRhfGRlcml2aW5nfGRvfGVsc2V8aWZ8aW58aW5maXhsfGluZml4cnxpbnN0YW5jZXxsZXR8bW9kdWxlfG5ld3R5cGV8b2Z8cHJpbWl0aXZlfHRoZW58dHlwZXx3aGVyZSlcYi8saW1wb3J0X3N0YXRlbWVudDp7cGF0dGVybjovKCg/OlxyP1xufFxyfF4pXHMqKWltcG9ydFxzKyg/OnF1YWxpZmllZFxzKyk/KD86W0EtWl1bXHcnXSopKD86XC5bQS1aXVtcdyddKikqKD86XHMrYXNccysoPzpbQS1aXVtfYS16QS1aMC05J10qKSg/OlwuW0EtWl1bXHcnXSopKik/KD86XHMraGlkaW5nXGIpPy9tLGxvb2tiZWhpbmQ6ITAsaW5zaWRlOntrZXl3b3JkOi9cYig/OmltcG9ydHxxdWFsaWZpZWR8YXN8aGlkaW5nKVxiL319LGJ1aWx0aW46L1xiKD86YWJzfGFjb3N8YWNvc2h8YWxsfGFuZHxhbnl8YXBwZW5kRmlsZXxhcHByb3hSYXRpb25hbHxhc1R5cGVPZnxhc2lufGFzaW5ofGF0YW58YXRhbjJ8YXRhbmh8YmFzaWNJT1J1bnxicmVha3xjYXRjaHxjZWlsaW5nfGNocnxjb21wYXJlfGNvbmNhdHxjb25jYXRNYXB8Y29uc3R8Y29zfGNvc2h8Y3Vycnl8Y3ljbGV8ZGVjb2RlRmxvYXR8ZGVub21pbmF0b3J8ZGlnaXRUb0ludHxkaXZ8ZGl2TW9kfGRyb3B8ZHJvcFdoaWxlfGVpdGhlcnxlbGVtfGVuY29kZUZsb2F0fGVudW1Gcm9tfGVudW1Gcm9tVGhlbnxlbnVtRnJvbVRoZW5Ub3xlbnVtRnJvbVRvfGVycm9yfGV2ZW58ZXhwfGV4cG9uZW50fGZhaWx8ZmlsdGVyfGZsaXB8ZmxvYXREaWdpdHN8ZmxvYXRSYWRpeHxmbG9hdFJhbmdlfGZsb29yfGZtYXB8Zm9sZGx8Zm9sZGwxfGZvbGRyfGZvbGRyMXxmcm9tRG91YmxlfGZyb21FbnVtfGZyb21JbnR8ZnJvbUludGVnZXJ8ZnJvbUludGVncmFsfGZyb21SYXRpb25hbHxmc3R8Z2NkfGdldENoYXJ8Z2V0Q29udGVudHN8Z2V0TGluZXxncm91cHxoZWFkfGlkfGluUmFuZ2V8aW5kZXh8aW5pdHxpbnRUb0RpZ2l0fGludGVyYWN0fGlvRXJyb3J8aXNBbHBoYXxpc0FscGhhTnVtfGlzQXNjaWl8aXNDb250cm9sfGlzRGVub3JtYWxpemVkfGlzRGlnaXR8aXNIZXhEaWdpdHxpc0lFRUV8aXNJbmZpbml0ZXxpc0xvd2VyfGlzTmFOfGlzTmVnYXRpdmVaZXJvfGlzT2N0RGlnaXR8aXNQcmludHxpc1NwYWNlfGlzVXBwZXJ8aXRlcmF0ZXxsYXN0fGxjbXxsZW5ndGh8bGV4fGxleERpZ2l0c3xsZXhMaXRDaGFyfGxpbmVzfGxvZ3xsb2dCYXNlfGxvb2t1cHxtYXB8bWFwTXxtYXBNX3xtYXh8bWF4Qm91bmR8bWF4aW11bXxtYXliZXxtaW58bWluQm91bmR8bWluaW11bXxtb2R8bmVnYXRlfG5vdHxub3RFbGVtfG51bGx8bnVtZXJhdG9yfG9kZHxvcnxvcmR8b3RoZXJ3aXNlfHBhY2t8cGl8cHJlZHxwcmltRXhpdFdpdGh8cHJpbnR8cHJvZHVjdHxwcm9wZXJGcmFjdGlvbnxwdXRDaGFyfHB1dFN0cnxwdXRTdHJMbnxxdW90fHF1b3RSZW18cmFuZ2V8cmFuZ2VTaXplfHJlYWR8cmVhZERlY3xyZWFkRmlsZXxyZWFkRmxvYXR8cmVhZEhleHxyZWFkSU98cmVhZEludHxyZWFkTGlzdHxyZWFkTGl0Q2hhcnxyZWFkTG58cmVhZE9jdHxyZWFkUGFyZW58cmVhZFNpZ25lZHxyZWFkc3xyZWFkc1ByZWN8cmVhbFRvRnJhY3xyZWNpcHxyZW18cmVwZWF0fHJlcGxpY2F0ZXxyZXR1cm58cmV2ZXJzZXxyb3VuZHxzY2FsZUZsb2F0fHNjYW5sfHNjYW5sMXxzY2FucnxzY2FucjF8c2VxfHNlcXVlbmNlfHNlcXVlbmNlX3xzaG93fHNob3dDaGFyfHNob3dJbnR8c2hvd0xpc3R8c2hvd0xpdENoYXJ8c2hvd1BhcmVufHNob3dTaWduZWR8c2hvd1N0cmluZ3xzaG93c3xzaG93c1ByZWN8c2lnbmlmaWNhbmR8c2lnbnVtfHNpbnxzaW5ofHNuZHxzb3J0fHNwYW58c3BsaXRBdHxzcXJ0fHN1YnRyYWN0fHN1Y2N8c3VtfHRhaWx8dGFrZXx0YWtlV2hpbGV8dGFufHRhbmh8dGhyZWFkVG9JT1Jlc3VsdHx0b0VudW18dG9JbnR8dG9JbnRlZ2VyfHRvTG93ZXJ8dG9SYXRpb25hbHx0b1VwcGVyfHRydW5jYXRlfHVuY3Vycnl8dW5kZWZpbmVkfHVubGluZXN8dW50aWx8dW53b3Jkc3x1bnppcHx1bnppcDN8dXNlckVycm9yfHdvcmRzfHdyaXRlRmlsZXx6aXB8emlwM3x6aXBXaXRofHppcFdpdGgzKVxiLyxudW1iZXI6L1xiKD86XGQrKD86XC5cZCspPyg/OmVbKy1dP1xkKyk/fDBvWzAtN10rfDB4WzAtOWEtZl0rKVxiL2ksb3BlcmF0b3I6L1xzXC5cc3xbLSEjJCUqKz0/JkB8fi46PD5eXFxcL10qXC5bLSEjJCUqKz0/JkB8fi46PD5eXFxcL10rfFstISMkJSorPT8mQHx+Ljo8Pl5cXFwvXStcLlstISMkJSorPT8mQHx+Ljo8Pl5cXFwvXSp8Wy0hIyQlKis9PyZAfH46PD5eXFxcL10rfGAoW0EtWl1bXHcnXSpcLikqW19hLXpdW1x3J10qYC8saHZhcmlhYmxlOi9cYig/OltBLVpdW1x3J10qXC4pKltfYS16XVtcdyddKlxiLyxjb25zdGFudDovXGIoPzpbQS1aXVtcdyddKlwuKSpbQS1aXVtcdyddKlxiLyxwdW5jdHVhdGlvbjovW3t9W1xdOygpLC46XS99Owo=
`.trim();
js_prism = atob(js_prism);

let css_prism_dark = `
code[class*=language-],pre[class*=language-]{color:#fff;background:0 0;font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;text-align:left;text-shadow:0 -.1em .2em #000;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}:not(pre)>code[class*=language-],pre[class*=language-]{background:#141414}pre[class*=language-]{border-radius:.5em;border:.3em solid #545454;box-shadow:1px 1px .5em #000 inset;margin:.5em 0;overflow:auto;padding:1em}pre[class*=language-]::-moz-selection{background:#27292a}pre[class*=language-]::selection{background:#27292a}code[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,pre[class*=language-]::-moz-selection{text-shadow:none;background:hsla(0,0%,93%,.15)}code[class*=language-] ::selection,code[class*=language-]::selection,pre[class*=language-] ::selection,pre[class*=language-]::selection{text-shadow:none;background:hsla(0,0%,93%,.15)}:not(pre)>code[class*=language-]{border-radius:.3em;border:.13em solid #545454;box-shadow:1px 1px .3em -.1em #000 inset;padding:.15em .2em .05em;white-space:normal}.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#777}.token.punctuation{opacity:.7}.namespace{opacity:.7}.token.boolean,.token.deleted,.token.number,.token.tag{color:#ce6849}.token.builtin,.token.constant,.token.keyword,.token.property,.token.selector,.token.symbol{color:#f9ed99}.language-css .token.string,.style .token.string,.token.attr-name,.token.attr-value,.token.char,.token.entity,.token.inserted,.token.operator,.token.string,.token.url,.token.variable{color:#909e6a}.token.atrule{color:#7385a5}.token.important,.token.regex{color:#e8c062}.token.bold,.token.important{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}pre[data-line]{padding:1em 0 1em 3em;position:relative}.language-markup .token.attr-name,.language-markup .token.punctuation,.language-markup .token.tag{color:#ac885c}.token{position:relative;z-index:1}.line-highlight{background:hsla(0,0%,33%,.25);background:linear-gradient(to right,hsla(0,0%,33%,.1) 70%,hsla(0,0%,33%,0));border-bottom:1px dashed #545454;border-top:1px dashed #545454;left:0;line-height:inherit;margin-top:.75em;padding:inherit 0;pointer-events:none;position:absolute;right:0;white-space:pre;z-index:0}.line-highlight:before,.line-highlight[data-end]:after{background-color:#8693a6;border-radius:999px;box-shadow:0 1px #fff;color:#f4f1ef;content:attr(data-start);font:bold 65%/1.5 sans-serif;left:.6em;min-width:1em;padding:0 .5em;position:absolute;text-align:center;text-shadow:none;top:.4em;vertical-align:.3em}.line-highlight[data-end]:after{bottom:.4em;content:attr(data-end);top:auto}

/* custom */
pre[class*="language-"] {
  border: 0;
  box-shadow: none;
}
.token .string {
  color: #21bb00;
}
`;
let css_prism_light = `
code[class*=language-],pre[class*=language-]{color:#000;background:0 0;text-shadow:0 1px #fff;font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}code[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,pre[class*=language-]::-moz-selection{text-shadow:none;background:#b3d4fc}code[class*=language-] ::selection,code[class*=language-]::selection,pre[class*=language-] ::selection,pre[class*=language-]::selection{text-shadow:none;background:#b3d4fc}@media print{code[class*=language-],pre[class*=language-]{text-shadow:none}}pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto}:not(pre)>code[class*=language-],pre[class*=language-]{background:#f5f2f0}:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em;white-space:normal}.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#708090}.token.punctuation{color:#999}.namespace{opacity:.7}.token.boolean,.token.constant,.token.deleted,.token.number,.token.property,.token.symbol,.token.tag{color:#905}.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string{color:#690}.language-css .token.string,.style .token.string,.token.entity,.token.operator,.token.url{color:#a67f59;background:hsla(0,0%,100%,.5)}.token.atrule,.token.attr-value,.token.keyword{color:#07a}.token.class-name,.token.function{color:#dd4a68}.token.important,.token.regex,.token.variable{color:#e90}.token.bold,.token.important{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}

/* custom */
.token.important, .token.regex, .token.variable {
  color: #09261f;
}
.token.attr-name, .token.builtin, .token.char, .token.inserted, .token.selector, .token.string {
  color: #348815;
}
`;


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
    if(!fileMayRead(this.path))
        return _err(`ignoring ${this.path} - file not readable`);

    let content = readFile(this.path);
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

    this.date_str = dateStr(this.date);
    this.data = to_html(this.markdown);
    this.slug = `/${this.date_str}/${slugify(this.title)}.html`;
}

MarkdownItem.prototype.save = function() {
    let content = `+++
title: ${this.title}
date: ${dateStr(this.date)}
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

    this.ext = mimeGuess(this.slug);
    this.mime = "text/plain";

    if(mimeMap.hasOwnProperty(this.ext))
        this.mime = mimeMap[this.ext];

    this.data = null;
}

StaticFile.prototype.load = function() {
    let path = `${G.cwd}${this.slug}`;
    this.data = readFile(path); // @TODO: async
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
    let tmpl = readFile(path);

    this._data[name] = tmpl;
    return tmpl;
}

Theme.prototype.render = function(item) {
    const tmpl_base = this.tmpl('base.html');
    let tmpl = this.tmpl(item.is_article ? "article.html" : "page.html");
    tmpl = tmpl_base.replace("{{content}}", tmpl);

    const data = mergeDicts(G, {
        "title": item.title,
        "item": item
    });

    const html = mustache(tmpl, data);
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
    for (let theme_name in default_themes) {
        let obj = default_themes[theme_name];
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

    let templates = walk(fp);
    for(let _path in templates) {
        _path = templates[_path];
        _path = normalizePathFast(_path);

        if(!fs.lstatSync(_path).isDirectory())
            continue;

        const theme_name = basename(_path);
        if(theme_name === "_admin")
            continue;

        let bad = false;
        let data = {};

        const required = ['article.html', 'base.html', 'index.html', 'page.html']
        const theme_files = walk(_path).join(" ");

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
    if(!fileMayRead(this.content_dir)) {
        G.req.warn(`Content directory '${this.content_dir}' did not exist, creating.`);
        fs.mkdirSync(this.content_dir);
        fs.mkdirSync(`${this.content_dir}/pages/`);
        fs.mkdirSync(`${this.content_dir}/posts/`);
    }

    let paths = walk(this.content_dir, true);
    let count_markdown = 0;

    paths.forEach(_path => {
        _path = normalizePathFast(_path);

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
    articles = arr_date_sort(articles);

    let data = mergeDicts(G, {
        "title": "Overview",
        "articles": articles
    });

    const tmpl = tmpl_base.replace("{{content}}", tmpl_index);
    const html = mustache(tmpl, data);

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
        "/vendored/prismjs.js": js_prism,
        "/vendored/prismjs-light.css": css_prism_light,
        "/vendored/prismjs-dark.css": css_prism_dark,
    }

    if(vendored.hasOwnProperty(r.uri)) {
        let mime = mimeGuess(r.uri);
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
            G.req.headersOut['Set-Cookie'] = `auth=${sha256Hash(req_obj.login)}; Path=/; HttpOnly`;
        return G.req.return(200, JSON.stringify({ 'result': valid }));
    }

    if(!G.auth)
        return redirect(r, '/admin/login');

    // Markdown -> HTML API
    if(r.uri === '/admin/api/md2html' && r.method == 'POST') {
        req_obj = JSON.parse(r.requestText);
        if(!req_obj.hasOwnProperty('markdown'))
            throw 'missing key markdown';
        let html = to_html(req_obj.markdown);
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
        if(obj.trim() === "")
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
            obj.slug = slugify(obj.title);
            let path = normalizePathFast(`${G.db.content_dir}/posts/${obj.slug}`);
            path = path.replace(".html.md", ".md");
            item = new MarkdownItem(path);
        }

        item.title = obj.title;
        item.slug = obj.slug;
        item.author = obj.author;
        item.markdown = obj.markdown;
        item.date = new Date(`${obj.date.trim()}T00:00`);
        item.date_str = dateStr(item.date);
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
    const tmpl_base = readFile(`${G.cwd}templates/_admin/base.html`);

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
        tmpl = readFile(`${G.cwd}templates/_admin/login.html`);
        tmpl = tmpl_base.replace("{{content}}", tmpl);
        tmpl = mustache(tmpl, mergeDicts(G, {
            "html_title": "Login"
        }));
        return G.req.return(200, tmpl);
    }

    if(!G.auth) {
        return redirect(r, '/admin/login');
    }

    if(r.uri === "/admin/new") {
        tmpl = readFile(`${G.cwd}templates/_admin/post.html`);
        tmpl = tmpl_base.replace("{{content}}", tmpl);
        tmpl = mustache(tmpl, mergeDicts(G, {
            "html_title": "New article",
            "date": G.now,
            "title": "New article"
        }));
        return G.req.return(200, tmpl);
    }

    let item = G.db.by_uri(r.uri.substring(6));
    if(!item)
        return G.req.return(200, "nope");

    tmpl = readFile(`${G.cwd}templates/_admin/post.html`);
    tmpl = tmpl_base.replace("{{content}}", tmpl);

    const data = mergeDicts(G, {
        "html_title": "Edit",
        "date": item.date_str,
        "item": item
    });

    G.req.warn('now: ' + data.now);
    const html = mustache(tmpl, data);
    return G.req.return(200, html);
}

function is_logged_in(r) {
    let sha256sum = getAuthCookie(r);
    if(!sha256sum)
        return false;
    if(sha256sum !== sha256Hash(G.admin_secret))
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
    G['now'] = dateStr(new Date());
    G['auth'] = is_logged_in(r);
}


export default { router }
