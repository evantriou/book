import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import logo from './logo192.png' // relative path to image

// Define the prop types using an interface
export  interface TabCardProps {
    tabName: string;
    description: string;
    onTryClick: () => void;
    pathImg: string;
}

function TabCard(props: TabCardProps) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{props.tabName}</Card.Title>
        <Card.Img variant="top" src = {props.pathImg} style={{
            width: '250px', // Set your desired width here
            height: '200px', // Set your desired height here
            objectFit: 'cover', // Maintain aspect ratio and cover the container
          }} />
        <Card.Text>{props.description}</Card.Text>
        <Button variant="primary" onClick={props.onTryClick}>Try</Button>
      </Card.Body>
    </Card>
  );
}

export default TabCard;