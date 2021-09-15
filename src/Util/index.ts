const NAME_SPECE: any = {};
function getMembers(data: any, target: any) {
  for (let j = 0; j < data.length; j += 1) {
    const current = data[j];
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