import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (

<div> 
       <p></p>

        <div className="card text-white bg-dark mb-3">
              <div className = "card-header text-center" >
                Manufactured Items
                </div>
              <div className="card-body">
                
                <table className="table table-striped table-dark">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Serial Number</th>
                        <th scope="col">Manufactured Date</th>
                        <th scope="col">Sold Date</th>
                        <th scope="col">Owner</th>
                      </tr>
                    </thead>
                    <tbody id="productList">
                      { this.props.listItems.map((item, key) => {
                        return(
                                <tr key = {key} >
                                  <th scope="row">{item.id.toNumber()}</th>
                                  <td>{item.name}</td>
                                  <td>{item.serialNumber.toNumber()}</td>
                                  <td>{item.manfacturedDate}</td>
                                  <td>{item.soldDate}</td>
                                  <td>{item.owner}</td>
                                </tr> )
                      })}
                      
                      
                    </tbody>
                  </table>
              </div>          
        </div>
    </div>
      
    );
  }
}

export default Main;