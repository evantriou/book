import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// Define the prop types using an interface
export  interface TabCardProps {
    tabName: string;
    description: string;
    onTryClick: () => void;
}

function TabCard(props: TabCardProps) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{props.tabName}</Card.Title>
        <Card.Text>{props.description}</Card.Text>
        <Button variant="primary" onClick={props.onTryClick}>Try</Button>
      </Card.Body>
    </Card>
  );
}

export default TabCard;