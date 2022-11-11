"use strict";

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
        markdown = markdown.replace(rules[key].regex, rules[key].replacer);
    });
    return markdown.trim();
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

export default { to_html }
