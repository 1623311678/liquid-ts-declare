
import {
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  Position
} from 'vscode-languageserver/node';

import {
  TextDocument
} from 'vscode-languageserver-textdocument';

interface NS_DTS_LOCAL {
  [key: string]: any
}

import { Token } from "../token";


const startFlag = "{%comment%}";
const endFlag = "{%endcomment%}";

const NAME_SPECE: any = {};
function getMembers(data: any, target: any) {
  for (let j = 0; j < data.length; j += 1) {
    const current = data[j];
    if(!data[j] || !data[j].name)return;
    const name = data[j].name.escapedText;
    if (current?.type?.members) {
      const curTypeMembers = current.type.members;
      target[name] = {};
      getMembers(curTypeMembers, target[name]);
    } else if (current?.type?.typeArguments) {
      const typeArguments = current?.type?.typeArguments;
      const curArgument: any = (target[name] = {});
      const typeName = current.type.typeName.escapedText;
      curArgument[typeName] = {};
      getMembers(typeArguments[0]?.members, curArgument[typeName]);
    } else if(current?.type?.elementType){
			const curElementType = current?.type?.elementType;
			const curElement:any = target[name] = {};
			curElement['Array'] = {};
			getMembers(curElementType?.members, curElement['Array']);
		}else {
      target[name] = {};
    }
  }
}
function getNameSpace(data: any[]) {
  for (let i = 0; i < data.length; i += 1) {
    const current = data[i].compilerNode;
    const currentName = current.name.escapedText;
    if (!NAME_SPECE[currentName]) {
      NAME_SPECE[currentName] = {};
      const members = current.members;
      getMembers(members, NAME_SPECE[currentName]);
    }
  }
}
export function getNameSpaceObjByFile(files:any[]){
	for(let n = 0;n<files.length;n+=1){
		const interfaces = files[n].getInterfaces();
		getNameSpace(interfaces);
	}
	return NAME_SPECE;
}

export function getSuggestions(
    document: TextDocument,
  linePrefix: string,
    nsDTS: NS_DTS_LOCAL
  ): CompletionItem[]{
  let res: CompletionItem[] = [];

  function generate(declareObj: NS_DTS_LOCAL, linePrefix: string, key: string) {
    for (const key2 in declareObj) {
      // console.log(linePrefix, 'linePrefix------');
      if (linePrefix.endsWith(`${key}.`)) {
        res.push(
          {
            label: `${key2}`,
            kind: CompletionItemKind.Method
          }
        );
      }
    }
  }

  function getDeclareArrByMap(map: NS_DTS_LOCAL, linePrefix: string) {
    res = [];
    const interateMap = map;
    let declare: any = {};
    for (const key in interateMap) {
      const declareObj = nsDTS[map[key]];
      declare = declareObj;
      generate(declareObj, linePrefix, key);
    }
    function interate(params: NS_DTS_LOCAL, K: string) {
      generate(params, linePrefix, K);
      for (const keyP in params) {
        if (Object.keys(params[keyP]).length > 0) {
          interate(params[keyP], keyP);
        }
      }
    }
    for (const keyD in declare) {
      const params = declare[keyD];
      interate(params, keyD);
    }
  }


  const data = document.getText();

  let codeString = data
    .replace(/\n/g, "")
    .replace(/' '/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, "");
  const startIndex = codeString.indexOf(startFlag);
  const endIndex = codeString.indexOf(endFlag);
  codeString = codeString.slice(
    startIndex + startFlag.length,
    endIndex
  );
  const token = new Token(codeString);

  const declareMap = token.getDeclareMap();

  getDeclareArrByMap((declareMap as NS_DTS_LOCAL), linePrefix);
  return res;
}