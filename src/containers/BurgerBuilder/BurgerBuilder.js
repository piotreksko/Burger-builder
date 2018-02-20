import React, { Component } from 'react';

import Aux from '../../hoc/Auxilliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
  salad: 0.3,
  cheese: 0.5,
  meat: 1.2,
  bacon: 0.8,
};

class BurgerBuilder extends Component {

  state = {
    ingredients: {
      salad: 1,
      bacon: 1,
      cheese: 2,
      meat: 1
    },
    totalPrice: 4,
    purchasing: false,
  }

addIngredientHandler = (type) => {
const currentIngredient = this.state.ingredients[type];

  this.setState(prevState => {
     prevState.ingredients[type] += 1;
     return {
       totalPrice: prevState.totalPrice + INGREDIENT_PRICES[type],
ingredients: prevState.ingredients
     };
   });
}

removeIngredientHandler = (type) => {
const currentIngredient = this.state.ingredients[type];
if(currentIngredient <= 0) {
  return;
}
  this.setState(prevState => {
     prevState.ingredients[type] -= 1;
     return {
       totalPrice: prevState.totalPrice - INGREDIENT_PRICES[type],
ingredients: prevState.ingredients
     };
   });
}

  purchaseHandler = () => {
    this.setState({purchasing: true });
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false})
  }

  purchaseContinueHandler = () => {
    alert('You just confirmed your order.');
  }

  render () {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }
    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          <OrderSummary
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/>
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          price={this.state.totalPrice}
          ordered={this.purchaseHandler}/>
      </Aux>
    );
  }
}

export default BurgerBuilder;
