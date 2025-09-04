import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';

const QuantityStepper = ({ productId, quantity }) => {
  const { updateQuantity } = useCart();

  const handleDecrease = () => {
    updateQuantity(productId, quantity - 1);
  };

  const handleIncrease = () => {
    updateQuantity(productId, quantity + 1);
  };

  return (
    <ButtonGroup size="sm" className="quantity-stepper">
      <Button 
        variant="outline-secondary"
        onClick={handleDecrease}
        disabled={quantity <= 1}
      >
        -
      </Button>
      <Button variant="outline-secondary" disabled>
        {quantity}
      </Button>
      <Button 
        variant="outline-secondary"
        onClick={handleIncrease}
      >
        +
      </Button>
    </ButtonGroup>
  );
};

export default QuantityStepper;