import React, { Component} from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxilliary';

const withErrorHandler = (WrappedComopnent, axios) => {
  return class extends Component {
        state = {
          error: null
        }
        componentWillMount (){
          this.reqInterceptor = axios.interceptors.request.use(req => {
            this.setState({error: null});
            return req;
          });
          this.resInterceptor = axios.interceptors.response.use(res => res, error=> {
            this.setState({error: error});

      });
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    errorConfirmedHandler = () => {
      this.setState({error: null})
    }

    render () {
      return(
        <Aux>
          <Modal show={this.state.error}
            clicked={this.errorConfirmedHandler}>
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComopnent {...this.props} />
        </Aux>
      );
    }
  }
}

export default withErrorHandler;
