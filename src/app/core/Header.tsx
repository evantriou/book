import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
  return (
    <Navbar expand="lg" className="Header">
      <Container>
        <Navbar.Brand href="/book" className="HeaderEntry">Book</Navbar.Brand>
        <Navbar.Brand href="/contact" className="HeaderEntry">Contact</Navbar.Brand>
        <Navbar.Text className="HeaderEntryName">Triou Evan</Navbar.Text>
      </Container>
    </Navbar>
  );
}

export default Header;