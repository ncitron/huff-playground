import { useState } from "react";
import init, { compile } from "huff-wasm";
import VM from "@ethereumjs/vm";
import Common, { Chain, Hardfork } from "@ethereumjs/common";
import { BN } from "bn.js";
import { example } from "./example";

function App() {

    let [code, setCode] = useState<string>(example);
    let [bytecode, setBytecode] = useState<string>("");
    let [returnData, setReturnData] = useState<string>("");

    function handleCompile(event: any) {
        event.preventDefault();
        init().then(() => {
            let bytecode = compile(code);
            setBytecode(bytecode);
        });
    }

    function handleExecute(event: any) {
        let runtimeBytecode = bytecode.slice(18);
        console.log(runtimeBytecode);
        (async () => {
            const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.MuirGlacier});
            const vm = new VM({ common });
            vm.on('step', () => {})
            const result = await vm.runCode({
                code: Buffer.from(runtimeBytecode, "hex"),
                gasLimit: new BN(0xffffffffffff)
            });
            setReturnData(result.returnValue.toString("hex"));
        })();
    }

    return (
        <div style={{margin: "auto", width: "60%"}}>
            <form onSubmit={handleCompile}>
                <div>
                    <h2>Huff Code</h2>
                    <textarea
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        rows={25}
                        cols={100}
                    />
                </div>
                <button type="submit">Compile</button>
            </form>
            <h2>Generated Bytecode</h2>
            0x{bytecode}
            <br />
            <br />
            <button onClick={handleExecute}>Execute</button>
            <h2>Return Data</h2>
            0x{returnData}
        </div>
    );
}

export default App;
