import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import LegitHub from '../abis/LegitHub.json'
import Navbar from './Navbar'
import Main from './Main'
import Buyer from './Buyer'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.eth_requestAccounts
    }
    else if (window.web3) {
      window.web3 = new Web3(window.ethereum)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = LegitHub.networks[networkId]
    if(networkData) {
      const legithub = web3.eth.Contract(LegitHub.abi, networkData.address)
      //console.log(legithub)

      this.setState({ legithub })
      const itemCount = await legithub.methods.itemCount().call()
      //console.log(itemCount.toNumber())
      this.setState({ itemCount })
      
      const manufacturer = await legithub.methods.manufacturer().call();
      this.setState({manufacturer: manufacturer})
      //console.log(manufacturer)
      // Load products
      for (var i = 1; i <= itemCount; i++) {
        const allItems = await legithub.methods.items(i).call()
        //console.log(allItems)
        this.setState({
          items: [...this.state.items, allItems]
        })
      }

      var manufacturerFlag = false
      if (this.state.manufacturer.toLowerCase() === this.state.account.toLowerCase()) {
        manufacturerFlag = true;
      }
      this.setState({manufacturerFlag: manufacturerFlag})
      //console.log(manufacturerFlag)

    

      //this.setState({ loading: false})

    } 
    else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      itemCount: 0,
      items: [],
      manufacturer: "NOT SET",
      serialNumber: 0,
      manufacturerFlag: false,
      message6: " ",
      message7: " ",
      message8: " ",
      itemExists: false
      //loading: true
    }


    this.addItem = this.addItem.bind(this)
    this.sellItem = this.sellItem.bind(this)
    this.verifyItem = this.verifyItem.bind(this)
    this.resellItem = this.resellItem.bind(this)




  }


  async addItem(serialNumber, name) {
    //this.setState({loading: true})
    var itemExists = false
    itemExists = await this.state.legithub.methods.itemExists(serialNumber).call()
    //console.log(itemExists)
    var goodSerial = await this.state.legithub.methods.validSerial(serialNumber).call()


    if(itemExists === true) {
      this.setState({message6: "This serial number is already taken!" });

    }

    else if (goodSerial === false) {
      this.setState({message6: "Invalid serial number size!" });
    }
    else {
      var tempDate = new Date()
      var stringDate = (tempDate.getMonth() + 1) + '/' + tempDate.getDate() + '/' + tempDate.getFullYear() 
                        + " " + tempDate.getHours() + ":" + tempDate.getMinutes() + ":" + tempDate.getSeconds()
      //itemAdded = this.state.legithub.methods.addItem(serialNumber, name, stringDate).send({from: this.state.account})
      this.state.legithub.methods.addItem(serialNumber, name, stringDate).send({from: this.state.account})
      .once('confirmation', (receipt) => {
        //this.setState({loading: false})
        window.location.reload()
      })
      this.setState({message6: "Item being created, accept transaction in Metamask" });

      
    }

    


  }

  async sellItem(serialNumber, newOwner) {
    var sellItemExist = false
    sellItemExist = await this.state.legithub.methods.itemExists(serialNumber).call()
    var isOwner = false
    isOwner = await this.state.legithub.methods.compareSendertoOwner(serialNumber).call()
    var currentOwner  = await this.state.legithub.methods.getOwner(serialNumber).call() 

    if(sellItemExist === false) {
      this.setState({message7: "Item doesn't exists!" });

    }

    else if (isOwner === false) {
      this.setState({message7: "You can't sell this item, you aren't the owner!" });
    }

    else if (currentOwner === newOwner) {
      this.setState({message7: "Error, you are trying to sell the item to yourself!" });
  }
    else {
      var tDate= new Date()
      var sDate = (tDate.getMonth() + 1) + '/' + tDate.getDate() + '/' + tDate.getFullYear()
                  + " " + tDate.getHours() + ":" + tDate.getMinutes() + ":" + tDate.getSeconds()
      this.state.legithub.methods.sellItem(serialNumber, sDate, newOwner).send({from: this.state.account})
      .once('confirmation', (receipt) => {
        //this.setState({loading: false})
        window.location.reload()
      })
      this.setState({message7: "Selling item, accept transaction in Metamask" });
    }
    
  }

  async resellItem(serialNumber, newOwner) {
    var owner = await this.state.legithub.methods.getOwner(serialNumber).call()
    
    var resellItemExist = false
    resellItemExist = await this.state.legithub.methods.itemExists(serialNumber).call()


    if(resellItemExist === false) {
      this.setState({message8: "Item doesn't exists!" });

    }

    else if (owner !== this.state.account) {
      this.setState({message8: "You can't sell this item, you aren't the owner!" });
    }

    else if (owner === newOwner) {
      this.setState({message8: "Error, you are trying to sell the item to yourself!" });
    }

    else {
      var resellDate= new Date()
      var resellSDate = (resellDate.getMonth() + 1) + '/' + resellDate.getDate() + '/' + resellDate.getFullYear()
                        + " " + resellDate.getHours() + ":" + resellDate.getMinutes() + ":" + resellDate.getSeconds()
      this.state.legithub.methods.resellItem(serialNumber, resellSDate, newOwner).send({from: this.state.account})
      .once('confirmation', (receipt) => {
        //this.setState({loading: false})
        window.location.reload()
      })
      this.setState({message8: "Selling item, accept transaction in Metamask" });
    }
    
  }


  async verifyItem(serialNumber) {
    var date = await this.state.legithub.methods.getSoldDate(serialNumber).call()
    //console.log(date)
    var verified = await this.state.legithub.methods.verifyItem(serialNumber).call()
    console.log(verified)
    if (verified === true){
        this.setState({message6: "This item is legit! Date Sold: " + date });
      }
    else {
      this.setState({message6: "This item either doesn't exist or you bought a fake."});
      }
  }

  

  
  render() {
    if (this.state.manufacturerFlag === true) { //manufacturer view
        return (

          <div>
            <Navbar account = {this.state.account}/>
             <section className="jumbotron background-dark">
                <div className="container">
                  <h1 className="display-4">Welcome to LegitHub</h1>
                      <p className="lead text-muted">You are logged in as the manufacturer.</p>
                      <p> </p>
                      <p className = "lead text-muted">1. Once an item is manufactured, enter in the item name and a unique 8 digit serial number.</p>

                      <p className = "lead text-muted">2. Once an item is sold in store or online, enter the item's serial number and the address of the owner.</p>
                </div>
              </section>

            <div className="container-fluid mt-5">
              <div className="row">
                <main role="main" className="col-lg-12 d-flex">

                  { this.state.loading
                    ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                    : 

                    <div className = "container-fluid" id="content">
                     <p></p>
                      <div className="row">
                        <div className="col-sm-6">

                          <div className="card text-white bg-dark mb-3">
                            <div className = "card-header text-center"  >
                              Create Item
                              </div>
                            <div className="card-body">
                              <form onSubmit ={(event) => {
                                  event.preventDefault()
                                  const name = this.name.value
                                  const serialNumber = this.serialNumber.value
                                  //const manufacturedDate = this.manufacturedDate.value

                                  this.addItem(serialNumber, name)
                                }}>
                                  <div className="form-group mr-sm-2">
                                    <input
                                      id="itemName"
                                      autoComplete = "off"
                                      type="text"
                                      ref = {(input) => {this.name = input }}
                                      className="form-control"
                                      placeholder="Item Name"
                                      required />
                                  </div>
                                  <div className="form-group mr-sm-2">
                                    <input
                                      id="serialNumber"
                                      autoComplete = "off"
                                      type="text"
                                      ref = {(input) => {this.serialNumber = input }}
                                      className="form-control"
                                      placeholder="Serial Number"
                                      required />
                                  </div>
                                  
                                  <button type="submit" className="btn btn-secondary">Create Item</button>
                              </form>
                              <p> </p>
                              <p>{this.state.message6}</p>
                            </div>
                          </div>

                        </div>
                        <div className="col-sm-6">

                          <div className="card text-white bg-dark mb-3">
                            <div className = "card-header text-center" >
                              Sell Item
                              </div>
                            <div className="card-body">
                              <form onSubmit ={(event) => {
                                    event.preventDefault()
                                    const newOwner = this.newOwner.value
                                    const sNumber = this.sNumber.value
                                    this.sellItem(sNumber, newOwner)
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
                              <p> </p>
                              <p>{this.state.message7}</p>
                            </div>
                          </div>

                        </div>
                        
                      </div>
                      
                      <p>&nbsp;</p>

                      <Main listItems = {this.state.items} /> 
                      
                    </div>
                  }
         
                </main>
              </div>
            </div>
          </div>
        );
}

      else { //customer view

        return (

          <div>
            <Navbar account = {this.state.account}/>
            <section className="jumbotron background-dark">
                <div className="container">
                  <h1 className="jumbotron-heading">Welcome to LegitHub!</h1>
                  <p className="lead text-muted">To verify your item, enter the 8 digit serial number.  If item's sold date doesn't match the actual date you bought the item, you may have bought a fake.</p>
                  <p>
                    
                  </p>
                </div>
              </section>

            <div className="container-fluid mt-5">
              <div className="row">
                <main role="main" className="col-lg-12 d-flex">
                    { this.state.loading
                    ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                    : 
                    <div className = "container-fluid" id="content">
                         <p></p>
                          <div className="row">
                            <div className="col-sm-6">

                              <div className="card text-white bg-dark mb-3">
                                <div className = "card-header text-center"  >
                                  Verify Your Item
                                  </div>
                                <div className="card-body">
                                  <form onSubmit ={(event) => {
                                      event.preventDefault()
                                    
                                      const userSerialNumber = this.userSerialNumber.value
                                      //const manufacturedDate = this.manufacturedDate.value

                                      this.verifyItem(userSerialNumber)
                                    }}>
                                
                                      <div className="form-group mr-sm-2">
                                        <input
                                          id="userSerialNumber"
                                          autoComplete = "off"
                                          type="text"
                                          ref = {(input) => {this.userSerialNumber = input }}
                                          className="form-control"
                                          placeholder="Serial Number"
                                          required />
                                      </div>
                                      
                                      <button type="submit" className="btn btn-secondary">Verify Item</button>
                                  </form>
                                  <p> </p>
                                  <p>{this.state.message6}</p>
                                </div>
                              </div>

                            </div>
                            <div className="col-sm-6">

                              <div className="card text-white bg-dark mb-3">
                                <div className = "card-header text-center" >
                                  Resell Item
                                  </div>
                                <div className="card-body">
                                  <form onSubmit ={(event) => {
                                        event.preventDefault()
                                        const resellOwner = this.resellOwner.value
                                        const resellNumber = this.resellNumber.value
                                        this.resellItem(resellNumber, resellOwner)
                                      }}>
                                      <div className="form-group mr-sm-2">
                                            <input
                                              id="resellNumber"
                                              autoComplete = "off"
                                              type="text"
                                              ref = {(input) => {this.resellNumber = input }}
                                              className="form-control"
                                              placeholder="Serial Number"
                                              required />
                                          </div>
                                          <div className="form-group mr-sm-2">
                                            <input
                                              id="resellOwner"
                                              autoComplete = "off"
                                              type="text"
                                              ref = {(input) => {this.resellOwner = input }}
                                              className="form-control"
                                              placeholder="New Owner Address"
                                              required />
                                          </div>
                                      
                                      <button type="submit" className="btn btn-secondary">Resell Item</button>
                                  </form>
                                  <p> </p>
                                  <p>{this.state.message8}</p>
                                </div>
                              </div>

                            </div>
                          </div>

                          
                          <p>&nbsp;</p>

                      </div>
                    }
             
                </main>
              </div>
            </div>
          </div>
        );
}
      

      
  }
}

export default App;


