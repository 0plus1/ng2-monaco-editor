import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

declare const monaco: any;
declare const require: any;

@Component({
  selector: 'monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonacoEditorComponent),
      multi: true
    }
  ],
})

export class MonacoEditorComponent implements OnInit, AfterViewInit {

  @ViewChild('editor') editorContent: ElementRef;
  @Input() language: string;
  @Input() set value(v:string) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }
  @Output() change = new EventEmitter();
  @Output() instance = null;

  private _editor: any;
  private _value = '';

  constructor() {}

  get value():string { return this._value; };

  ngOnInit() {
  }

  ngAfterViewInit() {

    var onGotAmdLoader = () => {
      // Load monaco
      (<any>window).require.config({ paths: { 'vs': 'assets/monaco/vs' } });
      (<any>window).require(['vs/editor/editor.main'], () => {
        this.initMonaco();
      });
    };

    // Load AMD loader if necessary
    if (!(<any>window).require) {
      var loaderScript = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = 'assets/monaco/vs/loader.js';
      loaderScript.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(loaderScript);
    } else {
      onGotAmdLoader();
    }
  }

  // Will be called once monaco library is available
  initMonaco() {
    var myDiv: HTMLDivElement = this.editorContent.nativeElement;
    this._editor = monaco.editor.create(myDiv,
        {
          value: this._value,
          language: this.language
        });
    this._editor.getModel().onDidChangeContent( (e)=>
    {
      this.updateValue(this._editor.getModel().getValue());
    });
  }

  /**
   * UpdateValue
   *
   * @param value
   */
  updateValue(value:string)
  {
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.change.emit(value);
  }

  /**
   * WriteValue
   * Implements ControlValueAccessor
   *
   * @param value
   */
  writeValue(value:string)
  {
    this._value = value || '';
    if (this.instance)
    {
      this.instance.setValue(this._value);
    }
    // If an instance of Monaco editor is running, update its contents
    if(this._editor)
    {
      this._editor.getModel().setValue(this._value);
    }
  }

  onChange(_){}
  onTouched(){}
  registerOnChange(fn){this.onChange = fn;}
  registerOnTouched(fn){this.onTouched = fn;}

}