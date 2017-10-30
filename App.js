import React from 'react';
import { StyleSheet, Text, Button, TextInput, View } from 'react-native';

// Add this line when ready to create QR Reader
import { Constants, BarCodeScanner, Permissions } from 'expo';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addr: '',
      checked: false,
      valid: false,
      balance: 0.0,
      sent: 0.0,
      received: 0.0,
      hasCameraPermission: null
    }
  }

  //////// Text Input and Submit handlers ////////

  _handleTextChange = (value) => {
    this.setState(() => ({
      addr: value
    }));
  }

  _handleSubmitButtonPress = () => {
    fetch('https://blockexplorer.com/api/addr-validate/' + this.state.addr)
    .then(results => {return results.json();})
    .then(data => {
      this.setState(() => ({valid: data}));
      console.log("Valid: " + this.state.valid);
      if (this.state.valid) {
        this.setState(() => ({checked: true}));
        fetch('https://blockexplorer.com/api/addr/' + this.state.addr + '/balance')
        .then(results => {return results.json();})
        .then(data => {
          console.log(data);
          this.setState(() => ({
            balance: data
          }));
        });
        fetch('https://blockexplorer.com/api/addr/' + this.state.addr + '/totalSent')
        .then(results => {return results.json();})
        .then(data => {
          console.log(data);
          this.setState(() => ({
            sent: data
          }));
        });
        fetch('https://blockexplorer.com/api/addr/' + this.state.addr + '/totalReceived')
        .then(results => {return results.json();})
        .then(data => {
          console.log(data);
          this.setState(() => ({
            received: data
          }));
        });
      }
    });
  }


  _handleBalance = (bal) => {
    if (this.state.valid) {
      return("Balance: "  + (bal / 100000000.0) + " BTC")
    }
    if (this.state.checked == true){
      return("Invalid Address")
    }
  }

  _handleSent = (sent) => {
    if (this.state.valid) {
      return("Sent: " + (sent / 100000000.0) + " BTC")
    }
  }

  _handleReceived = (received) => {
    if (this.state.valid) {
      return("Received: " + (received / 100000000.0) + " BTC")
    }
  }

///////////////////Barcode Read Handler////////////////////

  componentDidMount() {
      this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = data => {
    data = data.data
    console.log(data);
    this.setState(() => ({
      addr: data
    }));
    this._handleSubmitButtonPress();
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.barcode}>
        {this.state.hasCameraPermission === null ?
          <Text>Requesting for camera permission</Text> :
          this.state.hasCameraPermission === false ?
            <Text>Camera permission is not granted</Text> :
            <BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              style={{ height: 200, width: 200 }}
            />
        }
        </View>
        <View style={styles.input}>
          <TextInput
            style={{height: 40}}
            placeholder="Enter public Bitcoin address or scan barcode"
            onChangeText={this._handleTextChange}
          />
          <Button
            title="Check Address"
            onPress={this._handleSubmitButtonPress}
          />
          <Text>{this._handleBalance(this.state.balance)}</Text>
          <Text>{this._handleSent(this.state.sent)}</Text>
          <Text>{this._handleReceived(this.state.received)}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcode: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  }
});
