import { Toolbar } from "../Toolbar";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import { SimuEngine } from "../SimuEngine";
import { SimuEngineGOL } from "./SimuEngineGOL";

// Toolbar for Boids Simulation
export class ToolbarGOL extends Toolbar {

    private readonly patterns: { name: string, content: string }[] =
        [
            {
                name: "Gosper glider gun",
                content: 
                    "........................O\n"
                    + "......................O.O\n"
                    + "............OO......OO............OO\n"
                    + "...........O...O....OO............OO\n"
                    + "OO........O.....O...OO\n"
                    + "OO........O...O.OO....O.O\n"
                    + "..........O.....O.......O\n"
                    + "...........O...O\n"
                    + "............OO\n"
            },
            {
                name: "Bi gun",
                content: 
                "...........O\n"
                +"..........OO\n"
                +".........OO\n"
                +"..........OO..OO\n"
                +"......................................O\n"
                +"......................................OO........OO\n"
                +".......................................OO.......OO\n"
                +"..........OO..OO..................OO..OO\n"
                +"OO.......OO\n"
                +"OO........OO\n"
                +"...........O\n"
                +"..................................OO..OO\n"
                +".......................................OO\n"
                +"......................................OO\n"
                +"......................................O\n"
            }
        ];

    constructor(simuEngine: SimuEngine) {
        super(simuEngine);
    }

    getButtons(): JSX.Element {
        return (
            <ButtonGroup>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Patterns
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {this.patterns.map((pattern) => (
                            <Dropdown.Item onClick={() => this.parse(pattern.content)}>{pattern.name}</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </ButtonGroup>
        );
    }

    parse(cellsString: string): void {

        if (!cellsString) return;
        const xToYAlive = new Map<string, {i:number, j:number}>();

        let rowCount = 0;
        let maxWidth = 0;
        let lineLength = 0;
        for (let i = 0; i < cellsString.length; i ++) {
            if (cellsString.charAt(i) === 'O') {
                xToYAlive.set(lineLength+'-'+rowCount, {i:lineLength, j:rowCount});
            }
            if (cellsString.charAt(i) === '\n') {
                rowCount ++;
                if (lineLength > maxWidth) {
                    maxWidth = lineLength;
                }
                lineLength = 0;
            }
            else {
                lineLength ++;
            }
        }

        const cellsDim = (this.simuEngine as SimuEngineGOL).getCellsDim();
        const padX = Math.floor((cellsDim.width - maxWidth)/2);
        if (padX < 0) return;
        const padY = Math.floor((cellsDim.height - rowCount)/2);
        if (padY < 0) return;

        const xToYAliveCorrected = new Map<string, {i:number, j:number}>();

        for (const [key,ij] of xToYAlive) {
            const newI = ij.i + padX;
            const newJ = ij.j + padY;
            xToYAliveCorrected.set(newI+'-'+newJ, {i:newI, j:newJ});
        }

        this.simuEngine.updateSettings(xToYAliveCorrected);
    }
}