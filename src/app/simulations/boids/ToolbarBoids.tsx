import { Toolbar } from "../Toolbar";
import { ButtonGroup } from "react-bootstrap";

export class ToolbarBoids extends Toolbar {
    getButtons(): JSX.Element {
        return (
            <ButtonGroup>
            </ButtonGroup>
        );
    }
}