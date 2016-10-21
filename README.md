# Angular2 - Monaco editor component

[Monaco Editor](https://github.com/Microsoft/monaco-editor/) Angular2 component.
Based on [chrisber](https://gist.github.com/chrisber) [gist](https://gist.github.com/chrisber/ef567098216319784c0596c5dac8e3aa). 

Component is being used as part of an application and thus tailored to suit those requirements, feel free to contribute and make it better, or just use it as an inspiration for your next project.

There are no tests, no builds, just the component.

### Know issues (please read)
Due to the way AMD is being used by Monaco, there is currently no graceful way to integrate Monaco into webpack [Relevant discussion on github](https://github.com/Microsoft/monaco-editor/issues/18#issuecomment-231788869). 

For this reason, ng2-monaco-editor expects Monaco src files to be publicly accessible. This can be achieved in many ways, chrisber's gist suggests a simple symlink:

`mkdir -p src/assets/monaco && cd src/assets/monaco && ln -s ../../../node_modules/monaco-editor/min/vs .`

Another way would be to rely on a webpack plugin:

```typescript
plugins: [
     new CopyWebpackPlugin([
         {
             from: 'node_modules/monaco-editor/min/vs',
             to: './src/assets/monaco',
         }
     ]),
 ],
 ```
 
 Whatever method you are willing to use, this component expects Monaco src files to be situated in **/src/assets/monaco**


### Installation

- `npm install monaco-editor --save`
- `npm install ng2-monaco-editor --save`
- Copy Monaco src into src/assets/monaco, please refer to Known issues section for detailed information.
- Import MonacoEditorComponent in your app.module.ts `import { MonacoEditorComponent } from 'ng2-monaco-editor';`
- Add to your declarations    

### Sample

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'code-editor-page',
  templateUrl: './code-editor-page.component.html',
  styleUrls: ['./code-editor-page.component.css']
})
export class CodeEditorPageComponent implements OnInit {

  code: string = 'function x() {\nconsole.log("Hello world!");\n}';
  language: string = 'javascript';

  constructor() { }

  ngOnInit() {
  }

}
```

```html
<monaco-editor [(ngModel)]="code" [language]="language" ></monaco-editor>
```