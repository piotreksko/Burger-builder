import React, {
  Component
} from 'react';

import Aux from '../../hoc/Auxilliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'


const INGREDIENT_PRICES = {
  salad: 0.3,
  cheese: 0.5,
  meat: 1.2,
  bacon: 0.8,
};

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

  componentDidMount() {
    axios.get('https://burger-builder-4d2b9.firebaseio.com/ingredients.json')
    .then(response => {this.setState({
        ingredients: response.data
      });
    })
    .catch(error => {
      this.setState({error:true})
    });
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
    if (currentIngredient <= 0) {
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
    this.setState({
      purchasing: true
    });
  }

  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false
    })
  }

  purchaseContinueHandler = () => {
    // alert('You just confirmed your order.');

    const queryParams = [];
    for(let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    }
    queryParams.push('price=' + this.state.totalPrice);
    const queryString = queryParams.join('&');
    this.props.history.push({
      pathname: './checkout',
      search: '?' + queryString
  });
  }

  render () {
      const disabledInfo = {
          ...this.state.ingredients
      };
      for ( let key in disabledInfo ) {
          disabledInfo[key] = disabledInfo[key] <= 0
      }
      let orderSummary = null;
      let burger = this.state.error ? <p>Ingredients can not be loaded!</p> : <Spinner />;

      if ( this.state.ingredients ) {
          burger = (
              <Aux>
                  <Burger ingredients={this.state.ingredients} />
                  <BuildControls
                      ingredientAdded={this.addIngredientHandler}
                      ingredientRemoved={this.removeIngredientHandler}
                      disabled={disabledInfo}
                      purchasable={this.state.purchasable}
                      ordered={this.purchaseHandler}
                      price={this.state.totalPrice} />
              </Aux>
          );
          orderSummary = <OrderSummary
              ingredients={this.state.ingredients}
              price={this.state.totalPrice}
              purchaseCancelled={this.purchaseCancelHandler}
              purchaseContinued={this.purchaseContinueHandler} />;
      }
      if ( this.state.loading ) {
          orderSummary = <Spinner />;
      }
      // {salad: true, meat: false, ...}
      return (
          <Aux>
              <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                  {orderSummary}
              </Modal>
              {burger}
          </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
