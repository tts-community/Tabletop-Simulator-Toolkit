import * as vscode from "vscode";
import * as ttstkchannels from "ttstk-channels";
import { PrintTtsMessage } from "ttstk-channels/dist/domain/TabletopSimulatorTcpContracts";
import { stringify } from "querystring";
import { resolve } from "dns";

export class TabletopSimulatorObjectsProvider implements vscode.TreeDataProvider<TtsObject>
{
    private service : ttstkchannels.TabletopSimulatorService | undefined = undefined;

    private knownObjects:TtsObject[] = [];

    private parseData = (data : ttstkchannels.TtsMessage)=>
    {
        // if (data.messageID === ttstkchannels.TtsMessageId.ReturnValue)
        // {
        //     this.knownObjects = data.returnValue.map((element: { value: string; guid: any; })=>
        //     {
        //         let value:any = JSON.parse(element.value);
        //         let guid = element.guid;
        //         return new TtsObject(`${guid}::${value.Name}`);
        //     });

        //     this._onResults.fire();
        // }
        vscode.window.showInformationMessage(data.messageID.toString());
    };

    /**
     *
     */
    constructor() {
        this.service = new ttstkchannels.TabletopSimulatorService(this.parseData);
        this.service.Open();
    }
    
    private _onResults: vscode.EventEmitter<TtsObject | undefined> = new vscode.EventEmitter<TtsObject | undefined>();
	readonly onResults: vscode.Event<TtsObject | undefined> = this._onResults.event;

	private _onDidChangeTreeData: vscode.EventEmitter<TtsObject | undefined> = new vscode.EventEmitter<TtsObject | undefined>();
	readonly onDidChangeTreeData: vscode.Event<TtsObject | undefined> = this._onDidChangeTreeData.event;

    refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: TtsObject): vscode.TreeItem {
        if (element.command === undefined){
            element.command = {
                title: '',
                command: 'extension.openTtsObject',
                arguments: [element]
            };
        }
		return element;
    }
    
    getChildren(element?: TtsObject | undefined): vscode.ProviderResult<TtsObject[]> {
        return this.getTtsObjects();
    }

    private getTtsObjects = async (): Promise<TtsObject[]> =>
    {
        let client1 = new ttstkchannels.TabletopSimulatorClient();

        await client1.ExecuteLuaAsync(
// `--LUA get object headers--
// local all = getAllObjects();
// local result = {};
// for index, value in ipairs(all) do 
//     local obj = {}
//     obj['guid'] = value.guid
//     obj['type'] = "object"
//     obj['value'] = value.getJSON()
//     table.insert(result, obj)
// end
// return {};
// `       
"getSimpleObjects()");

        // this should use callbacks or promises or something.

        await new Promise(resolve=>this.onResults((_)=>resolve()));

        var object = [new TtsObject("test")];
        return object;
    };
    
}

export class TtsObject extends vscode.TreeItem
{
    constructor(label:string) {
        super(label, );

    }
}