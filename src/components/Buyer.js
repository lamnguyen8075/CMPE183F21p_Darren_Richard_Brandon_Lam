import React, { Component } from 'react';

class Buyer extends Component {

  render() {
    return (
        <div className = "container-fluid" id="content">
       
         

            <div className="card text-white bg-dark mb-3">
              <div className = "card-header text-center" >
                Sell Item
                </div>
              <div className="card-body">
                <form onSubmit ={(event) => {
                      event.preventDefault()
                      const newOwner = this.newOwner.value
                      const sNumber = this.sNumber.value
                      this.props.sellItem(sNumber, newOwner)
                    }}>
                    <div className="form-group mr-sm-2">
                          <input
                            id="serialNumber"
                            autoComplete = "off"
                            type="text"
                            ref = {(input) => {this.sNumber = input }}
                            className="form-control"
                            placeholder="Serial Number"
                            required />
                        </div>
                        <div className="form-group mr-sm-2">
                          <input
                            id="newOwner"
                            autoComplete = "off"
                            type="text"
                            ref = {(input) => {this.newOwner = input }}
                            className="form-control"
                            placeholder="New Owner Address"
                            required />
                        </div>
                    
                    <button type="submit" className="btn btn-secondary">Sell Item</button>
                </form>
              </div>
            </div>

      
          
        </div>

    
    );
  }
}

export default Buyer;