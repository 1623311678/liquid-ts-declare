

## liquid-ts-declare

One vscode plugin that can use TS declarations in [liquid](https://liquidjs.com/) files .

If you write liquid in vscode, an HTML template language created by shofiy, and want to use ts declarations in it so that you can use autocomplete, this library can help.

for example:

<img src="https://user-images.githubusercontent.com/41052302/133552215-0fa2d3bb-a6e0-4b4e-a3ff-a37117563732.jpg" width="300px;height:200px">

### 1 install：

Open your vscode and search for [liquid-ts-declare](https://marketplace.visualstudio.com/items?itemName=liquid-ts-declare.liquid-ts-declare) in the extension. Then download the plug-in and restart vscode.

![image](https://user-images.githubusercontent.com/41052302/133555167-aeec9691-4adc-4dcf-a163-895c0e0bc56e.png)

### 2 how to use:
 #### 1) Create folder: 
   Create folder a and create a types folder.you can call it anything, like test in this case.
 To initialize the tsconfig.json file, run the tsc --init command in the test directory (the project root directory).After that, you'll notice that you have the tsconfig.json     file in your test directory.
      
 #### 2) generate .d.ts files :
  .d.ts files are very important to us, We recommend using the tsc command to generate.d.ts files. Of course you can also create your own .d.ts files and write your own         declarations in them. Then find the declaration property in the tsconfig.json file and set it to true so that when we run tsc to compile ts to js.
  when we run tsc command ,will auto generate .d.ts files which contain your ts declare .
  
 If you can not use tsc command you can run the command:
 ```
    npm install typescript -g
 ```
 #### 2) create your liquid file and use ts declare:
 
 create one file named a.liquid and use some declare in it. for example:
 
 ```javascript
{% comment %} 
aa:SubscribeEmailDataType
{% endcomment %}
<div>{{aa.settings.title.height}}</div>
 ```
 our a.d.ts files:
 
 ```typescript
 export interface SubscribeEmailDataType {
    settings?: {
        title?: {
            wight: string;
            height: string;
        };
        sub_title?: string;
        title_size?: "40" | "30" | "20";
        button_label?: string;
        price?: number;
        sub_title_size?: "24" | "20" | "16";
        title_uppercase?: boolean;
        sub_title_uppercase?: boolean;
        button_uppercase?: boolean;
        thank_title?: string;
        thank_sub_title?: string;
        btn_border_color?: string;
        button_variant?: 'fill' | 'outlined';
        alignment?: '';
    };
    blocks: {
        image_src?: string;
        logo_url?: string;
        title?: string;
        text?: string;
        title_size?: "40" | "30" | "20";
        text_size?: "20" | "16" | "12";
        title_uppercase?: boolean;
        text_uppercase?: boolean;
    }[];
}
 ````
 
 Then when we type aa.  the lake automatically prompts Settings and blocks, when we type aa.Settings. Will prompt you for the declaration in Settings  .
 
 If the declaration contains an array, you can access it this way(Take the interface SubscribeEmailDataType as an example):
 
 aa.block.Array.image_src 
 
 ## Tips:
 
 #### 1) Make sure there is a types directory in the root directory and that all .d.ts files are in the types directory.
 #### 2) The ts declaration must be exported, otherwise when you run the tsc command, the generated .d.ts file will not contain your declaration.
 #### 3) There is no need to import where declarations are used, just as in step 2 .
 #### 4) what is {% comment %} {% endcomment %} ?
The comment tag lets you write in the Liquid template without output. Anything written between the start and end of comment tags will not be printed, or executed if it is Liquid code.
 
 
 ### Thanks to 
  - [VSCode HTML snippets](https://github.com/abusaidm/html-snippets/issues/27#issuecomment-282512411)
  - [LSP Sample](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)
