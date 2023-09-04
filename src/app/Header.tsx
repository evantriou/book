import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Book</Navbar.Brand>
        <Navbar.Text>Triou Evan</Navbar.Text>
      </Container>
    </Navbar>
  );
}

export default Header;