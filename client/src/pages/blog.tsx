import { Grid, Typography } from "@material-ui/core";
import React from "react";
// import remark from "remark";
// import remarkHtml from 'remark-html';
// import highlight from 'remark-highlight.js';
// import unified from 'unified';
import unified from 'unified';
import { staticPropsHandler } from "../helpers/static-props-handler.helper";

import remark from 'remark';
import prism from 'remark-prism'
import html from 'remark-html';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IBlogProps {
  blog: string;
}

function Blog(props: IBlogProps): JSX.Element {
  const { blog } = props;
  return (
    <div>
      <Grid container>
        <Grid className="centered" item xs={12}>
          <Typography variant="h1" component="h1"><a href="https://github.com/NickKelly1/example-gql-ts-accounts">Coming soon!</a></Typography>
        </Grid>
        <Grid className="centered" item xs={12}>
          <Typography variant="body2">
            <div dangerouslySetInnerHTML={{ __html: blog }} />
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

async function getMd(): Promise<string> {
  const markdown = [
    '# header1'
    ,'## header2'
    ,'### header3'
    ,'#### header4'
    ,'##### header5'
    ,''
    ,'body'
    ,'body'
    ,'body'
    ,''
    ,'```javascript'
    ,'const testing = 123;'
    ,'console.log(testing);'
    ,'class Testing {'
    ,'  constructor() {'
    ,'   this.test = \'hi\';'
    ,'  }'
    ,'}'
    ,'const hello = {'
    ,'  world: 5,'
    ,'  fn() { this.testing = () => "also" },'
    ,'  fn2: () => `${testing}`,'
    ,'  [Symbol.name]: Testing.constructor.name,'
    ,'}'
    ,''
    ,'if (Testing === true) {'
    ,'  console.log(\'Whoa... class = true?\')'
    ,'} else {'
    ,'  console.log(\'else fired...\');'
    ,'}'
    ,''
    ,'```'
    ,''
    ,'- list item 1'
    ,'- list item 2'
    ,'- list item 3'
  ].join('\n');

  // // inline-require to avoid loading on client
  // const [
  //   unified,
  //   remarkParse,
  //   remark,
  //   remarkStringify,
  //   remarkPrism,
  //   remarkHtml,
  //   prismjs,
  //   // prismjsLoadLanguages,
  //   marked
  // ] = await Promise.all([
  //   import('unified'),
  //   import('remark-parse'),
  //   import('remark'),
  //   import('remark-stringify'),
  //   import('remark-prism'),
  //   import('remark-html'),
  //   import('prismjs'),
  //   // import('prismjs/components'),
  //   import('marked'),
  // ]);

  // const result = await remark.default()
  //   .use(remarkHtml.default)
  //   .use(remarkPrism.default)
  //   .process(markdown);
  
  // const html = result.toString();



  // // eslint-disable-next-line @typescript-eslint/no-var-requires
  // const loadLangauges = require('prismjs/components');
  // console.log('loadLanguages:', loadLangauges);
  // loadLangauges.default(['javascript', 'js', 'jsx', 'typescript', 'ts', 'markup', 'bash', 'json']);
  // prismjs.default.plugins

  // // prismjs.default.languages.insertBefore
  // // prismjs.languages.extend()
  // // prismjs.default.languages
  // // prismjs.languages

  // marked.default.setOptions({
  //   highlight: function(code, lang) {
  //     console.log('trying:', lang);
  //     if (prismjs.languages[lang]) {
  //       console.log('------------------------');
  //       console.log('highlighting code...');
  //       return prismjs.highlight(code, prismjs.languages[lang], lang);
  //     } else {
  //       console.log('------------------------');
  //       console.log('DID NOT HIGHLIGHT CODE...');
  //       return code;
  //     }
  //   },
  // });

  // const html = marked.parse(markdown);

  // console.log('finished parsing...', html);


  // const result = unified.default()()
  //   .use(remarkParse.default)
  //   .use(remarkStringify.default)
  //   .use(remarkPrism.default, [
  //     'autolinker',
  //     'command-line',
  //     'data-uri-highlight',
  //     'diff-highlight',
  //     'inline-color',
  //     'line-numbers',
  //     'treeview',
  //   ])
  //   .use(remarkHtml.default)
  //   // .process(markdown, (err, file) => {
  //   //   const string = String(file)
  //   //   console.log(string);
  //   //   return string;
  //   // })

  // //   .use

  // // require('unified')
  // // const result = await remark()
  // //   .use(remarkHtml)
  // //   .use(highlight, { include: ['ts', 'typescript'] })
  // //   .use(function (abc) { return abc; })
  // //   .process(markdown);

  // const html = (await result.process(markdown)).toString();

  const html2 = await remark().use(html).use(prism).process(markdown);

  console.log('---------------');
  console.log('processed:');
  console.log(html2);

  return html2.toString();
}

export default Blog;

export const getStaticProps = staticPropsHandler(async ({ publicEnv, npmsApi, ctx, cms, api }) => {
  const blogHtml = await getMd();
  return {
    props: {
      blog: blogHtml,
    },
  };
});