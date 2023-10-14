import { ButtonGroup, Dropdown } from "react-bootstrap";
import { Toolbar } from "../Toolbar";
import { SimuEngine } from "../SimuEngine";

export class ToolbarSort extends Toolbar {

    getButtons(): JSX.Element {

        return (
            <ButtonGroup>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Algos
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => this.choose('Bubble')}>Bubble</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.choose('Fusion')}>Fusion</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ButtonGroup>
        );
    }

    choose(algo: string) {
        this.simuEngine.updateSettings(algo);
    }
}