import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import 'rc-slider/assets/index.css';
import { SimuEngine } from './SimuEngine';
import SimulationCanvas from './SimulationCanvas';
import { Toolbar } from './Toolbar';

interface SimulationPopupProps {
    selectedSimulation: string;
    closePopup: () => void
}

function SimulationPopup({ selectedSimulation, closePopup }: SimulationPopupProps) {

    const [simuEngine, setSimuEngine] = useState<SimuEngine | null>(null);
    const [simuToolbar, setSimuToolbar] = useState<Toolbar | null>(null);

    const getSimuEngineCallBack = (childEngine: SimuEngine) => {
        setSimuEngine(childEngine);
    }

    const getSimuToolbarCallBack = (childToolbar: Toolbar) => {
        setSimuToolbar(childToolbar);
    }
 
    const close = () => {
        closePopup()
		// Stop the simulation when the pop-up is closed
		if (simuEngine) {
			simuEngine.stopLoop();
		}
	};

    return (
        <Modal show={!!selectedSimulation} centered className="modal-xl">
            <Modal.Header closeButton onClick={close} style={{ backgroundColor: '#555', color: 'antiquewhite' }}>
                <Modal.Title>{selectedSimulation}</Modal.Title>
            </Modal.Header>
            <Modal.Body id="CanvasContainer" style={{ backgroundColor: '#555', color: 'antiquewhite' }}>
                <SimulationCanvas
					selectedSimulation={selectedSimulation}
                    getSimuEngineCallBack = {getSimuEngineCallBack}
                    getSimuToolbarCallBack = {getSimuToolbarCallBack}
				/>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: '#555', color: 'antiquewhite' }}>
                {simuToolbar && simuToolbar.getToolbar()}
            </Modal.Footer>
        </Modal>
    );
}

export default SimulationPopup;



