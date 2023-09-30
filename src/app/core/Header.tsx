import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" style={{ boxShadow: '0px 0px 15px rgba(192, 192, 192, 0.5)' }}>
      <Container>
        <Navbar.Brand href="/book" style = {{justifyContent: 'left'}}>Book</Navbar.Brand>
        <Navbar.Brand href="/contact" style = {{justifyContent: 'left'}}>Contact</Navbar.Brand>
        <Navbar.Brand href="/commingNext" style = {{justifyContent: 'left'}}>Comming next</Navbar.Brand>
        <Navbar.Text>Triou Evan</Navbar.Text>
      </Container>
    </Navbar>
  );
}

export default Header;